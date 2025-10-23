import type { HTMLAttributes } from 'react';
import clsx from 'clsx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return <div className={clsx('rounded-xl border border-charcoal/10 bg-white', className)} {...props} />;
}
