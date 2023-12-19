import { createEvent, sample } from 'effector'
import * as username from '../../features/username'

export const profileTabClosed = createEvent()

username.field.$error.reset(profileTabClosed)
username.$editing.reset(profileTabClosed)

sample({
  clock: profileTabClosed,
  source: username.$lastValue,
  target: username.field.$value,
})
