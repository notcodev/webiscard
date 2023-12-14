import { routes } from '~/shared/routing'
import { chainAuthorized } from '~/shared/session'

export const currentRoute = routes.editor
export const authorizedRoute = chainAuthorized(currentRoute, {
  otherwise: { route: routes.auth.login },
})
