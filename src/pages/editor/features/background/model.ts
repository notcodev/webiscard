import { createEvent, restore } from 'effector'

export const changed = createEvent<string>()

export const $current = restore(changed, null)
