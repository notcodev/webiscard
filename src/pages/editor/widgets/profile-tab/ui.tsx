import { useUnit } from 'effector-react'
import {
  ChangeEvent,
  forwardRef,
  MouseEventHandler,
  useEffect,
  useId,
} from 'react'
import {
  Button,
  Field,
  Input,
  InputProps,
  Label,
  Slider,
  Textarea,
} from '~/shared/ui'
import * as description from '../../features/description'
import * as name from '../../features/name'
import * as photo from '../../features/photo'
import * as username from '../../features/username'
import { PrefixInput } from '../../shared/ui'
import { profileTabClosed } from './model'

interface PageLinkEditInputProps extends InputProps {
  editMode: boolean
  changeMode: MouseEventHandler<HTMLButtonElement>
}

const PageLinkEditInput = forwardRef<HTMLInputElement, PageLinkEditInputProps>(
  ({ className, disabled, changeMode, editMode, ...props }, ref) => {
    const fieldDisabled = !editMode || disabled

    return (
      <div className="flex gap-2">
        <PrefixInput
          type="text"
          className={className}
          disabled={fieldDisabled}
          prefix="webiscard.github.io/"
          ref={ref}
          {...props}
        />
        <Button onClick={changeMode} disabled={disabled}>
          {!editMode ? 'Edit' : 'Confirm'}
        </Button>
      </div>
    )
  },
)

const usernameErrorText: Record<username.FieldError, string> = {
  empty: 'Page link field cannot be empty',
  exist: 'This page already exist',
  too_short: 'Username minimal length is 4 characters',
  too_long: 'Username maximum length is 18 characters',
  forbidden_characters: "Username hasn't to contain spec. characters",
  router_conflict: "Username hasn't to coincide with reserved paths",
}

const PageLinkField = () => {
  const { value, error, editMode, disabled } = useUnit({
    value: username.field.$value,
    error: username.field.$error,
    editMode: username.$editing,
    disabled: username.$fieldDisabled,
  })

  return (
    <Field
      label="Link to your business card"
      placeholder="username"
      value={value}
      error={error ? usernameErrorText[error] : null}
      onChange={(event) => {
        username.field.changed(event.target.value)
      }}
      disabled={disabled}
      asChild
    >
      <PageLinkEditInput
        editMode={editMode}
        changeMode={() => username.fieldModeChanged()}
      />
    </Field>
  )
}

const LengthLimiter = ({ charsLeft }: { charsLeft: number }) => {
  return (
    <span className="text-muted-foreground absolute right-3 top-7 text-sm">
      {charsLeft}
    </span>
  )
}

const NameField = () => {
  const value = useUnit(name.field.$value)

  return (
    <div className="relative">
      <Field
        value={value}
        label="Your name"
        onChange={(event) => {
          name.field.changed(event.target.value)
        }}
        placeholder="Enter your name"
        asChild
      >
        <Input className="pr-10" />
      </Field>
      <LengthLimiter charsLeft={name.MAX_LENGTH - value.length} />
    </div>
  )
}

const DescriptionField = () => {
  const value = useUnit(description.field.$value)

  return (
    <div className="relative">
      <Field
        label="Description"
        placeholder="Tell about yourself or your company"
        asChild
      >
        <Textarea
          className="resize-none pr-10"
          value={value}
          onChange={(event) => {
            description.field.changed(event.target.value)
          }}
        />
      </Field>
      <LengthLimiter charsLeft={description.MAX_LENGTH - value.length} />
    </div>
  )
}

const captionText = {
  [photo.Size.SMALL]: 'S',
  [photo.Size.MEDIUM]: 'M',
  [photo.Size.LARGE]: 'L',
}

const PhotoSizeCaption = ({
  size,
  active,
}: {
  size: photo.Size
  active: boolean
}) => {
  return (
    <button
      className="text-sm text-muted-foreground data-[active=true]:text-primary data-[active=true]:font-medium px-1"
      onClick={() => photo.sizeChanged(size)}
      data-active={active}
    >
      {captionText[size]}
    </button>
  )
}

const PhotoSizeSlider = () => {
  const currentSize = useUnit(photo.$size)
  const ascendingSizes = [photo.Size.SMALL, photo.Size.MEDIUM, photo.Size.LARGE]

  return (
    <>
      <Slider
        value={[ascendingSizes.indexOf(currentSize)]}
        onValueChange={(value) => photo.sizeChanged(ascendingSizes[value[0]])}
        max={2}
      />
      <div className="w-full flex justify-between">
        {ascendingSizes.map((photoSize) => (
          <PhotoSizeCaption
            key={photoSize}
            size={photoSize}
            active={currentSize === photoSize}
          />
        ))}
      </div>
    </>
  )
}

const PhotoField = () => {
  const inputId = useId()

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files.length === 0) return

    photo.fileChanged(event.target.files.item(0))
  }

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={inputId}>Photo</Label>
      <Button className="cursor-pointer" size="lg" asChild>
        <label htmlFor={inputId}>
          Upload photo
          <input
            className="hidden"
            id={inputId}
            title=""
            type="file"
            accept="image/jpeg, image/png, image/heic"
            onChange={onChange}
          />
        </label>
      </Button>
      <PhotoSizeSlider />
    </div>
  )
}

export const ProfileTab = () => {
  useEffect(() => profileTabClosed, [])

  return (
    <div className="mt-8 flex flex-col gap-6">
      <PageLinkField />
      <PhotoField />
      <div className="flex flex-col gap-4">
        <NameField />
        <DescriptionField />
      </div>
    </div>
  )
}
