import { AppConfig } from '../types';
import { supabase } from '../integrations/supabase/client';

export const configService = {
  async getConfig(): Promise<AppConfig> {
    const { data, error } = await supabase
      .from('app_config')
      .select('whatsapp_number, whatsapp_message, hero_image_url, hero_image_urls')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return {
        whatsappNumber: '5599985530617',
        whatsappMessage: 'Olá! Vim pelo catálogo da AF STORE, pode me ajudar?',
        heroImageUrl: undefined,
        heroImageUrls: [],
      };
    }

    const heroImageUrls = Array.isArray(data.hero_image_urls)
      ? data.hero_image_urls.filter((item): item is string => typeof item === 'string').slice(0, 4)
      : [];

    const fallbackHeroImageUrl = data.hero_image_url ?? undefined;

    return {
      whatsappNumber: data.whatsapp_number,
      whatsappMessage: data.whatsapp_message,
      heroImageUrl: heroImageUrls[0] ?? fallbackHeroImageUrl,
      heroImageUrls: heroImageUrls.length ? heroImageUrls : fallbackHeroImageUrl ? [fallbackHeroImageUrl] : [],
    };
  },

  async updateConfig(payload: AppConfig): Promise<void> {
    const normalizedHeroImageUrls = (payload.heroImageUrls ?? (payload.heroImageUrl ? [payload.heroImageUrl] : []))
      .filter((url): url is string => Boolean(url))
      .slice(0, 4);

    const { data: current } = await supabase
      .from('app_config')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (current?.id) {
      const { error } = await supabase
        .from('app_config')
        .update({
          whatsapp_number: payload.whatsappNumber,
          whatsapp_message: payload.whatsappMessage,
          hero_image_url: normalizedHeroImageUrls[0] ?? payload.heroImageUrl ?? null,
          hero_image_urls: normalizedHeroImageUrls.length ? normalizedHeroImageUrls : null,
        })
        .eq('id', current.id);

      if (error) throw error;
      return;
    }

    const { error } = await supabase.from('app_config').insert({
      whatsapp_number: payload.whatsappNumber,
      whatsapp_message: payload.whatsappMessage,
      hero_image_url: normalizedHeroImageUrls[0] ?? payload.heroImageUrl ?? null,
      hero_image_urls: normalizedHeroImageUrls.length ? normalizedHeroImageUrls : null,
    });

    if (error) throw error;
  },

  async getWhatsAppUrl(customMessage?: string): Promise<string> {
    const config = await this.getConfig();
    const message = encodeURIComponent(customMessage || config.whatsappMessage);
    return `https://wa.me/${config.whatsappNumber}?text=${message}`;
  }
};
