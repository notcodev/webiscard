import { attach, createEvent, createStore, sample } from 'effector'
import * as api from '~/shared/api'
import { Background } from '~/shared/api'
import { getImageUrl } from '~/shared/utils'
import { getCardDraftFx } from '../../shared/api'

const uploadImageFx = attach({ effect: api.uploadImageFx })
const updateCardFx = attach({ effect: api.updateCardFx })

export const gradientSelected = createEvent<string>()
export const imagePrepared = createEvent<string>()

export const $current = createStore<string | null>(null)

sample({
  clock: getCardDraftFx.doneData,
  fn({ background }) {
    if (!background) return null

    return background.type === 'CustomImage'
      ? `url(${background.value})`
      : background.value
  },
  target: $current,
})

$current.on(gradientSelected, (_, gradient) => gradient)

sample({
  clock: gradientSelected,
  fn(gradient) {
    return { background: { type: 'Gradient', value: gradient } as Background }
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
  fn: ({ filename }) => `url(${getImageUrl(filename)})`,
  target: $current,
})

sample({
  clock: uploadImageFx.doneData,
  fn({ filename }) {
    return {
      background: {
        type: 'CustomImage',
        value: getImageUrl(filename),
      } as Background,
    }
  },
  target: updateCardFx,
})
