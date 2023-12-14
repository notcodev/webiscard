import { attach, createEvent, createStore, sample } from 'effector'
import { and, equals, not } from 'patronum'
import * as api from '~/shared/api'
import { createField } from '~/shared/lib/effector'
import { UsernameValidationError, UsernameValidator } from '~/shared/validators'

const updateUsernameFx = attach({ effect: api.updateUsernameFx })

export const fieldModeChanged = createEvent()
const confirmButtonPressed = createEvent()

export type FieldError = UsernameValidationError | 'exist'

export const field = createField<string, FieldError>({
  defaultValue: '',
  validate: {
    type: 'class',
    on: confirmButtonPressed,
    Class: UsernameValidator,
  },
  reset: {
    error: confirmButtonPressed,
  },
})

export const $current = createStore('')
export const $editing = createStore<boolean>(false)
export const $fieldDisabled = updateUsernameFx.pending

sample({
  clock: fieldModeChanged,
  filter: $editing,
  target: confirmButtonPressed,
})

sample({
  clock: fieldModeChanged,
  filter: not($editing),
  fn() {
    return true
  },
  target: $editing,
})

sample({
  clock: confirmButtonPressed,
  source: field.$value,
  filter: and($editing, not($fieldDisabled), equals(field.$error, null)),
  fn(username) {
    return { username }
  },
  target: updateUsernameFx,
})

/* Success */

sample({
  clock: updateUsernameFx.done,
  fn() {
    return false
  },
  target: $editing,
})

sample({
  clock: updateUsernameFx.done,
  source: field.$value,
  target: $current,
})

/* Catching Errors */

sample({
  clock: updateUsernameFx.fail,
  filter({ error }) {
    return error.status === 409
  },
  fn(): FieldError {
    return 'exist'
  },
  target: field.$error,
})
