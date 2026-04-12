import { formatBRL } from "@/lib/format";

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  discount?: number;
}

export const PriceDisplay = ({ price, originalPrice, discount }: PriceDisplayProps) => (
  <div className="flex items-end gap-2">
    <span className="text-lg font-bold text-gold">{formatBRL(price)}</span>
    {originalPrice ? <span className="text-xs text-muted-foreground line-through">{formatBRL(originalPrice)}</span> : null}
    {discount ? <span className="text-xs font-bold text-gold-light">-{discount}%</span> : null}
  </div>
);
