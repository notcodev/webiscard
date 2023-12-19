import { useUnit } from 'effector-react'
import { ReactElement, useId, useRef, useState } from 'react'
import { match } from 'ts-pattern'
import { BusinessCard, socialNetworkConfig } from '~/entites/business-card'
import * as socialNetworks from '~/pages/editor/features/social-networks'
import { SocialNetwork } from '~/shared/api'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label, PrefixInput
} from '~/shared/ui'
import { SocialNetworkIcon } from '../../../entities/social-network-icon'

interface AddDialogProps {
  dialogTrigger: ReactElement
}

export const AddDialog = ({ dialogTrigger }: AddDialogProps) => {
  const [selectedButton, setSelectedButton] = useState<SocialNetwork | null>(
    null,
  )

  const inputRef = useRef<HTMLInputElement | null>(null)
  const inputId = useId()

  const addButton = useUnit(socialNetworks.buttonsApi.add)

  const dialogContent = match(selectedButton)
    .with(null, () => {
      return (
        <DialogContent className="rounded-md max-h-screen overflow-scroll">
          <DialogHeader>
            <DialogTitle>Add Button</DialogTitle>
            <DialogDescription>
              Select the social network to add.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 sm:grid-cols-4">
            {Object.keys(socialNetworkConfig).map((key) => {
              const socialNetwork = key as SocialNetwork

              return (
                <BusinessCard.SocialNetwork
                  key={key}
                  config={socialNetworkConfig[socialNetwork]}
                  onClick={() => setSelectedButton(socialNetwork)}
                />
              )
            })}
          </div>
        </DialogContent>
      )
    })
    .otherwise((selected) => {
      const { name, gradient, input, icon } = socialNetworkConfig[selected]
      const onClickAdd = () => {
        if (!inputRef.current) return

        addButton({ type: selected, value: inputRef.current.value })
      }

      return (
        <DialogContent className="rounded-md sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add button</DialogTitle>
            <DialogDescription>
              Fill in the details of your social network button. Click add when
              you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Label htmlFor={inputId}>{name}</Label>
            <div className="flex gap-2">
              <SocialNetworkIcon icon={icon} gradient={gradient} />
              <PrefixInput
                id={inputId}
                ref={inputRef}
                type={input.type}
                prefix={input.prefix}
                placeholder={input.placeholder}
              />
            </div>
            {input.hint && (
              <span className="text-sm text-muted-foreground leading-none">
                {input.hint}
              </span>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={onClickAdd}>Add button</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )
    })

  return (
    <Dialog>
      <DialogTrigger onClick={() => setSelectedButton(null)} asChild>
        {dialogTrigger}
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  )
}
