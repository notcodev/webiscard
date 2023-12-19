import { attach, sample } from 'effector'
import { createField } from '~/shared/lib/effector'
import { getCardDraftFx } from '../../shared/api'
import { debounce } from 'patronum'
import * as api from '~/shared/api'

const updateCardFx = attach({ effect: api.updateCardFx })

export const MAX_LENGTH = 40

export const field = createField({
  defaultValue: '',
  changeReducer: (store, event) => (event.length <= MAX_LENGTH ? event : store),
})

const debouncedChange = debounce(field.changed, 600)

sample({
  clock: getCardDraftFx.doneData,
  fn: ({ name }) => name,
  target: field.$value,
})

sample({
  clock: debouncedChange,
  fn: (name) => ({ name }),
  target: updateCardFx,
})
