import { HTMLAttributes } from 'react'
import { cn } from '~/shared/lib/shadcn'
import { Description } from './description'
import { Name } from './name'
import { Avatar, AvatarContainer } from './avatar'
import { SocialNetwork } from './social-network'
import { Background } from './background'

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

BusinessCard.Background = Background
BusinessCard.AvatarContainer = AvatarContainer
BusinessCard.Avatar = Avatar
BusinessCard.Name = Name
BusinessCard.Description = Description
BusinessCard.SocialNetwork = SocialNetwork
