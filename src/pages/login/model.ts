import { attach, createEvent, sample } from 'effector'
import { and, every, not, or } from 'patronum'
import * as api from '~/shared/api'
import { createBoolean, createField } from '~/shared/lib/effector'
import { routes } from '~/shared/routing'
import { chainAnonymous, getSessionFx } from '~/shared/session'
import { EmailValidator, PasswordValidator } from '~/shared/validators'

export const currentRoute = routes.auth.login
export const anonymousRoute = chainAnonymous(currentRoute, {
  otherwise: { route: routes.editor },
})

const signInFx = attach({ effect: api.signInFx })

export const formSubmitted = createEvent()
export const pageUnmounted = createEvent()

export type EmailError =
  | Exclude<ReturnType<EmailValidator['validate']>, null>
  | 'not_found'
export const emailField = createField<string, EmailError>({
  defaultValue: '',
  validate: {
    type: 'class',
    on: formSubmitted,
    Class: EmailValidator,
  },
  reset: {
    all: pageUnmounted,
    error: formSubmitted,
  },
})

export type PasswordError = 'empty' | 'invalid'
export const passwordField = createField({
  defaultValue: '',
  validate: {
    type: 'class-with-convertor',
    on: formSubmitted,
    Class: PasswordValidator,
    convert(error): PasswordError | null {
      return error === null || error === 'empty' ? error : 'invalid'
    },
  },
  reset: {
    all: pageUnmounted,
    error: formSubmitted,
  },
})
export const rememberMe = createBoolean(true)

export const $loginPending = or(signInFx.pending, getSessionFx.pending)

const $formValid = every({
  stores: [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    passwordField.$error,
    emailField.$error,
  ],
  predicate: null,
})

sample({
  clock: formSubmitted,
  source: {
    email: emailField.$value,
    password: passwordField.$value,
    rememberMe: rememberMe.$value,
  },
  filter: and(not($loginPending), $formValid),
  target: signInFx,
})

sample({
  clock: signInFx.done,
  target: getSessionFx,
})

/* Catching errors */

sample({
  clock: signInFx.fail,
  filter({ error }) {
    return error.status === 404
  },
  fn(): EmailError {
    return 'not_found'
  },
  target: emailField.$error,
})

sample({
  clock: signInFx.fail,
  filter({ error }) {
    return error.status === 403
  },
  fn(): PasswordError {
    return 'invalid'
  },
  target: passwordField.$error,
})

// TODO: Add server errors catching
