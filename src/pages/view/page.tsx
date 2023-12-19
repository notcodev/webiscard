import { Link } from 'atomic-router-react'
import { useUnit } from 'effector-react'
import { BusinessCard, socialNetworkConfig } from '~/entites/business-card'
import { Background } from '~/shared/api'
import { $cardData } from './model'

export const ViewPage = () => {
  const cardData = useUnit($cardData)
  const { name, socialNetworks, profilePicture, background, description } =
    cardData!

  const getBackgroundImage = (background: Background | null) => {
    if (!background) return 'hsl(var(--muted-foreground))'

    if (background.type === 'Gradient') return background.value

    return `url(${background.value})`
  }

  console.log(cardData)

  const getPhotoSrc = (filename: string | null) => {
    if (!filename) return ''

    return import.meta.env.VITE_API_URL + `/api/v1/images/${filename}`
  }

  return (
    <div
      className="flex justify-center items-center w-full min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: getBackgroundImage(background),
      }}
    >
      <div className="py-24">
        <BusinessCard>
          <BusinessCard.PhotoContainer size={profilePicture.size}>
            <BusinessCard.Photo src={getPhotoSrc(profilePicture.filename)} />
          </BusinessCard.PhotoContainer>
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
    </div>
  )
}
