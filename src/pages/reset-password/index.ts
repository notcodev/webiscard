import { lazily } from 'react-lazily'
import { currentRoute } from './model'

const { ResetPasswordPage } = lazily(() => import('./page'))

export const ResetPasswordRoute = {
  view: ResetPasswordPage,
  route: currentRoute,
}
