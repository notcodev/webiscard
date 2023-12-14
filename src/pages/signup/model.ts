import { attach, createEvent, createStore, sample } from 'effector'
import { and, every, not, or } from 'patronum'
import * as api from '~/shared/api'
import { createField, createTimeoutRedirect } from '~/shared/lib/effector'
import { routes } from '~/shared/routing'
import { chainAnonymous } from '~/shared/session'
import {
  EmailValidationError,
  EmailValidator,
  PasswordValidator,
  UsernameValidationError,
  UsernameValidator,
} from '~/shared/validators'

export const currentRoute = routes.auth.signup
export const anonymousRoute = chainAnonymous(currentRoute, {
  otherwise: { route: routes.editor },
})

const signUpFx = attach({ effect: api.signUpFx })
export const formSubmitted = createEvent()
export const pageUnmounted = createEvent()

export const TIMEOUT_SECONDS = 5
export const timeoutRedirect = createTimeoutRedirect({
  route: routes.auth.login,
  timeout: TIMEOUT_SECONDS,
  clearOn: pageUnmounted,
})

type EmailError = EmailValidationError | 'exist'
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

export const passwordField = createField({
  defaultValue: '',
  validate: {
    type: 'class',
    on: formSubmitted,
    Class: PasswordValidator,
  },
  reset: {
    all: pageUnmounted,
    error: formSubmitted,
  },
})

type UsernameError = UsernameValidationError | 'exist'
export const usernameField = createField<string, UsernameError>({
  defaultValue: '',
  validate: {
    type: 'class',
    on: formSubmitted,
    Class: UsernameValidator,
  },
  reset: {
    all: pageUnmounted,
    error: formSubmitted,
  },
})

const $formValid = every({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  stores: [passwordField.$error, emailField.$error, usernameField.$error],
  predicate: null,
})

const $redirectTimeout = createStore<NodeJS.Timeout | null>(null)
const $signupPending = signUpFx.pending
export const $formDisabled = or($signupPending, $redirectTimeout)

sample({
  clock: formSubmitted,
  source: {
    email: emailField.$value,
    password: passwordField.$value,
    username: usernameField.$value,
  },
  filter: and(not($formDisabled), $formValid),
  target: signUpFx,
})

sample({
  clock: signUpFx.done,
  target: timeoutRedirect.call,
})

/* Catching errors */

sample({
  clock: signUpFx.fail,
  filter({ error }) {
    return error.json.error === 'email_exist'
  },
  fn(): EmailError {
    return 'exist'
  },
  target: emailField.$error,
})

sample({
  clock: signUpFx.fail,
  filter({ error }) {
    return error.json.error === 'username_exist'
  },
  fn(): UsernameError {
    return 'exist'
  },
  target: usernameField.$error,
})

// TODO: Add server errors catching
