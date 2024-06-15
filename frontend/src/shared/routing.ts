import {
  createHistoryRouter,
  createRoute,
  createRouterControls,
} from 'atomic-router'
import { sample } from 'effector'
import { createBrowserHistory } from 'history'
import { appStarted } from '~/shared/config/init'

export const routes = {
  home: createRoute(),
  auth: {
    login: createRoute(),
    signup: createRoute(),
    // resetPassword: createRoute(),
    // updatePassword: createRoute(),
  },
  settings: createRoute(),
  editor: createRoute(),
  view: createRoute<{ username: string }>(),
  notFound: createRoute(),
}

export const controls = createRouterControls()

export const router = createHistoryRouter({
  routes: [
    {
      path: '/',
      route: routes.home,
    },
    {
      path: '/login',
      route: routes.auth.login,
    },
    {
      path: '/signup',
      route: routes.auth.signup,
    },
    // {
    //   path: '/reset-password',
    //   route: routes.auth.resetPassword,
    // },
    // {
    //   path: '/update-password',
    //   route: routes.auth.updatePassword,
    // },
    {
      path: '/settings',
      route: routes.settings,
    },
    {
      path: '/editor',
      route: routes.editor,
    },
    {
      path: '/404',
      route: routes.notFound,
    },
    {
      path: '/c/:username',
      route: routes.view,
    },
  ],
  controls,
})

sample({
  clock: appStarted,
  fn: () => createBrowserHistory(),
  target: router.setHistory,
})
