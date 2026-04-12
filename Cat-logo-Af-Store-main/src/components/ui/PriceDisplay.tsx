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
          'font-sans font-extrabold text-brand-gold tracking-tight',
          size === 'lg' ? 'text-3xl' : 'text-base'
        )}>
          {format(price)}
        </span>
        {originalPrice && (
          <span className="text-[10px] font-sans font-medium text-brand-text-muted line-through opacity-50">
            {format(originalPrice)}
          </span>
        )}
      </div>
      {discount && (
        <span className="text-[9px] font-sans font-black text-brand-whatsapp uppercase tracking-widest">
          Performance Discount • {discount}% OFF
        </span>
      )}
    </div>
  );
}
