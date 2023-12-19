import { useUnit } from 'effector-react'
import { CheckIcon } from 'lucide-react'
import { useId } from 'react'
import { createImageUploader } from '~/shared/lib/react'
import { Button, Label } from '~/shared/ui'
import * as background from '../../features/background'

const gradients = [
  'linear-gradient(90deg,#FAD961 0%,#F76B1C 100%)',
  'linear-gradient(0deg, #08AEEA 0%, #2AF598 100%)',
  'linear-gradient(45deg, #85FFBD 0%, #FFFB7D 100%)',
  'linear-gradient(180deg, #A9C9FF 0%, #FFBBEC 100%)',
  'linear-gradient(30deg, #ff6e7f,#bfe9ff)',
  'linear-gradient(30deg, #DD5E89,#F7BB97)',
  'linear-gradient(200deg, #FBD3E9,#BB377D)',
  'linear-gradient(240deg, #72C6EF,#004E8F )',
  'linear-gradient(132deg, #F4D03F 0%, #16A085 100%)',
  'linear-gradient(19deg, #21D4FD 0%, #B721FF 100%)',
  'linear-gradient(30deg,#accbee,#e7f0fd)',
  'linear-gradient(to right,#485563,#29323c)',
]

interface GradientPresetProps {
  gradient: string
}

const GradientPreset = ({ gradient }: GradientPresetProps) => {
  const changed = useUnit(background.gradientSelected)
  const bg = useUnit(background.$current)

  return (
    <button
      className="flex justify-center items-center cursor-pointer rounded-sm h-[45px] w-[45px]"
      style={{ background: gradient }}
      onClick={() => changed(gradient)}
    >
      {gradient === bg && (
        <CheckIcon className="text-background" strokeWidth={3} />
      )}
    </button>
  )
}

const UploadBackground = () => {
  const inputId = useId()
  const imageUploaded = useUnit(background.imagePrepared)
  const currentBackground = useUnit(background.$current)

  const { onChange } = createImageUploader({
    onUploaded: imageUploaded,
    maxSize: 8e6,
  })

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={inputId}>Upload your own background</Label>
      <Button className="cursor-pointer" size="lg" asChild>
        <label htmlFor={inputId}>
          Choose file
          <input
            key={currentBackground}
            className="hidden"
            id={inputId}
            title=""
            type="file"
            accept="image/jpeg, image/png, image/heic"
            onChange={onChange}
          />
        </label>
      </Button>
    </div>
  )
}

export const BackgroundTab = () => {
  return (
    <div className="mt-8 flex flex-col gap-6">
      <UploadBackground />
      <div className="flex flex-col gap-3">
        <Label>Gradients</Label>
        <div className="flex flex-wrap gap-3">
          {gradients.map((gradient) => (
            <GradientPreset key={gradient} gradient={gradient} />
          ))}
        </div>
      </div>
    </div>
  )
}
