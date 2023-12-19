import { attach, sample } from 'effector'
import { debounce } from 'patronum'
import * as api from '~/shared/api'
import { createField } from '~/shared/lib/effector'
import { getCardDraftFx } from '../../shared/api'

const updateCardFx = attach({ effect: api.updateCardFx })

export const MAX_LENGTH = 110

export const field = createField({
  defaultValue: '',
  changeReducer: (store, event) => (event.length <= MAX_LENGTH ? event : store),
})

const debouncedChange = debounce(field.changed, 600)

sample({
  clock: getCardDraftFx.doneData,
  fn: ({ description }) => description,
  target: field.$value,
})

sample({
  clock: debouncedChange,
  fn: (description) => ({ description }),
  target: updateCardFx,
})
