import { attach, createEvent, createStore, sample } from 'effector'
import { not } from 'patronum'
import * as api from '~/shared/api'
import { getCardDraftFx } from '../../shared/api'

const publishCardFx = attach({ effect: api.publishCardFx })

export const buttonPressed = createEvent()

export const $publicAvailable = createStore(false)
export const $requestPending = publishCardFx.pending

sample({
  clock: getCardDraftFx.doneData,
  fn({ isPublished }) {
    return isPublished
  },
  target: $publicAvailable,
})

sample({
  clock: buttonPressed,
  filter: not($requestPending),
  target: publishCardFx,
})
