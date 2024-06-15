import { createEvent, createStore, sample } from 'effector'
import { attach } from 'effector/compat'
import { and, equals, not } from 'patronum'
import * as api from '~/shared/api'
import { createField } from '~/shared/lib/effector'
import { UsernameValidationError, UsernameValidator } from '~/shared/validators'
import { getCardDraftFx } from '../../shared/api'

const updateCardFx = attach({ effect: api.updateCardFx })

export const editingStarted = createEvent()
export const editingCompleted = createEvent()

export type FieldError = UsernameValidationError | 'exist'

export const field = createField<string, FieldError>({
  defaultValue: '',
  validate: {
    type: 'class',
    on: editingCompleted,
    Class: UsernameValidator,
  },
  reset: {
    error: editingCompleted,
  },
})

export const $lastValue = createStore('')
export const $editing = createStore<boolean>(false)
export const $fieldDisabled = updateCardFx.pending

sample({
  clock: getCardDraftFx.doneData,
  fn: ({ username }) => username,
  target: [field.$value, $lastValue],
})

$editing.on(editingStarted, () => true)
$editing.on(updateCardFx.done, () => false)

sample({
  clock: editingCompleted,
  source: field.$value,
  filter: and(
    $editing,
    not($fieldDisabled),
    equals(field.$error, null),
    not(equals(field.$value, $lastValue)),
  ),
  fn(username) {
    return { username }
  },
  target: updateCardFx,
})

sample({
  clock: editingCompleted,
  filter: equals(field.$value, $lastValue),
  fn: () => false,
  target: $editing,
})

/* Success */

sample({
  clock: updateCardFx.done,
  source: field.$value,
  target: $lastValue,
})

/* Catching Errors */

sample({
  clock: updateCardFx.fail,
  filter({ error }) {
    return error.json?.code === 'FST_USERNAME_EXIST'
  },
  fn(): FieldError {
    return 'exist'
  },
  target: field.$error,
})
