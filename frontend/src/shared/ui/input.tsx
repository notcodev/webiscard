import * as React from 'react'
import { cn } from '~/shared/lib/shadcn'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | null
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'text-red-500 placeholder:text-red-500 border-red-500 focus-visible:ring-0'
            : null,
          className,
        )}
        ref={ref}
        aria-errormessage={error ?? undefined}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
