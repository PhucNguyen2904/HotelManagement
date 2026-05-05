import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  endIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, endIcon, type = 'text', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1 block text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-secondary)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              'block w-full rounded-md border-x-0 border-t-0 border-b px-3 py-2',
              'border-[var(--color-secondary)] bg-[rgba(255,255,255,0.45)] text-[var(--color-primary)] placeholder-[var(--color-text)]/55',
              'focus:border-[var(--color-secondary)] focus:outline-none focus:ring-0',
              'disabled:bg-[rgba(255,255,255,0.35)] disabled:text-[var(--color-text)]/60',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              endIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {endIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {endIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
