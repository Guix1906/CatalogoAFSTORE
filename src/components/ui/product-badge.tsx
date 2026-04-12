import { cn } from "@/lib/utils";

type BadgeType = "novo" | "oferta" | "mais-vendido";

const labelMap: Record<BadgeType, string> = {
  novo: "NOVO",
  oferta: "OFERTA",
  "mais-vendido": "MAIS VENDIDO",
};

export const ProductBadge = ({ type, className }: { type: BadgeType; className?: string }) => (
  <span
    className={cn(
      "rounded-full border px-2 py-1 text-[10px] font-bold tracking-wide",
      type === "oferta" && "border-gold bg-gold/20 text-gold-light",
      type === "novo" && "border-gold/50 bg-secondary text-foreground",
      type === "mais-vendido" && "border-gold/70 bg-gold/10 text-gold",
      className,
    )}
  >
    {labelMap[type]}
  </span>
);
