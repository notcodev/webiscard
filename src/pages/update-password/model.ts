import { chainRoute, RouteInstance, RouteParamsAndQuery } from 'atomic-router'
import { attach, createEvent, createStore, sample, Store } from 'effector'
import { and, every, not } from 'patronum'
import * as api from '~/shared/api'
import { createField } from '~/shared/lib/effector'
import { routes } from '~/shared/routing'
import { $authenticationStatus, AuthStatus } from '~/shared/session'
import { isEmpty, PasswordValidator } from '~/shared/validators'

type CurrentRouteParamsAndQuery = RouteParamsAndQuery<{
  query: { key: string }
}>
const getSessionFx = attach({ effect: api.getSessionFx })

const validateKeyFx = attach({ effect: api.validateKeyFx })
const updatePasswordFx = attach({ effect: api.updatePasswordFx })

export const updatePasswordFormSubmitted = createEvent()
export const pageUnmounted = createEvent()

export const $keyValid = createStore<boolean | null>(null)

export const currentRoute = routes.auth.updatePassword
export const protectedRoute = chainProtected(currentRoute)

export type CurrentPasswordError = 'empty' | 'invalid'
export const currentPasswordField = createField({
  defaultValue: '',
  validate: {
    type: 'class-with-convertor',
    on: updatePasswordFormSubmitted,
    Class: PasswordValidator,
    convert(error): CurrentPasswordError | null {
      return error === null || error === 'empty' ? error : 'invalid'
    },
  },
  reset: {
    all: pageUnmounted,
    error: updatePasswordFormSubmitted,
  },
})

export type NewPasswordError = Exclude<
  ReturnType<PasswordValidator['validate']>,
  null
>
export const newPasswordField = createField({
  defaultValue: '',
  validate: {
    type: 'class',
    on: updatePasswordFormSubmitted,
    Class: PasswordValidator,
  },
  reset: {
    all: pageUnmounted,
    error: updatePasswordFormSubmitted,
  },
})

export type ConfirmPasswordError = 'empty' | 'not_equal'
export const confirmPasswordField = createField<string, ConfirmPasswordError>({
  defaultValue: '',
  reset: {
    all: pageUnmounted,
    error: updatePasswordFormSubmitted,
  },
})

sample({
  clock: updatePasswordFormSubmitted,
  source: {
    new: newPasswordField.$value,
    confirm: confirmPasswordField.$value,
  },
  fn: (passwords) => {
    if (isEmpty(passwords.confirm)) return 'empty'
    if (passwords.confirm !== passwords.new) return 'not_equal'
    return null
  },
  target: confirmPasswordField.$error,
})

export const $formValid = every({
  stores: [
    currentPasswordField.$error,
    newPasswordField.$error,
    confirmPasswordField.$error,
  ] as Store<string | null>[],
  predicate: null,
})
export const $formDisabled = createStore(false)

sample({
  clock: updatePasswordFormSubmitted,
  source: {
    currentPassword: currentPasswordField.$value,
    newPassword: newPasswordField.$value,
    keyValid: $keyValid,
  },
  filter: and(not($formDisabled), $formValid),
  fn: (source) => {
    return source.keyValid
      ? { new: source.newPassword }
      : { current: source.currentPassword, new: source.newPassword }
  },
  target: updatePasswordFx,
})

function chainProtected(route: RouteInstance<object>) {
  const accessCheckStarted = createEvent<CurrentRouteParamsAndQuery>()
  const accessDenied = createEvent()

  const alreadyAuthenticated = sample({
    clock: accessCheckStarted,
    source: $authenticationStatus,
    filter: (status) => status === AuthStatus.Authenticated,
  })

  /* Если пользователь первый раз зашел на страницу */
  sample({
    clock: accessCheckStarted,
    source: $authenticationStatus,
    filter: (status) => status === AuthStatus.Initial,
    target: getSessionFx,
  })

  /* Проверяем валидность ключа, если он указан */
  sample({
    clock: accessCheckStarted,
    filter: ({ query }) => query.key !== undefined,
    fn: ({ query }) => ({ key: query.key }),
    target: validateKeyFx,
  })

  /* Ключ валиден, кладем в стор */
  sample({
    clock: validateKeyFx.done,
    fn: () => true,
    target: $keyValid,
  })

  /* Ключ не валиден, кладем в стор */
  sample({
    clock: validateKeyFx.fail,
    fn: () => false,
    target: $keyValid,
  })

  /* Ключ не валиден, пользователь анонимный, запрещаем доступ */
  sample({
    clock: validateKeyFx.fail,
    source: $authenticationStatus,
    filter: (status) => status === AuthStatus.Anonymous,
    target: accessDenied,
  })

  /* Анонимный пользователь, ключ не валиден (если ответ на валидность ключа пришел раньше) */
  sample({
    clock: getSessionFx.fail,
    source: $keyValid,
    filter: (valid) => valid === false,
    target: accessDenied,
  })

  /* Анонимный пользователь, ключ не указан */
  sample({
    clock: getSessionFx.fail,
    source: currentRoute.$query,
    filter: (query) => query.key === undefined,
    target: accessDenied,
  })

  /* Перенаправляем на страницу входа */
  sample({
    clock: accessDenied,
    target: routes.auth.login.open,
  })

  return chainRoute({
    route,
    beforeOpen: accessCheckStarted,
    openOn: [alreadyAuthenticated, getSessionFx.done, validateKeyFx.done],
    cancelOn: accessDenied,
  })
}

// TODO: Add server errors catching
