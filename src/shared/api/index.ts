import { createEffect } from 'effector'
import wretch, { WretchResponse } from 'wretch'
import QueryStringAddon from 'wretch/addons/queryString'

const api = wretch(import.meta.env.VITE_API_URL + '/api')
  .options({ credentials: 'include', mode: 'cors' })
  .addon(QueryStringAddon)

type WretchError<ErrorBody> = Error & {
  status: number
  response: WretchResponse
  text: string
  json: ErrorBody
}

/* Models */

export interface User {
  email: string
  username: string
}

/* Session */

interface GetSessionError {
  error: 'unauthorized'
}

export const getSessionFx = createEffect<
  void,
  User,
  WretchError<GetSessionError>
>(() => {
  return api.url('/session').get().json<User>()
})

/* Sign in */

interface SignIn {
  email: string
  password: string
  rememberMe: boolean
}

export interface SignInError {
  error: 'invalid_credentials'
}

export const signInFx = createEffect<SignIn, User, WretchError<SignInError>>(
  (form) => {
    return api.url('/signin').post(form).json<User>()
  },
)

/* Sign up */

interface SignUp {
  email: string
  password: string
  username: string
}

interface SignUpError {
  error: 'email_exist' | 'username_exist'
}

export const signUpFx = createEffect<SignUp, null, WretchError<SignUpError>>(
  (form) => {
    return api.url('/signup').post(form).json()
  },
)

/* Send recovery email */

interface ResetPassword {
  email: string
}

export const resetPasswordFx = createEffect<
  ResetPassword,
  null,
  WretchError<null>
>((body) => {
  return api.url('/reset-password/send').post(body).json()
})

/* Validate key */

interface ValidateKey {
  key: string
}

interface ValidateKeyResponse {
  is_valid: boolean
}

interface ValidateKeyError {
  error: 'key_invalid'
}

export const validateKeyFx = createEffect<
  ValidateKey,
  ValidateKeyResponse,
  WretchError<ValidateKeyError>
>(({ key }: ValidateKey) => {
  return api
    .get(`/reset-password/validate?key=${key}`)
    .json<ValidateKeyResponse>()
})

/* Update password */

interface UpdatePassword {
  current?: string
  new: string
}

interface UpdatePasswordError {
  error: 'unauthorized' | 'invalid_credentials'
}

export const updatePasswordFx = createEffect<
  UpdatePassword,
  null,
  UpdatePasswordError
>((body) => {
  return api.url('/users/me/password').put(body).json()
})

/* Update username */

interface UpdateUsername {
  username: string
}

interface UpdateUsernameError {
  error: 'exist'
}

export const updateUsernameFx = createEffect<
  UpdateUsername,
  null,
  WretchError<UpdateUsernameError>
>((body) => {
  return api.url('/users/me/username').put(body).json()
})

/* Social Network */

export enum SocialNetwork {
  MESSENGER = 'messenger',
  WHATSAPP = 'whatsapp',
  VKONTAKTE = 'vkontakte',
  VIBER = 'viber',
  OK = 'ok',
  SKYPE = 'skype',
  TELEGRAM = 'telegram',
  INSTAGRAM = 'instagram',
  X = 'X',
  EMAIL = 'email',
  FACEBOOK = 'facebook',
  TELEPHONE = 'telephone',
  YOUTUBE = 'youtube',
  BEHANCE = 'behance',
  SNAPCHAT = 'snapchat',
  DRIBBBLE = 'dribbble',
  LINKEDIN = 'linkedin',
  GITHUB = 'github',
}

export interface SocialNetworkButton {
  id: string
  type: SocialNetwork
  enabled: boolean
  value: string
}
