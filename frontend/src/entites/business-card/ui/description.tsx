import { Slot } from '@radix-ui/react-slot'
import { HTMLAttributes, PropsWithoutRef } from 'react'
import { cn } from '~/shared/lib/shadcn'

interface DescriptionProps
  extends PropsWithoutRef<HTMLAttributes<HTMLSpanElement>> {
  asChild?: boolean
}

export const Description = ({
  className,
  asChild,
  ...props
}: DescriptionProps) => {
  const Component = asChild ? Slot : 'span'

  return (
    <Component
      className={cn(
        'text-[14px] lg:text-[16px] text-muted-foreground bg-transparent text-center rounded-sm w-full px-1 py-0.5 mt-1',
        className,
      )}
      {...props}
    />
  )
}
