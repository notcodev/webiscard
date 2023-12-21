import { createRouteView } from 'atomic-router-react'
import { PageLoader } from '~/shared/ui'
import { cardLoadedRoute, currentRoute } from './model'
import { ViewPage } from './page'

export const ViewRoute = {
  view: createRouteView({
    route: cardLoadedRoute,
    view: ViewPage,
    otherwise: PageLoader,
  }),
  route: currentRoute,
}
