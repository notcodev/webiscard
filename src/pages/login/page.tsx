import { reflect } from '@effector/reflect'
import { useUnit } from 'effector-react'
import { FormEventHandler, useEffect, useId } from 'react'
import { AuthLayout } from '~/entites/layouts'
import { routes } from '~/shared/routing'
import {
  Anchor,
  Button,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Field,
  Label,
  PasswordInput,
} from '~/shared/ui'
import {
  $loginPending,
  type EmailError,
  emailField,
  formSubmitted,
  pageUnmounted,
  type PasswordError,
  passwordField,
  rememberMe,
} from './model'

const FORM_ID = 'login'

const emailErrorText: Record<EmailError, string> = {
  empty: 'Email field cannot be empty',
  invalid: 'Invalid email signature',
  not_found: 'User with this email not found',
}

const EmailField = () => {
  const { value, error, disabled } = useUnit({
    value: emailField.$value,
    error: emailField.$error,
    disabled: $loginPending,
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

const passwordErrorText: Record<PasswordError, string> = {
  empty: 'Password field cannot be empty',
  invalid: 'Invalid password. Please check your password and try again',
}

const PasswordField = () => {
  const { value, error, disabled } = useUnit({
    value: passwordField.$value,
    error: passwordField.$error,
    disabled: $loginPending,
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

const RememberMe = () => {
  const { disabled, checked } = useUnit({
    disabled: $loginPending,
    checked: rememberMe.$value,
  })
  const id = useId()

  return (
    <Label
      htmlFor={id}
      className="flex items-center gap-2 cursor-pointer aria-disabled:cursor-not-allowed"
      aria-disabled={disabled}
    >
      <Checkbox
        className="rounded"
        form="signin"
        id={id}
        disabled={disabled}
        checked={checked}
        onCheckedChange={rememberMe.set}
      />
      Remember me
    </Label>
  )
}

const SubmitButton = reflect({
  view: Button,
  bind: {
    disabled: $loginPending,
    form: FORM_ID,
    children: 'Sign in',
  },
})

export const LoginPage = () => {
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
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Welcome back!</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              id={FORM_ID}
              className="flex flex-col gap-4"
              onSubmit={onSubmit}
            >
              <EmailField />
              <PasswordField />
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <RememberMe />
            <SubmitButton />
          </CardFooter>
        </div>
        <div className="flex flex-col items-center mt-4 gap-4">
          <Anchor to={routes.auth.resetPassword} className="w-fit">
            I forgot my password
          </Anchor>
          <span className="text-sm">
            Don’t you have an account?{' '}
            <Anchor to={routes.auth.signup}>Sign up</Anchor>
          </span>
        </div>
      </div>
    </AuthLayout>
  )
}
