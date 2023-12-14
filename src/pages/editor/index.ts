import { createRouteView } from 'atomic-router-react'
import { lazily } from 'react-lazily'
import { PageLoader } from '~/shared/ui'
import { authorizedRoute, currentRoute } from './shared/routing'

const { EditorPage } = lazily(() => import('./page'))

export const EditorRoute = {
  view: createRouteView({
    route: authorizedRoute,
    view: EditorPage,
    otherwise: PageLoader,
  }),
  route: currentRoute,
}
