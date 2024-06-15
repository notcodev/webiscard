import { createEffect } from 'effector'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import wretch, { WretchResponse } from 'wretch'
import FormDataAddon from 'wretch/addons/formData'
import QueryStringAddon from 'wretch/addons/queryString'

const api = wretch(import.meta.env.VITE_API_URL + '/api')
  .options({ credentials: 'include', mode: 'cors' })
  .addon(QueryStringAddon)
  .addon(FormDataAddon)

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

/* Card */

export enum AvatarSize {
  SMALL = 'sm',
  MEDIUM = 'md',
  LARGE = 'lg',
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

export enum ImageKind {
  PROFILE_PICTURE = 'ProfilePicture',
  BACKGROUND = 'Background',
}

interface UploadImage {
  file: File
  kind: ImageKind
}

interface Image {
  filename: string
}

export const uploadImageFx = createEffect<
  UploadImage,
  Image,
  WretchError<unknown>
>((formData) => {
  return api.url('/v1/image').formData(formData).post().json()
})

interface Card {
  username: string
  name: string
  description: string
  avatarSize: AvatarSize
  avatarFilename: string | null
  socialNetworks: SocialNetworkButton[]
  background: string | null
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
  WretchError<GetCardPublicError>
>(({ username }) => {
  return api.get(`/v1/card/${username}`).json()
})

export const publishCardFx = createEffect(() => {
  return api.url('/v1/publish-card').post().json()
})

type UpdateCard = Partial<{
  [Property in keyof Card]: NonNullable<Card[Property]>
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
