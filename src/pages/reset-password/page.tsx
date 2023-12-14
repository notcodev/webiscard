import { reflect } from '@effector/reflect'
import { useUnit } from 'effector-react'
import { CheckIcon } from 'lucide-react'
import { FormEventHandler, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AuthLayout } from 'src/entites/layouts'
import { useTimer } from '~/shared/lib/react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
} from '~/shared/ui'
import {
  $formDisabled,
  type EmailError,
  emailField,
  pageUnmounted,
  resetPasswordFormSubmitted,
  TIMEOUT_SECONDS,
  timeoutRedirect,
} from './model'

const emailErrorText: Record<EmailError, string> = {
  empty: 'Email field cannot be empty',
  invalid: 'Invalid email signature',
  not_found: 'User with this email not found',
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

const SubmitButton = reflect({
  view: Button,
  bind: {
    disabled: $formDisabled,
    form: 'reset-password',
    children: 'Reset password',
    className: 'w-full',
  },
})

const SuccessAlert = () => {
  const countdown = useTimer(TIMEOUT_SECONDS)

  return (
    <div className="absolute mx-auto left-0 right-0 top-4 max-w-md px-4">
      <Alert>
        <CheckIcon className="h-4 w-4" />
        <AlertTitle>Email successfully sent!</AlertTitle>
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

export const ResetPasswordPage = () => {
  useEffect(() => pageUnmounted, [])

  const onSubmit: FormEventHandler = (event) => {
    event.preventDefault()
    resetPasswordFormSubmitted()
  }

  return (
    <AuthLayout>
      <div className="flex flex-col w-full items-center max-w-sm">
        <CardHeader className="w-full">
          <CardTitle>Reset password</CardTitle>
          <CardDescription>
            Enter your email and we’ll send you a recover link.
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <form
            id="reset-password"
            className="flex flex-col gap-4 w-full"
            onSubmit={onSubmit}
          >
            <EmailField />
          </form>
        </CardContent>
        <CardFooter className="w-full">
          <SubmitButton />
        </CardFooter>
      </div>
      <SuccessAlertPortal />
    </AuthLayout>
  )
}
