import { reflect } from '@effector/reflect'
import { useUnit } from 'effector-react/effector-react.umd'
import { FormEventHandler, useEffect } from 'react'
import { AuthLayout } from 'src/entites/layouts'
import {
  Button,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  PasswordInput,
} from '~/shared/ui'
import {
  $formDisabled,
  $keyValid,
  ConfirmPasswordError,
  confirmPasswordField,
  CurrentPasswordError,
  currentPasswordField,
  NewPasswordError,
  newPasswordField,
  pageUnmounted,
  updatePasswordFormSubmitted,
} from './model'

const currentPasswordErrorText: Record<CurrentPasswordError, string> = {
  empty: 'Password field cannot be empty',
  invalid: 'Invalid password. Please check your password and try again.',
}

export const CurrentPasswordField = () => {
  const { value, error, disabled } = useUnit({
    value: currentPasswordField.$value,
    error: currentPasswordField.$error,
    disabled: $formDisabled,
  })

  return (
    <Field
      value={value}
      disabled={disabled}
      error={error ? currentPasswordErrorText[error] : null}
      onChange={(event) => {
        currentPasswordField.changed(event.target.value)
      }}
      required
      label="Current password"
      placeholder="Your current password"
      asChild
    >
      <PasswordInput />
    </Field>
  )
}

const newPasswordErrorText: Record<NewPasswordError, string> = {
  empty: 'Password field cannot be empty',
  too_short: 'Password minimal length is 8 characters',
  too_long: 'Password maximum length is 32 characters',
  no_lower_letter: 'Password should contain at least one lowercase letter',
  no_upper_letter: 'Password should contain at least one capital letter',
  no_digit: 'Password should contain at least one digit',
}

export const NewPasswordField = () => {
  const { value, error, disabled } = useUnit({
    value: newPasswordField.$value,
    error: newPasswordField.$error,
    disabled: $formDisabled,
  })

  return (
    <Field
      value={value}
      disabled={disabled}
      error={error ? newPasswordErrorText[error] : null}
      onChange={(event) => {
        newPasswordField.changed(event.target.value)
      }}
      required
      label="New password"
      placeholder="Type new password"
      asChild
    >
      <PasswordInput />
    </Field>
  )
}

const confirmPasswordErrorText: Record<ConfirmPasswordError, string> = {
  empty: 'This field cannot be empty',
  not_equal: 'Passwords are not identical',
}

export const ConfirmPasswordField = () => {
  const { value, error, disabled } = useUnit({
    value: confirmPasswordField.$value,
    error: confirmPasswordField.$error,
    disabled: $formDisabled,
  })

  return (
    <Field
      required
      value={value}
      disabled={disabled}
      error={error ? confirmPasswordErrorText[error] : null}
      onChange={(event) => {
        currentPasswordField.changed(event.target.value)
      }}
      label="Confirm password"
      placeholder="Type new password again"
      asChild
    >
      <PasswordInput />
    </Field>
  )
}

const UpdatePasswordForm = () => {
  const keyValid = useUnit($keyValid)

  const onSubmit: FormEventHandler = (event) => {
    event.preventDefault()
    updatePasswordFormSubmitted()
  }

  return (
    <form
      id="update-password"
      className="flex flex-col gap-4"
      onSubmit={onSubmit}
    >
      {!keyValid && <CurrentPasswordField />}
      <NewPasswordField />
      <ConfirmPasswordField />
    </form>
  )
}

const SubmitButton = reflect({
  view: Button,
  bind: {
    disabled: $formDisabled,
    form: 'update-password',
    children: 'Update password',
    className: 'w-full',
  },
})

export const UpdatePasswordPage = () => {
  useEffect(() => pageUnmounted, [])

  return (
    <AuthLayout>
      <div className="flex flex-col w-full items-center max-w-sm">
        <CardHeader className="w-full">
          <CardTitle>Update password</CardTitle>
          <CardDescription>Create a new password!</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <UpdatePasswordForm />
        </CardContent>
        <CardFooter className="w-full">
          <SubmitButton />
        </CardFooter>
      </div>
    </AuthLayout>
  )
}
