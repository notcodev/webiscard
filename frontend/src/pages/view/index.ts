import { createRouteView } from 'atomic-router-react'
import { PageLoader } from '~/shared/ui'
import { cardLoadedRoute, currentRoute } from './model'
import { ViewPage } from './page'

export const ViewRoute = {
  view: createRouteView({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    route: cardLoadedRoute,
    view: ViewPage,
    otherwise: PageLoader,
  }),
  route: currentRoute,
}
