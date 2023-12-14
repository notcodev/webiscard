import { reflect } from '@effector/reflect'
import { useUnit } from 'effector-react'
import { CheckIcon } from 'lucide-react'
import { FormEventHandler, forwardRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AuthLayout } from '~/entites/layouts'
import { useTimer } from '~/shared/lib/react'
import { cn } from '~/shared/lib/shadcn'
import { routes } from '~/shared/routing'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Anchor,
  Button,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  InputProps,
  PasswordInput,
} from '~/shared/ui'
import {
  $formDisabled,
  emailField,
  formSubmitted,
  pageUnmounted,
  passwordField,
  TIMEOUT_SECONDS,
  timeoutRedirect,
  usernameField,
} from './model'

const emailErrorText = {
  empty: 'Email field cannot be empty',
  invalid: 'Invalid email',
  exist: 'User with this email already exist',
}

const EmailField = () => {
  const { value, error, disabled } = useUnit({
    value: emailField.$value,
    error: emailField.$error,
    disabled: $formDisabled,
  })

  return (
    <Field
      required
      value={value}
      onChange={(event) => {
        emailField.changed(event.target.value)
      }}
      error={error ? emailErrorText[error] : null}
      disabled={disabled}
      label="Email"
      placeholder="Enter your email address"
    />
  )
}

const passwordErrorText = {
  empty: 'Password field cannot be empty',
  too_short: 'Password minimal length is 8 characters',
  too_long: 'Password maximum length is 32 characters',
  no_lower_letter: 'Password should contain at least one lowercase letter',
  no_upper_letter: 'Password should contain at least one capital letter',
  no_digit: 'Password should contain at least one digit',
}

const PasswordField = () => {
  const { value, error, disabled } = useUnit({
    value: passwordField.$value,
    error: passwordField.$error,
    disabled: $formDisabled,
  })

  return (
    <Field
      error={error ? passwordErrorText[error] : null}
      onChange={(event) => {
        passwordField.changed(event.target.value)
      }}
      disabled={disabled}
      required
      value={value}
      label="Password"
      placeholder="Enter your password"
      asChild
    >
      <PasswordInput />
    </Field>
  )
}

const PageLinkInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, disabled, ...props }, ref) => {
    return (
      <div
        className={cn(
          'peer flex items-center h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-within:ring-1 focus-within:ring-ring aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
          error ? 'border-red-500 focus-within:ring-0' : null,
          className,
        )}
        aria-disabled={disabled}
      >
        <span className={error ? 'text-red-500' : undefined}>
          webiscard.github.io/
        </span>
        <input
          type="text"
          ref={ref}
          className={cn(
            'flex w-full bg-transparent transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed',
            error ? 'text-red-500 placeholder:text-red-500' : null,
          )}
          disabled={disabled}
          {...props}
        />
      </div>
    )
  },
)

const usernameErrorText = {
  empty: 'Page link field cannot be empty',
  exist: 'This page already exist',
  too_short: 'Username minimal length is 4 characters',
  too_long: 'Username maximum length is 18 characters',
  forbidden_characters: "Username hasn't to contain spec. characters",
  router_conflict: "Username hasn't to coincide with reserved paths",
}

const PageLinkField = () => {
  const { value, error, disabled } = useUnit({
    value: usernameField.$value,
    error: usernameField.$error,
    disabled: $formDisabled,
  })

  return (
    <Field
      value={value}
      onChange={(event) => {
        usernameField.changed(event.target.value)
      }}
      placeholder="username"
      required
      label="Link to your page"
      id="page-link"
      error={error ? usernameErrorText[error] : null}
      disabled={disabled}
      asChild
    >
      <PageLinkInput />
    </Field>
  )
}

const SubmitButton = reflect({
  view: Button,
  bind: {
    disabled: $formDisabled,
    form: 'signin',
    children: 'Create page',
    className: 'w-full',
  },
})

const SuccessAlert = () => {
  const countdown = useTimer(TIMEOUT_SECONDS)

  return (
    <div className="absolute mx-auto left-0 right-0 top-4 max-w-md px-4">
      <Alert>
        <CheckIcon className="h-4 w-4" />
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>
          In {countdown} seconds you will be redirected to log in page
        </AlertDescription>
      </Alert>
    </div>
  )
}

const SuccessAlertPortal = () => {
  const showAlert = useUnit(timeoutRedirect.$pending)

  return (
    showAlert &&
    createPortal(<SuccessAlert />, document.querySelector('#popup-container')!)
  )
}

export const SignupPage = () => {
  useEffect(() => pageUnmounted, [])

  const onSubmit: FormEventHandler = (event) => {
    event.preventDefault()
    formSubmitted()
  }

  return (
    <AuthLayout>
      <div className="flex flex-col w-full items-center">
        <div className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
            <CardDescription>Create your own page!</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              id="signin"
              className="flex flex-col gap-4"
              onSubmit={onSubmit}
            >
              <EmailField />
              <PasswordField />
              <PageLinkField />
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <SubmitButton />
            <span className="text-xs text-muted-foreground text-center mx-2">
              By clicking on the «Create a page» button, you agree with the{' '}
              <Anchor to={routes.home} className="text-xs">
                Terms of use
              </Anchor>{' '}
              and{' '}
              <Anchor to={routes.home} className="text-xs">
                Privacy Policy
              </Anchor>
              .
            </span>
          </CardFooter>
        </div>
        <span className="text-sm">
          Already have an account?{' '}
          <Anchor to={routes.auth.login}>Sign in</Anchor>
        </span>
      </div>
      <SuccessAlertPortal />
    </AuthLayout>
  )
}
