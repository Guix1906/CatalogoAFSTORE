import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  discount?: number;
  className?: string;
  size?: 'sm' | 'lg';
}

export default function PriceDisplay({ price, originalPrice, discount, className, size = 'sm' }: PriceDisplayProps) {
  const format = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <div className="flex items-baseline gap-2">
        <span className={cn(
          'font-bold text-brand-gold',
          size === 'lg' ? 'text-2xl' : 'text-sm'
        )}>
          {format(price)}
        </span>
        {originalPrice && (
          <span className="text-[10px] text-brand-text-muted line-through">
            {format(originalPrice)}
          </span>
        )}
      </div>
      {discount && (
        <span className="text-[10px] text-brand-whatsapp font-bold">
          {discount}% OFF
        </span>
      )}
    </div>
  );
}
