import { createRouteView } from 'atomic-router-react'
import { lazily } from 'react-lazily'
import { PageLoader } from '~/shared/ui'
import { anonymousRoute, currentRoute } from './model'

const { SignupPage } = lazily(() => import('./page'))

export const SignupRoute = {
  view: createRouteView({
    route: anonymousRoute,
    view: SignupPage,
    otherwise: PageLoader,
  }),
  route: currentRoute,
}
