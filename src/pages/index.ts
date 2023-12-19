import { createRoutesView } from 'atomic-router-react'
// import { UpdatePasswordRoute } from '~/pages/update-password'
import { EditorRoute } from './editor'
import { HomeRoute } from './home'
import { LoginRoute } from './login'
import { NotFoundRoute } from './not-found'
// import { ResetPasswordRoute } from './reset-password'
import { SignupRoute } from './signup'
import { ViewRoute } from './view'
import { NotFoundPage } from '~/pages/not-found/page.tsx'

export const Pages = createRoutesView({
  routes: [
    HomeRoute,
    LoginRoute,
    SignupRoute,
    // ResetPasswordRoute,
    // UpdatePasswordRoute,
    EditorRoute,
    NotFoundRoute,
    ViewRoute,
  ],
  otherwise: NotFoundPage,
})
