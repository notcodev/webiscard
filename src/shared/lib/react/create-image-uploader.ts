import { ChangeEvent } from 'react'

interface CreateImageUploader {
  onUploaded: (result: string) => void
  maxSize: number
  onSizeExceeded?: () => void
}

export const createImageUploader = ({
  onUploaded,
  maxSize,
  onSizeExceeded,
}: CreateImageUploader) => {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files.length === 0) return

    const file = event.target.files.item(0)
    const reader = new FileReader()

    reader.addEventListener('load', (event) => {
      if (!event.target) return

      onUploaded(event.target.result as string)
    })

    if (!file) return
    if (file.size > maxSize) {
      onSizeExceeded?.()
      return
    }

    reader.readAsDataURL(file)
  }

  return { onChange }
}
