import { Slot } from '@radix-ui/react-slot'
import { cva, VariantProps } from 'class-variance-authority'
import {
  FC,
  forwardRef,
  HTMLAttributes,
  PropsWithoutRef,
  SVGAttributes,
} from 'react'
import { cn } from '~/shared/lib/shadcn'

export const BusinessCard = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center w-[340px] px-8 lg:w-[512px] lg:px-24 pb-6 bg-background rounded-md',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const avatarContainerVariants = cva(
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

interface AvatarContainerProps
  extends PropsWithoutRef<HTMLAttributes<HTMLDivElement>>,
    VariantProps<typeof avatarContainerVariants> {
  asChild?: boolean
}

BusinessCard.PhotoContainer = ({
  className,
  asChild,
  size,
  ...props
}: AvatarContainerProps) => {
  const Component = asChild ? Slot : 'div'

  return (
    <Component
      {...props}
      className={cn(avatarContainerVariants({ size, className }))}
    />
  )
}

BusinessCard.Photo = ({ src }: { src: string }) => {
  return <img src={src} className="h-full w-full object-cover" alt="avatar" />
}

interface NameProps extends PropsWithoutRef<HTMLAttributes<HTMLSpanElement>> {
  asChild?: boolean
}

BusinessCard.Name = ({ className, asChild, ...props }: NameProps) => {
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

interface DescriptionProps
  extends PropsWithoutRef<HTMLAttributes<HTMLSpanElement>> {
  asChild?: boolean
}

BusinessCard.Description = ({
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

interface SocialNetworkProps
  extends PropsWithoutRef<HTMLAttributes<HTMLButtonElement>> {
  config: {
    name: string
    icon: FC<SVGAttributes<SVGElement>>
    gradient: string
  }
}

export const SocialNetworkEntry = forwardRef<
  HTMLButtonElement,
  SocialNetworkProps
>(({ config, ...props }, ref) => {
  const { gradient, name, icon: Icon } = config

  return (
    <div className="flex flex-col gap-2 items-center m-3 lg:mx-5">
      <button
        ref={ref}
        className="flex justify-center items-center flex-none w-16 h-16 rounded-full"
        style={{ background: gradient }}
        {...props}
      >
        <Icon className="h-9 w-9 fill-background" />
      </button>

      <span className="text-xs text-muted-foreground">{name}</span>
    </div>
  )
})
