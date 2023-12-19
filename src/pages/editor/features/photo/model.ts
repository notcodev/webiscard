import { attach, createEvent, createStore, sample } from 'effector'
import { restore } from 'effector/effector.umd'
import { getCardDraftFx } from '~/pages/editor/shared/api'
import { ProfilePictureSize } from '~/shared/api'
import * as api from '~/shared/api'
import { getImageUrl } from '~/shared/utils'
import { debounce } from 'patronum'

const uploadImageFx = attach({
  effect: api.uploadImageFx,
})
const updateCardFx = attach({ effect: api.updateCardFx })

export const imagePrepared = createEvent<string>()
export const sizeChanged = createEvent<ProfilePictureSize>()

export const $size = restore(sizeChanged, ProfilePictureSize.SMALL)
export const $source = createStore<string | null>(null)

sample({
  clock: getCardDraftFx.doneData,
  fn: ({ profilePicture }) => profilePicture.size,
  target: $size,
})

sample({
  clock: getCardDraftFx.doneData,
  fn: ({ profilePicture }) =>
    profilePicture.filename ? getImageUrl(profilePicture.filename) : null,
  target: $source,
})

const debouncedSizeChange = debounce(sizeChanged, 600)

sample({
  clock: debouncedSizeChange,
  fn(size) {
    return { profilePicture: { size } }
  },
  target: updateCardFx,
})

sample({
  clock: imagePrepared,
  fn(file) {
    return { imageBase64: file }
  },
  target: uploadImageFx,
})

sample({
  clock: uploadImageFx.doneData,
  fn: ({ filename }) => getImageUrl(filename),
  target: $source,
})

sample({
  clock: uploadImageFx.doneData,
  fn: ({ filename }) => ({ profilePicture: { filename } }),
  target: updateCardFx,
})
