import { useList, useUnit } from 'effector-react'
import { ChangeEvent, PropsWithChildren, useId } from 'react'
import { socialNetworkConfig } from '~/entites/social-network'
import * as background from '~/pages/editor/features/background'
import * as description from '~/pages/editor/features/description'
import * as name from '~/pages/editor/features/name'
import * as photo from '~/pages/editor/features/photo'
import * as socialNetworks from '~/pages/editor/features/social-networks'
import { EditDialog } from '~/pages/editor/features/social-networks'
import { BusinessCard, SocialNetworkEntry } from '~/shared/ui'
import { useAutoResizableField } from './lib/react'

const Photo = () => {
  const inputId = useId()
  const { imageUrl, size } = useUnit({
    size: photo.$size,
    imageUrl: photo.$imageUrl,
  })

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files.length === 0) return

    photo.fileChanged(event.target.files.item(0))
  }

  return (
    <BusinessCard.PhotoContainer
      size={size}
      className="group cursor-pointer"
      asChild
    >
      <label htmlFor={inputId}>
        {!imageUrl ? (
          <span className="text-sm text-muted-foreground text-center group-hover:text-accent-foreground leading-tight">
            Add <br /> photo
          </span>
        ) : (
          <BusinessCard.Photo src={imageUrl} />
        )}
        <input
          className="hidden"
          id={inputId}
          title=""
          type="file"
          accept="image/jpeg, image/png, image/heic"
          onChange={onChange}
        />
      </label>
    </BusinessCard.PhotoContainer>
  )
}

const Name = () => {
  const { ref, ...props } = useAutoResizableField({
    field: name.field,
    placeholder: 'Enter your name',
  })

  return (
    <BusinessCard.Name
      id="name"
      className="resize-none focus:outline-none focus:bg-accent hover:bg-accent"
      asChild
      {...props}
    >
      <textarea ref={ref} autoComplete="given-name" />
    </BusinessCard.Name>
  )
}

const Description = () => {
  const { ref, ...props } = useAutoResizableField({
    field: description.field,
    placeholder: 'Tell about yourself or your \n company',
  })

  return (
    <BusinessCard.Description
      id="description"
      className="resize-none focus:outline-none focus:bg-accent hover:bg-accent"
      asChild
      {...props}
    >
      <textarea ref={ref} />
    </BusinessCard.Description>
  )
}

const CardWrapper = ({ children }: PropsWithChildren) => {
  const bg = useUnit(background.$current)

  return (
    <div
      className="flex justify-center items-center w-full min-h-screen"
      style={{ background: bg ?? 'hsl(var(--muted-foreground))' }}
    >
      {children}
    </div>
  )
}

const SocialNetworks = () => {
  const countOfEnabledButtons = useUnit(socialNetworks.$enabledButtonsCount)

  const buttons = useList(socialNetworks.$buttonsList, {
    getKey: (item) => item.id,
    fn: (button, key) => {
      if (!button.enabled) return null

      const config = socialNetworkConfig[button.type]

      return (
        <EditDialog
          key={key}
          dialogTrigger={<SocialNetworkEntry config={config} />}
          {...config}
          {...button}
        />
      )
    },
  })

  if (!countOfEnabledButtons) {
    return (
      <p className="bg-accent py-8 px-4 rounded-md mt-6 text-muted-foreground text-sm text-center">
        Add your social media links and ways to contact you in the left panel
      </p>
    )
  }

  return <div className="flex justify-around flex-wrap mt-4">{buttons}</div>
}

export const PreviewCard = () => {
  return (
    <CardWrapper>
      <div className="py-24">
        <BusinessCard>
          <Photo />
          <Name />
          <Description />
          <SocialNetworks />
        </BusinessCard>
      </div>
    </CardWrapper>
  )
}
