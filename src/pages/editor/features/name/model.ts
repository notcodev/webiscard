import { createField } from '~/shared/lib/effector'

export const MAX_LENGTH = 40

export const field = createField({
  defaultValue: '',
  changeReducer: (store, event) => (event.length <= MAX_LENGTH ? event : store),
})
