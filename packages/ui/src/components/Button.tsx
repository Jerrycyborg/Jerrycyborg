import type { ButtonHTMLAttributes, ReactNode, ReactElement } from 'react';
import { forwardRef, isValidElement, cloneElement } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
  children: ReactNode;
}

const sizeStyles: Record<string, string> = {
  sm: 'px-2.5 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
};

const variantStyles: Record<string, string> = {
  primary: 'bg-teal text-white hover:bg-teal/90',
  secondary: 'bg-saffron text-white hover:bg-saffron/90',
  ghost: 'bg-transparent text-charcoal hover:bg-charcoal/10',
  accent: 'bg-charcoal text-ivory hover:bg-charcoal/90'
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, asChild = false, ...props }, ref) => {
    const classes = clsx(
      'inline-flex items-center justify-center rounded-md font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal disabled:opacity-50 disabled:cursor-not-allowed',
      sizeStyles[size],
      variantStyles[variant],
      className
    );

    if (asChild) {
      if (!isValidElement(children)) {
        throw new Error('Button with asChild expects a valid React element child');
      }
      return cloneElement(children as ReactElement, {
        ...props,
        className: clsx((children as ReactElement).props.className, classes)
      });
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
