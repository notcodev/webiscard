import { chainRoute, RouteInstance, RouteParamsAndQuery } from 'atomic-router'
import { attach, createEvent, restore, sample } from 'effector'
import * as api from '~/shared/api'
import { routes } from '~/shared/routing'

const getCardPublicFx = attach({ effect: api.getCardPublicFx })

export const currentRoute = routes.view
export const cardLoadedRoute = chainCardLoaded(currentRoute)

export const $cardData = restore(getCardPublicFx, null)

function chainCardLoaded<Params extends { username: string }>(
  route: RouteInstance<Params>,
) {
  const loadingStarted = createEvent<RouteParamsAndQuery<Params>>()

  sample({
    clock: loadingStarted,
    fn(route) {
      return { username: route.params.username }
    },
    target: getCardPublicFx,
  })

  sample({
    clock: getCardPublicFx.fail,
    target: routes.notFound.open,
  })

  return chainRoute({
    route,
    beforeOpen: loadingStarted,
    openOn: getCardPublicFx.done,
    cancelOn: getCardPublicFx.fail,
  })
}
