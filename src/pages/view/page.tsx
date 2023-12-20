import { Link } from 'atomic-router-react'
import { useUnit } from 'effector-react'
import { BusinessCard, socialNetworkConfig } from '~/entites/business-card'
import { $cardData } from './model'

export const ViewPage = () => {
  const cardData = useUnit($cardData)
  const {
    name,
    socialNetworks,
    avatarSize,
    avatarFilename,
    background,
    description,
  } = cardData!

  const getPhotoSrc = (filename: string | null) => {
    if (!filename) return ''

    return import.meta.env.VITE_API_URL + `/api/v1/image/${filename}`
  }

  return (
    <BusinessCard.Background backgroundValue={background ? background : null}>
      <div className="py-24">
        <BusinessCard>
          <BusinessCard.AvatarContainer size={avatarSize}>
            <BusinessCard.Avatar src={getPhotoSrc(avatarFilename)} />
          </BusinessCard.AvatarContainer>
          <BusinessCard.Name>{name}</BusinessCard.Name>
          <BusinessCard.Description>{description}</BusinessCard.Description>
          <div className="flex justify-center flex-wrap mt-4">
            {socialNetworks.map((button) => {
              const config = socialNetworkConfig[button.type]

              return (
                <Link key={button.id} to={config.getLink(button.value)}>
                  <BusinessCard.SocialNetwork config={config} />
                </Link>
              )
            })}
          </div>
        </BusinessCard>
      </div>
    </BusinessCard.Background>
  )
}
