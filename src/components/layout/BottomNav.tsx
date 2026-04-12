import { motion } from "framer-motion";
import { Home, Layers, Sparkles, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getDefaultWhatsAppUrl } from "@/lib/whatsapp";

const navItems = [
  { label: "Início", to: "/", icon: Home },
  { label: "Categorias", to: "/categorias", icon: Layers },
  { label: "Novidades", to: "/novidades", icon: Sparkles },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gold/40 bg-background/95 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-md grid-cols-4 items-center px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));

          return (
            <Link key={item.label} to={item.to} className="flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground">
              <motion.span animate={isActive ? { scale: 1.08 } : { scale: 1 }} className={cn("flex items-center justify-center", isActive && "text-gold")}
              >
                <Icon size={18} />
              </motion.span>
              <span className={cn(isActive && "text-gold")}>{item.label}</span>
            </Link>
          );
        })}

        <a
          href={getDefaultWhatsAppUrl()}
          target="_blank"
          rel="noreferrer"
          className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-whatsapp text-primary-foreground"
          aria-label="Falar no WhatsApp"
        >
          <MessageCircle size={20} />
        </a>
      </div>
    </nav>
  );
};
