import { AppConfig } from '../types';
import configData from '../data/config.json';

export const configService = {
  getConfig(): AppConfig {
    return configData as AppConfig;
  },

  getWhatsAppUrl(customMessage?: string): string {
    const config = this.getConfig();
    const message = encodeURIComponent(customMessage || config.whatsappMessage);
    return `https://api.whatsapp.com/send?phone=${config.whatsappNumber}&text=${message}`;
  }
};
