import { createEvent, createStore } from 'effector'

export function createBoolean(initialValue: boolean) {
  const $value = createStore<boolean>(initialValue)

  const toggle = createEvent()
  const set = createEvent<boolean>()

  $value.on(set, (_, value) => value)
  $value.on(toggle, (value) => !value)

  return { $value, toggle, set }
}
