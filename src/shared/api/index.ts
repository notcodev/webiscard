import { createEffect } from 'effector'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import wretch, { WretchResponse } from 'wretch'
import QueryStringAddon from 'wretch/addons/queryString'

const api = wretch(import.meta.env.VITE_API_URL + '/api')
  .options({ credentials: 'include', mode: 'cors' })
  .addon(QueryStringAddon)

export interface FastifyError<
  StatusCode extends StatusCodes,
  Code extends `FST_${Uppercase<string>}`,
  Error extends ReasonPhrases,
> {
  readonly statusCode: StatusCode
  readonly code: Code
  readonly error: Error
  readonly message: string
}

type WretchError<ErrorBody> = Error & {
  status: number
  response: WretchResponse
  text: string
  json?: ErrorBody
}

/* Models */

export interface User {
  email: string
  username: string
}

/* Session */

type GetSessionError = FastifyError<
  StatusCodes.UNAUTHORIZED,
  'FST_UNAUTHORIZED',
  ReasonPhrases.UNAUTHORIZED
>

export const getSessionFx = createEffect<
  void,
  User,
  WretchError<GetSessionError>
>(() => {
  return api.url('/v1/session').get().json<User>()
})

/* Sign in */

interface SignIn {
  email: string
  password: string
  rememberMe: boolean
}

type SignInError =
  | FastifyError<
      StatusCodes.FORBIDDEN,
      'FST_INVALID_CREDENTIALS',
      ReasonPhrases.FORBIDDEN
    >
  | FastifyError<
      StatusCodes.NOT_FOUND,
      'FST_USER_NOT_FOUND',
      ReasonPhrases.NOT_FOUND
    >

export const signInFx = createEffect<SignIn, User, WretchError<SignInError>>(
  (form) => {
    return api.url('/v1/login').post(form).json<User>()
  },
)

/* Sign up */

interface SignUp {
  email: string
  password: string
  username: string
}

type SignUpError =
  | FastifyError<
      StatusCodes.CONFLICT,
      'FST_EMAIL_EXIST',
      ReasonPhrases.CONFLICT
    >
  | FastifyError<
      StatusCodes.CONFLICT,
      'FST_USERNAME_EXIST',
      ReasonPhrases.CONFLICT
    >

export const signUpFx = createEffect<SignUp, null, WretchError<SignUpError>>(
  (form) => {
    return api.url('/v1/signup').post(form).json()
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

/* Card */

export enum ProfilePictureSize {
  SMALL = 'sm',
  MEDIUM = 'md',
  LARGE = 'lg',
}

interface ProfilePicture {
  size: ProfilePictureSize
  filename: string
}

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

export type BackgroundType = 'Gradient' | 'CustomImage'

export interface Background {
  type: BackgroundType
  value: string
}

type UpdateCard = Partial<{
  username: string
  name: string
  description: string
  profilePicture: Partial<ProfilePicture>
  socialNetworks: SocialNetworkButton[]
  background: Background
}>

type UpdateCardError = FastifyError<
  StatusCodes.CONFLICT,
  'FST_USERNAME_EXIST',
  ReasonPhrases.CONFLICT
>

export const updateCardFx = createEffect<
  UpdateCard,
  null,
  WretchError<UpdateCardError>
>((card) => {
  return api.url('/v1/card').patch(card).json()
})

export interface UploadImage {
  imageBase64: string
}

interface Image {
  filename: string
}

export const uploadImageFx = createEffect<
  UploadImage,
  Image,
  WretchError<unknown>
>(({ imageBase64 }) => {
  return api.url('/v1/upload-image').post({ imageBase64 }).json()
})

interface Card {
  username: string
  name: string
  description: string
  profilePicture: {
    size: ProfilePictureSize
    filename: string | null
  }
  socialNetworks: SocialNetworkButton[]
  background: {
    type: BackgroundType
    value: string
  } | null
  isPublished: boolean
}

export const getCardDraftFx = createEffect<void, Card, WretchError<unknown>>(
  () => {
    return api.get('/v1/card').json()
  },
)

interface GetCard {
  username: string
}

export type GetCardPublicError = FastifyError<
  StatusCodes.NOT_FOUND,
  'FST_CARD_NOT_FOUND',
  ReasonPhrases.NOT_FOUND
>

export const getCardPublicFx = createEffect<
  GetCard,
  Omit<Card, 'username' | 'isPublished'>,
  WretchError<unknown>
>(({ username }) => {
  return api.get(`/v1/card/${username}`).json()
})

export const publishCardFx = createEffect(() => {
  return api.url('/v1/publish-card').post().json()
})
