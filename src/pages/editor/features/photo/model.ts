import { createEvent, createStore, sample } from 'effector'
import { restore } from 'effector/effector.umd'

export enum Size {
  SMALL = 'sm',
  MEDIUM = 'md',
  LARGE = 'lg',
}

export const fileChanged = createEvent<File | null>()
export const sizeChanged = createEvent<Size>()

export const $size = restore(sizeChanged, Size.SMALL)
export const $file = createStore<File | null>(null)
export const $imageUrl = createStore<string | null>(null)

$file.on(fileChanged, (_, file) => file)

sample({
  source: $file,
  fn(file) {
    return !file ? null : URL.createObjectURL(file)
  },
  target: $imageUrl,
})
