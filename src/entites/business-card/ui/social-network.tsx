import { forwardRef, HTMLAttributes, PropsWithoutRef } from 'react'
import { SocialNetworkConfig } from '../configs'

interface SocialNetworkProps
  extends PropsWithoutRef<HTMLAttributes<HTMLButtonElement>> {
  config: Pick<SocialNetworkConfig, 'name' | 'gradient' | 'icon'>
}

export const SocialNetwork = forwardRef<HTMLButtonElement, SocialNetworkProps>(
  ({ config, ...props }, ref) => {
    const { gradient, name, icon: Icon } = config

    return (
      <div className="flex flex-col gap-2 items-center m-3 lg:mx-5">
        <button
          ref={ref}
          className="flex justify-center items-center flex-none w-16 h-16 rounded-full"
          style={{ background: gradient }}
          {...props}
        >
          <Icon className="h-9 w-9 fill-white" />
        </button>

        <span className="text-xs text-muted-foreground">{name}</span>
      </div>
    )
  },
)
