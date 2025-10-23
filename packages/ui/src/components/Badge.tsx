import type { HTMLAttributes } from 'react';
import clsx from 'clsx';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'destructive';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantClass = {
    default: 'bg-charcoal/10 text-charcoal',
    accent: 'bg-teal text-ivory',
    destructive: 'bg-red-600 text-white'
  }[variant];

  return <span className={clsx('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', variantClass, className)} {...props} />;
}
