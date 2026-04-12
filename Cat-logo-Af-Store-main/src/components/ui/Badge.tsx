import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'sale' | 'new' | 'default';
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    gold: 'bg-brand-gold text-brand-bg',
    sale: 'bg-brand-gold text-brand-bg',
    new: 'bg-brand-gold text-brand-bg',
    default: 'bg-brand-gold text-brand-bg',
  };

  return (
    <span className={cn(
      'text-[9px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-[0.15em] shadow-sm',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
