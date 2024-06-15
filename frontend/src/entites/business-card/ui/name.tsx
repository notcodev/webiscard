import { Slot } from '@radix-ui/react-slot'
import { HTMLAttributes, PropsWithoutRef } from 'react'
import { cn } from '~/shared/lib/shadcn'

interface NameProps extends PropsWithoutRef<HTMLAttributes<HTMLSpanElement>> {
  asChild?: boolean
}

export const Name = ({ className, asChild, ...props }: NameProps) => {
  const Component = asChild ? Slot : 'span'

  return (
    <Component
      className={cn(
        'text-[22px] lg:text-[24px] font-medium text-center rounded-sm bg-transparent w-full px-1 py-0.5 mt-4',
        className,
      )}
      {...props}
    />
  )
}
