import { attach, createApi, createStore, sample } from 'effector'
import { v4 as uuidv4 } from 'uuid'
import { SocialNetworkButton } from '~/shared/api'
import { getCardDraftFx } from '../../shared/api'
import * as api from '~/shared/api'

const updateCardFx = attach({ effect: api.updateCardFx })

export const $buttons = createStore<Record<string, SocialNetworkButton>>({})
export const $buttonsList = $buttons.map((state) => {
  return Object.keys(state).map((key) => state[key])
})
export const $enabledButtonsCount = $buttonsList.map((state) =>
  state.reduce((acc, button) => acc + Number(button.enabled), 0),
)

sample({
  clock: getCardDraftFx.doneData,
  fn({ socialNetworks: buttonsList }) {
    const buttons: Record<string, SocialNetworkButton> = {}

    buttonsList.forEach((button) => {
      buttons[button.id] = button
    })

    return buttons
  },
  target: $buttons,
})

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

sample({
  clock: [buttonsApi.add, buttonsApi.update, buttonsApi.remove],
  source: $buttonsList,
  fn: (socialNetworks) => ({ socialNetworks }),
  target: updateCardFx,
})
