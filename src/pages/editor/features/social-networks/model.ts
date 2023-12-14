import { createEvent, createStore } from 'effector'
import { v4 as uuidv4 } from 'uuid'
import { SocialNetwork, SocialNetworkButton } from '~/shared/api'

/* Playground */

const ids = Array.from({ length: 6 }).map(() => uuidv4())

const initialState: Record<string, SocialNetworkButton> = {
  [ids[0]]: {
    type: SocialNetwork.MESSENGER,
    enabled: true,
    value: 'test',
    id: ids[0],
  },
  [ids[1]]: {
    type: SocialNetwork.WHATSAPP,
    enabled: true,
    value: 'test',
    id: ids[1],
  },
  [ids[2]]: {
    type: SocialNetwork.YOUTUBE,
    enabled: true,
    value: 'test',
    id: ids[2],
  },
  [ids[3]]: {
    type: SocialNetwork.GITHUB,
    enabled: true,
    value: 'test',
    id: ids[3],
  },
}

/* */

export const buttonChanged =
  createEvent<Pick<SocialNetworkButton, 'id' | 'enabled' | 'value'>>()
export const buttonRemoved = createEvent<string>()

export const $buttons =
  createStore<Record<string, SocialNetworkButton>>(initialState)
export const $buttonsList = $buttons.map((state) => {
  return Object.keys(state).map((key) => state[key])
})
export const $enabledButtonsCount = $buttonsList.map((state) =>
  state.reduce((acc, button) => acc + Number(button.enabled), 0),
)

$buttons.on(buttonRemoved, (buttons, id) => {
  if (!(id in buttons)) {
    return buttons
  }

  const buttonsNew = { ...buttons }
  delete buttonsNew[id]

  return buttonsNew
})

$buttons.on(buttonChanged, (buttons, { id, enabled, value }) => {
  if (!(id in buttons)) {
    return buttons
  }

  return { ...buttons, [id]: { ...buttons[id], value, enabled } }
})
