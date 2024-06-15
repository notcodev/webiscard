import { createEvent, createStore, sample } from 'effector'
import { delay } from 'patronum'
import * as uuid from 'uuid'

export const NOTIFICATION_TIMEOUT = 5000

export type NotificationType = 'success' | 'error'

interface Notification {
  id: string
  type: NotificationType
  description: string
}

export const notificationArrived = createEvent<Omit<Notification, 'id'>>()
const notificationExpired = delay(notificationArrived, NOTIFICATION_TIMEOUT)

export const $notifications = createStore<Notification[]>([])

$notifications.on(notificationArrived, (state, data) => [
  ...state,
  { id: uuid.v4(), ...data },
])

sample({
  clock: notificationExpired,
  source: $notifications,
  fn(notifications) {
    return notifications.splice(1)
  },
  target: $notifications,
})
