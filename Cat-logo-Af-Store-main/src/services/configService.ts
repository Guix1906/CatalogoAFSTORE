import { AppConfig } from '../types';
import { supabase } from '../integrations/supabase/client';

export const configService = {
  async getConfig(): Promise<AppConfig> {
    const { data, error } = await supabase
      .from('app_config')
      .select('whatsapp_number, whatsapp_message')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return {
        whatsappNumber: '5599985530617',
        whatsappMessage: 'Olá! Vim pelo catálogo da AF STORE, pode me ajudar?',
      };
    }

    return {
      whatsappNumber: data.whatsapp_number,
      whatsappMessage: data.whatsapp_message,
    };
  },

  async updateConfig(payload: AppConfig): Promise<void> {
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
        })
        .eq('id', current.id);

      if (error) throw error;
      return;
    }

    const { error } = await supabase.from('app_config').insert({
      whatsapp_number: payload.whatsappNumber,
      whatsapp_message: payload.whatsappMessage,
    });

    if (error) throw error;
  },

  async getWhatsAppUrl(customMessage?: string): Promise<string> {
    const config = await this.getConfig();
    const message = encodeURIComponent(customMessage || config.whatsappMessage);
    return `https://wa.me/${config.whatsappNumber}?text=${message}`;
  }
};
