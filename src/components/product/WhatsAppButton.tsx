import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  href: string;
  label?: string;
  fixed?: boolean;
}

export const WhatsAppButton = ({ href, label = "Pedir pelo WhatsApp", fixed = false }: WhatsAppButtonProps) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noreferrer"
    animate={{ scale: [1, 1, 1.03, 1] }}
    transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3 }}
    className={`flex items-center justify-center gap-2 rounded-full px-5 py-3 font-bold text-primary-foreground shadow ${
      fixed
        ? "fixed bottom-[5.2rem] left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 bg-whatsapp"
        : "bg-whatsapp"
    }`}
  >
    <MessageCircle size={18} />
    {label}
  </motion.a>
);
