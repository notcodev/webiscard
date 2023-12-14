import { cva, type VariantProps } from 'class-variance-authority'
import { createElement, HTMLAttributes } from 'react'
import { cn } from '~/shared/lib/shadcn'

const titleVariants = cva('', {
  variants: {
    order: {
      1: 'text-4xl font-extrabold',
      2: 'text-3xl font-semibold',
      3: 'text-2xl font-semibold',
      4: 'text-xl font-semibold',
    },
  },
})

type TitleVariantProps = VariantProps<typeof titleVariants>
type RequiredVariants = 'order'

type TitleProps = HTMLAttributes<HTMLHeadElement> &
  Omit<TitleVariantProps, RequiredVariants> &
  Required<Pick<TitleVariantProps, RequiredVariants>>

export const Title = ({ className, order, ...props }: TitleProps) => {
  return createElement(`h${order}`, {
    className: cn(titleVariants({ order, className })),
    ...props,
  })
}
