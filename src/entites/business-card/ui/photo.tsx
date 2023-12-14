import { Slot } from '@radix-ui/react-slot'
import { cva, VariantProps } from 'class-variance-authority'
import { HTMLAttributes, PropsWithoutRef } from 'react'
import { cn } from '~/shared/lib/shadcn'

const photoContainerVariants = cva(
  'flex justify-center items-center bg-accent rounded-full shadow-[0_12px_48px_-12px_rgba(0,0,0,0.2)] border-[5px] border-background relative overflow-hidden',
  {
    variants: {
      size: {
        default: 'w-28 h-28 -mt-14',
        sm: 'w-24 h-24 -mt-12',
        md: 'w-28 h-28 -mt-14',
        lg: 'w-32 h-32 -mt-16',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

interface PhotoContainerProps
  extends PropsWithoutRef<HTMLAttributes<HTMLDivElement>>,
    VariantProps<typeof photoContainerVariants> {
  asChild?: boolean
}

export const PhotoContainer = ({
  className,
  asChild,
  size,
  ...props
}: PhotoContainerProps) => {
  const Component = asChild ? Slot : 'div'

  return (
    <Component
      {...props}
      className={cn(photoContainerVariants({ size, className }))}
    />
  )
}

export const Photo = ({ src }: { src: string }) => {
  return <img src={src} className="h-full w-full object-cover" alt="avatar" />
}
