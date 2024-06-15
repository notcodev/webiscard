import { ChangeEvent } from 'react'

interface CreateImageUploader {
  onUploaded: (result: File) => void
  onSizeExceeded?: () => void
}

export const createImageUploader = ({
  onUploaded,
  onSizeExceeded,
}: CreateImageUploader) => {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files.length === 0) return

    const file = event.target.files[0]

    if (file.size > 1024 * 1024 * 4) {
      onSizeExceeded?.()
      return
    }

    onUploaded(event.target.files[0])
  }

  return { onChange }
}
