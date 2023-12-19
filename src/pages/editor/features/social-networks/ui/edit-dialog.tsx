import { useUnit } from 'effector-react'
import { ReactElement, useId, useRef } from 'react'
import { SocialNetworkConfig } from '~/entites/business-card'
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
  Label, PrefixInput,
  Switch
} from '~/shared/ui'
import { SocialNetworkIcon } from '../../../entities/social-network-icon'
import { buttonsApi } from '../model'

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

  const [updateButton, removeButton] = useUnit([
    buttonsApi.update,
    buttonsApi.remove,
  ])

  const onSavePressed = () => {
    if (!switchRef.current || !inputRef.current) {
      return
    }
    updateButton({
      id,
      value: inputRef.current.value,
      enabled: switchRef.current.dataset.state === 'checked',
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent className="rounded-md sm:max-w-[425px]">
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
              placeholder={input.placeholder}
              prefix={input.prefix}
            />
          </div>
          {input.hint && (
            <span className="text-sm text-muted-foreground leading-none">
              {input.hint}
            </span>
          )}
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
              onClick={() => removeButton(id)}
            >
              Remove
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
