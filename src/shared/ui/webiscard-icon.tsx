import { Link } from 'atomic-router-react'
import { Globe } from 'lucide-react'
import { routes } from '~/shared/routing'

interface WebiscardIconProps {
  className?: string
}

export const WebiscardIcon = ({ className }: WebiscardIconProps) => {
  return (
    <Link className={className} to={routes.home}>
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 bg-foreground text-background font-medium rounded-md text-center flex justify-center items-center">
          <Globe />
        </div>
        <span className="font-medium">Webiscard</span>
      </div>
    </Link>
  )
}
