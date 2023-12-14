import { attach, createEvent, sample } from 'effector'
import { and, not, or } from 'patronum'
import * as api from '~/shared/api'
import { createField, createTimeoutRedirect } from '~/shared/lib/effector'
import { routes } from '~/shared/routing'
import { EmailValidationError, EmailValidator } from '~/shared/validators'

export const currentRoute = routes.auth.resetPassword

const resetPasswordFx = attach({ effect: api.resetPasswordFx })

export const resetPasswordFormSubmitted = createEvent()
export const pageUnmounted = createEvent()

export const TIMEOUT_SECONDS = 5
export const timeoutRedirect = createTimeoutRedirect({
  route: routes.auth.login,
  timeout: TIMEOUT_SECONDS * 1000,
  clearOn: pageUnmounted,
})

export type EmailError = EmailValidationError | 'not_found'
export const emailField = createField<string, EmailError>({
  defaultValue: '',
  validate: {
    type: 'class',
    on: resetPasswordFormSubmitted,
    Class: EmailValidator,
  },
  reset: {
    all: pageUnmounted,
    error: resetPasswordFormSubmitted,
  },
})

const $formValid = emailField.$error.map((value) => value === null)
const $resetPasswordPending = resetPasswordFx.pending
export const $formDisabled = or($resetPasswordPending, timeoutRedirect.$pending)

sample({
  clock: resetPasswordFormSubmitted,
  source: {
    email: emailField.$value,
  },
  filter: and(not($formDisabled), $formValid),
  target: resetPasswordFx,
})

sample({
  clock: resetPasswordFx.done,
  target: timeoutRedirect.call,
})

/* Catching errors */

sample({
  clock: resetPasswordFx.fail,
  filter({ error }) {
    return error.status === 404
  },
  fn(): EmailError {
    return 'not_found'
  },
  target: emailField.$error,
})

// TODO: Add server errors catching
