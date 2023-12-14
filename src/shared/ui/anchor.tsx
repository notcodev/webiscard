import { RouteParams } from 'atomic-router'
import { Link, LinkProps } from 'atomic-router-react'
import { cn } from '~/shared/lib/shadcn'

export const Anchor = <Params extends RouteParams>({
  className,
  ...props
}: LinkProps<Params>) => {
  return (
    <Link
      className={cn(
        'text-sm font-medium transition-colors hover:text-primary',
        className,
      )}
      {...props}
    />
  )
}
