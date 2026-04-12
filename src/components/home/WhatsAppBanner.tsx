import { MessageCircle } from "lucide-react";
import { getDefaultWhatsAppUrl } from "@/lib/whatsapp";

export const WhatsAppBanner = () => (
  <section className="rounded-2xl border border-gold/30 bg-card p-4">
    <p className="mb-3 text-sm text-foreground">Dúvidas? Fale direto com a gente 💬</p>
    <a
      href={getDefaultWhatsAppUrl()}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 text-sm font-bold text-primary-foreground"
    >
      <MessageCircle size={16} />
      Chamar no WhatsApp
    </a>
  </section>
);
