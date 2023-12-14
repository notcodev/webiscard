import { createRouteView } from 'atomic-router-react'
import { lazily } from 'react-lazily'
import { PageLoader } from '~/shared/ui'
import { currentRoute, protectedRoute } from './model'

const { UpdatePasswordPage } = lazily(() => import('./page'))

export const UpdatePasswordRoute = {
  view: createRouteView({
    route: protectedRoute,
    view: UpdatePasswordPage,
    otherwise: PageLoader,
  }),
  route: currentRoute,
}
