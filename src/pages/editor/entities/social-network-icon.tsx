import { SocialNetworkConfig } from '~/entites/business-card'

export const SocialNetworkIcon = ({
  gradient,
  icon: Icon,
}: Pick<SocialNetworkConfig, 'icon' | 'gradient'>) => {
  return (
    <div
      className="flex justify-center items-center flex-none w-9 h-9 rounded-md"
      style={{ background: gradient }}
    >
      <Icon className="h-5 w-5 fill-white" />
    </div>
  )
}
