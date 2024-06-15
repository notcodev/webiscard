import { chainRoute } from 'atomic-router'
import { routes } from '~/shared/routing'
import { chainAuthorized } from '~/shared/session'
import { getCardDraftFx } from './api'

export const currentRoute = routes.editor

export const editorLoadedRoute = chainRoute({
  route: chainAuthorized(currentRoute, {
    otherwise: { route: routes.auth.login },
  }),
  beforeOpen: {
    effect: getCardDraftFx,
    mapParams() {},
  },
})
