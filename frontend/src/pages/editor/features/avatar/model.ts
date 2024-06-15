import { attach, createEvent, createStore, sample } from 'effector'
import { restore } from 'effector/effector.umd'
import { debounce } from 'patronum'
import { getCardDraftFx } from '~/pages/editor/shared/api'
import { AvatarSize, ImageKind } from '~/shared/api'
import * as api from '~/shared/api'
import { getImageUrl } from '~/shared/utils'

const uploadImageFx = attach({
  effect: api.uploadImageFx,
})
const updateCardFx = attach({ effect: api.updateCardFx })

export const imagePrepared = createEvent<File>()
export const sizeChanged = createEvent<AvatarSize>()

export const $size = restore(sizeChanged, AvatarSize.SMALL)
export const $source = createStore<string | null>(null)

sample({
  clock: getCardDraftFx.doneData,
  fn: ({ avatarSize }) => avatarSize,
  target: $size,
})

sample({
  clock: getCardDraftFx.doneData,
  fn: ({ avatarFilename }) =>
    avatarFilename ? getImageUrl(avatarFilename) : null,
  target: $source,
})

const debouncedSizeChange = debounce(sizeChanged, 600)

sample({
  clock: debouncedSizeChange,
  fn(size) {
    return { avatarSize: size }
  },
  target: updateCardFx,
})

sample({
  clock: imagePrepared,
  fn(file) {
    return { file, kind: ImageKind.PROFILE_PICTURE }
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
  fn: ({ filename }) => ({ avatarFilename: filename }),
  target: updateCardFx,
})
