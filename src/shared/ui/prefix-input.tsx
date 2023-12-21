import { forwardRef } from 'react'
import { cn } from '~/shared/lib/shadcn'
import { InputProps } from '~/shared/ui'

export const PrefixInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, prefix, disabled, ...props }, ref) => {
    return (
      <div
        className={cn(
          'peer flex w-full items-center h-9 rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
          error ? 'border-red-500 focus-within:ring-0' : null,
          className,
        )}
        aria-disabled={disabled}
      >
        <span className={error ? 'text-red-500' : undefined}>{prefix}</span>
        <input
          type="text"
          ref={ref}
          className={cn(
            'w-full bg-transparent transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed',
            error ? 'text-red-500 placeholder:text-red-500' : null,
          )}
          disabled={disabled}
          {...props}
        />
      </div>
    )
  },
)
