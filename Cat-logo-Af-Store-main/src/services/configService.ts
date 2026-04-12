import { AppConfig } from '../types';
import configData from '../data/config.json';

export const configService = {
  async getConfig(): Promise<AppConfig> {
    return configData as AppConfig;
  },

  async getWhatsAppUrl(customMessage?: string): Promise<string> {
    const config = await this.getConfig();
    const message = encodeURIComponent(customMessage || config.whatsappMessage);
    return `https://wa.me/${config.whatsappNumber}?text=${message}`;
  }
};
