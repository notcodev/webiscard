import { useList, useUnit } from 'effector-react'
import { LinkIcon, Loader2, Plus } from 'lucide-react'
import { or } from 'patronum'
import { PropsWithChildren, useId, useState } from 'react'
import { BusinessCard, socialNetworkConfig } from '~/entites/business-card'
import { AddDialog, EditDialog } from '~/pages/editor/features/social-networks'
import { publishCardFx, uploadImageFx } from '~/shared/api'
import { createImageUploader } from '~/shared/lib/react'
import * as background from '../../features/background'
import * as description from '../../features/description'
import * as name from '../../features/name'
import * as avatar from '../../features/avatar'
import * as publish from '../../features/publish'
import * as socialNetworks from '../../features/social-networks'
import * as username from '../../features/username'
import { useAutoResizableField } from './lib/react'

const Photo = () => {
  const inputId = useId()
  const [size, imageSource] = useUnit([avatar.$size, avatar.$source])
  const imageUploaded = useUnit(avatar.imagePrepared)

  const { onChange } = createImageUploader({
    onUploaded: imageUploaded,
  })

  return (
    <BusinessCard.AvatarContainer
      size={size}
      className="group cursor-pointer"
      asChild
    >
      <label htmlFor={inputId}>
        {!imageSource ? (
          <span className="text-sm text-muted-foreground text-center group-hover:text-accent-foreground leading-tight">
            Add <br /> photo
          </span>
        ) : (
          <BusinessCard.Avatar src={imageSource} />
        )}
        <input
          key={imageSource}
          className="hidden"
          id={inputId}
          title=""
          type="file"
          accept="image/jpeg, image/png, image/heic"
          onChange={onChange}
        />
      </label>
    </BusinessCard.AvatarContainer>
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

const Background = ({ children }: PropsWithChildren) => {
  const bg = useUnit(background.$current)

  return (
    <BusinessCard.Background backgroundValue={bg}>
      {children}
    </BusinessCard.Background>
  )
}

const AddLinkButton = () => {
  const dialogTrigger = (
    <div className="group flex flex-col gap-2 items-center m-3 lg:mx-5">
      <button className="flex justify-center items-center flex-none w-16 h-16 rounded-full bg-muted">
        <Plus className="h-9 w-9 text-muted-foreground group-hover:text-foreground" />
      </button>

      <span className="text-xs text-muted-foreground group-hover:text-foreground">
        Add link
      </span>
    </div>
  )

  return <AddDialog dialogTrigger={dialogTrigger} />
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
          dialogTrigger={<BusinessCard.SocialNetwork config={config} />}
          {...config}
          {...button}
        />
      )
    },
  })

  const addLinkElement = (
    <div className="flex justify-center flex-wrap md:hidden">
      <AddLinkButton />
    </div>
  )

  if (!countOfEnabledButtons) {
    return (
      <>
        <p className="hidden md:block bg-accent py-8 px-6 lg:px-12 rounded-md mt-6 text-muted-foreground text-sm text-center">
          Add your social media links and ways to contact you in the left panel
        </p>
        {addLinkElement}
      </>
    )
  }

  return (
    <>
      <div className="flex justify-center flex-wrap mt-4">{buttons}</div>
      {addLinkElement}
    </>
  )
}

const $showLoader = or(uploadImageFx.pending, publishCardFx.pending)
const ProcessLoader = () => {
  const imageUploading = useUnit($showLoader)

  return (
    imageUploading && (
      <div className="bg-black bg-opacity-40 absolute top-0 left-0 right-0 w-full h-screen flex items-center justify-center">
        <Loader2 className="text-background h-16 w-16 animate-spin" />
      </div>
    )
  )
}

const Publish = () => {
  const [copied, setCopied] = useState(false)

  const lastUsername = useUnit(username.$lastValue)
  const buttonPressed = useUnit(publish.buttonPressed)

  return (
    <div className="fixed top-8 flex text-white text-sm font-light">
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(
            `https://${import.meta.env.VITE_APP_DOMAIN}/c/${lastUsername}`,
          )
          setCopied(true)
        }}
        onMouseLeave={() => setCopied(false)}
        className="bg-black bg-opacity-20 px-4 hover:bg-opacity-[35%] transition duration-300 text-white flex gap-2 rounded-l-full items-center"
      >
        <LinkIcon className="h-4 w-4" />
        <div className="overflow-hidden relative h-fit py-2">
          <span
            className="leading-none relative block aria-hidden:translate-y-8 transition-transform duration-300"
            aria-hidden={copied}
          >
            {import.meta.env.VITE_APP_DOMAIN}/c/{lastUsername}
          </span>
          <span
            className="leading-none absolute w-full text-center left-0 aria-hidden:-translate-y-8 transition-transform duration-300 top-2"
            aria-hidden={!copied}
          >
            Copied
          </span>
        </div>
      </button>
      <button
        onClick={buttonPressed}
        className="bg-black bg-opacity-[35%] py-2 w-28 hover:bg-opacity-[45%] transition duration-300 rounded-r-full"
      >
        Save
      </button>
    </div>
  )
}

export const PreviewCard = () => {
  return (
    <Background>
      <div className="py-36">
        <BusinessCard>
          <Photo />
          <Name />
          <Description />
          <SocialNetworks />
        </BusinessCard>
      </div>
      <Publish />
      <ProcessLoader />
    </Background>
  )
}
