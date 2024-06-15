import { createRouteView } from 'atomic-router-react'
import { lazily } from 'react-lazily'
import { PageLoader } from '~/shared/ui'
import { anonymousRoute, currentRoute } from './model'

const { LoginPage } = lazily(() => import('./page'))

export const LoginRoute = {
  view: createRouteView({
    route: anonymousRoute,
    view: LoginPage,
    otherwise: PageLoader,
  }),
  route: currentRoute,
}
