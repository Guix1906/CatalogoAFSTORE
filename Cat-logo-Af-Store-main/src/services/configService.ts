import { AppConfig } from '../types';
import { supabase } from '../integrations/supabase/client';
import configData from '../data/config.json';

export const configService = {
  async getConfig(): Promise<AppConfig> {
    try {
      const { data, error } = await supabase
        .from('app_config')
        .select('*')
        .maybeSingle();

      if (error || !data) {
        console.warn('Using fallback config due to database error or empty table:', error);
        return configData as AppConfig;
      }

      return {
        whatsappNumber: data.whatsapp_number,
        whatsappMessage: data.whatsapp_message,
        // Fallback for missing columns in types.ts but present in types.ts
        heroImageUrl: (data as any).hero_image_url || configData.heroImageUrl,
        heroImageUrls: (data as any).hero_image_urls || configData.heroImageUrls,
      };
    } catch (err) {
      console.error('Config fetch failed:', err);
      return configData as AppConfig;
    }
  },

  async getWhatsAppUrl(customMessage?: string): Promise<string> {
    const config = await this.getConfig();
    const message = encodeURIComponent(customMessage || config.whatsappMessage);
    return `https://api.whatsapp.com/send?phone=${config.whatsappNumber}&text=${message}`;
  },

  async updateConfig(config: AppConfig): Promise<void> {
    const payload = {
      whatsapp_number: config.whatsappNumber,
      whatsapp_message: config.whatsappMessage,
      hero_image_url: config.heroImageUrl,
      hero_image_urls: config.heroImageUrls,
    };

    // We try to update the first row or insert if it doesn't exist
    const { data: existing } = await supabase.from('app_config').select('id').maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('app_config')
        .update(payload)
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('app_config')
        .insert(payload);
      if (error) throw error;
    }
  }
};
