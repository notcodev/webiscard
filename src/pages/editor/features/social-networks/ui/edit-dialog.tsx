import { useUnit } from 'effector-react'
import { ReactElement, useId, useRef } from 'react'
import { SocialNetworkConfig } from '~/entites/social-network'
import * as socialNetworks from '~/pages/editor/features/social-networks'
import { PrefixInput } from '~/pages/editor/shared/ui'
import { SocialNetworkButton } from '~/shared/api'
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
  Label,
  Switch,
} from '~/shared/ui'
import { SocialNetworkIcon } from '../../../entities/social-network-icon'

interface EditDialogProps
  extends SocialNetworkConfig,
    Pick<SocialNetworkButton, 'id' | 'value' | 'enabled'> {
  dialogTrigger: ReactElement
}

export const EditDialog = ({
  id,
  input,
  icon,
  name,
  gradient,
  value,
  dialogTrigger,
  enabled,
}: EditDialogProps) => {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const switchRef = useRef<HTMLButtonElement | null>(null)
  const switchId = useId()

  const [changed, removed] = useUnit([
    socialNetworks.buttonChanged,
    socialNetworks.buttonRemoved,
  ])

  const onSavePressed = () => {
    if (!switchRef.current || !inputRef.current) {
      return
    }

    changed({
      id,
      value: inputRef.current.value,
      enabled: switchRef.current.dataset.state === 'checked',
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent className="rounded-md md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>
            Make changes to your social network button. Click save when you're
            done.
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
              defaultValue={value}
              prefix={input.prefix}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch ref={switchRef} defaultChecked={enabled} id={switchId} />
          <Label htmlFor={switchId}>Show social network button</Label>
        </div>
        <DialogFooter className="flex-col gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button onClick={onSavePressed}>Save changes</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="border-red-500 text-red-600 hover:text-background hover:bg-red-500"
              variant="outline"
              onClick={() => removed(id)}
            >
              Remove
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
