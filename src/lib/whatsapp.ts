import { Product } from "@/types/product";

const WHATSAPP_NUMBER = "5599985530617";

export const defaultWhatsAppMessage = encodeURIComponent("Olá! Vim pelo catálogo da AF STORE, pode me ajudar?");

export const buildProductWhatsAppMessage = (product: Product, size?: string, color?: string) =>
  encodeURIComponent(
    `Olá! Vim pelo catálogo da AF STORE 🛍️\n` +
      `Produto: ${product.name}\n` +
      `Tamanho: ${size || "A definir"}\n` +
      `Cor: ${color || "A definir"}\n\n` +
      "Pode me ajudar com mais informações?",
  );

export const getProductWhatsAppUrl = (product: Product, size?: string, color?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${buildProductWhatsAppMessage(product, size, color)}`;

export const getDefaultWhatsAppUrl = () => `https://wa.me/${WHATSAPP_NUMBER}?text=${defaultWhatsAppMessage}`;
