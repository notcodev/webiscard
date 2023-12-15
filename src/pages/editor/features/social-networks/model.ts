import { createApi, createStore } from 'effector'
import { v4 as uuidv4 } from 'uuid'
import { SocialNetworkButton } from '~/shared/api'

export const $buttons = createStore<Record<string, SocialNetworkButton>>({})
export const $buttonsList = $buttons.map((state) => {
  return Object.keys(state).map((key) => state[key])
})
export const $enabledButtonsCount = $buttonsList.map((state) =>
  state.reduce((acc, button) => acc + Number(button.enabled), 0),
)

export const buttonsApi = createApi($buttons, {
  update(
    buttons,
    { id, ...data }: Pick<SocialNetworkButton, 'id' | 'enabled' | 'value'>,
  ) {
    if (!(id in buttons)) {
      return buttons
    }

    return { ...buttons, [id]: { ...buttons[id], ...data } }
  },
  remove(buttons, id: string) {
    if (!(id in buttons)) {
      return buttons
    }

    const buttonsNew = { ...buttons }
    delete buttonsNew[id]

    return buttonsNew
  },
  add(buttons, data: Pick<SocialNetworkButton, 'type' | 'value'>) {
    const id = uuidv4()

    return { ...buttons, [id]: { id, ...data, enabled: true } }
  },
})
