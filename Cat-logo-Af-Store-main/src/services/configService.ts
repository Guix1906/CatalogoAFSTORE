import { AppConfig } from '../types';
import { supabase } from '../integrations/supabase/client';

export const configService = {
  async getConfig(): Promise<AppConfig> {
    return configData as AppConfig;
  },

  getWhatsAppUrl(customMessage?: string): string {
    const config = this.getConfig();
    const message = encodeURIComponent(customMessage || config.whatsappMessage);
    return `https://wa.me/${config.whatsappNumber}?text=${message}`;
  }
};
