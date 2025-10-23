import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import clsx from 'clsx';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={clsx(
      'w-full rounded-md border border-charcoal/20 px-3 py-2 text-sm shadow-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/40',
      className
    )}
    {...props}
  />
));

Textarea.displayName = 'Textarea';
