import {
  chainRoute,
  RouteInstance,
  RouteParams,
  RouteParamsAndQuery,
} from 'atomic-router'
import { attach, createEvent, createStore, sample } from 'effector'
import * as api from '~/shared/api'
import { User } from '~/shared/api'
import { ReplaceEmptyObject } from '~/shared/lib/typescript'

export const getSessionFx = attach({ effect: api.getSessionFx })

export enum AuthStatus {
  Initial,
  Pending,
  Anonymous,
  Authenticated,
}

export const $authenticationStatus = createStore(AuthStatus.Initial)
export const $user = createStore<User | null>(null)

$authenticationStatus.on(getSessionFx, (status) => {
  if (status === AuthStatus.Initial) return AuthStatus.Pending
  return status
})

$user.on(getSessionFx.doneData, (_, user) => user)
$authenticationStatus.on(getSessionFx.doneData, () => AuthStatus.Authenticated)

$authenticationStatus.on(getSessionFx.fail, () => AuthStatus.Anonymous)

type Otherwise<Params extends RouteParams> = {
  route: RouteInstance<Params>
} & ReplaceEmptyObject<Params, object, { params: ReplaceEmptyObject<Params> }>

interface ChainParams<Params extends RouteParams> {
  otherwise?: Otherwise<Params>
}

export function chainAuthorized<
  Params extends RouteParams,
  OtherwiseParams extends RouteParams,
>(
  route: RouteInstance<Params>,
  { otherwise }: ChainParams<OtherwiseParams>,
): RouteInstance<Params> {
  const sessionCheckStarted = createEvent<RouteParamsAndQuery<Params>>()
  const sessionReceivedAnonymous = createEvent<RouteParamsAndQuery<Params>>()

  const alreadyAuthenticated = sample({
    clock: sessionCheckStarted,
    source: $authenticationStatus,
    filter: (status) => status === AuthStatus.Authenticated,
  })

  const alreadyAnonymous = sample({
    clock: sessionCheckStarted,
    source: $authenticationStatus,
    filter: (status) => status === AuthStatus.Anonymous,
  })

  sample({
    clock: sessionCheckStarted,
    source: $authenticationStatus,
    filter: (status) => status === AuthStatus.Initial,
    target: getSessionFx,
  })

  sample({
    clock: [alreadyAnonymous, getSessionFx.fail],
    source: { params: route.$params, query: route.$query },
    filter: route.$isOpened,
    target: sessionReceivedAnonymous,
  })

  if (otherwise) {
    const openWithParamsFx = attach({
      effect: otherwise.route.open,
      mapParams() {
        return otherwise.params
      },
    })

    sample({
      clock: sessionReceivedAnonymous,
      target: openWithParamsFx,
    })
  }

  return chainRoute({
    route,
    beforeOpen: sessionCheckStarted,
    openOn: [alreadyAuthenticated, getSessionFx.done],
    cancelOn: sessionReceivedAnonymous,
  })
}

export function chainAnonymous<
  Params extends RouteParams,
  OtherwiseParams extends RouteParams,
>(
  route: RouteInstance<Params>,
  { otherwise }: ChainParams<OtherwiseParams>,
): RouteInstance<Params> {
  const sessionCheckStarted = createEvent<RouteParamsAndQuery<Params>>()
  const sessionReceivedAuthenticated =
    createEvent<RouteParamsAndQuery<Params>>()

  const alreadyAuthenticated = sample({
    clock: sessionCheckStarted,
    source: $authenticationStatus,
    filter: (status) => status === AuthStatus.Authenticated,
  })

  const alreadyAnonymous = sample({
    clock: sessionCheckStarted,
    source: $authenticationStatus,
    filter: (status) => status === AuthStatus.Anonymous,
  })

  sample({
    clock: sessionCheckStarted,
    source: $authenticationStatus,
    filter: (status) => status === AuthStatus.Initial,
    target: getSessionFx,
  })

  sample({
    clock: [alreadyAuthenticated, getSessionFx.done],
    source: { params: route.$params, query: route.$query },
    filter: route.$isOpened,
    target: sessionReceivedAuthenticated,
  })

  if (otherwise) {
    const openWithParamsFx = attach({
      effect: otherwise.route.open,
      mapParams() {
        return otherwise.params
      },
    })

    sample({
      clock: sessionReceivedAuthenticated,
      target: openWithParamsFx,
    })
  }

  return chainRoute({
    route,
    beforeOpen: sessionCheckStarted,
    openOn: [alreadyAnonymous, getSessionFx.fail],
    cancelOn: sessionReceivedAuthenticated,
  })
}
