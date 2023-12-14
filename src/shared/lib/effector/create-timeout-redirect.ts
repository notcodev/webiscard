import { RouteInstance, RouteParams } from 'atomic-router'
import {
  createEffect,
  createEvent,
  EventCallable,
  restore,
  sample,
} from 'effector'
import { equals, not } from 'patronum'
import { ReplaceEmptyObject } from '~/shared/lib/typescript'

interface ParamsObject<Params extends RouteParams> {
  routeParams: ReplaceEmptyObject<Params>
}

type RedirectOptions<Params extends RouteParams> = {
  timeout: number
  route: RouteInstance<Params>
  clearOn: EventCallable<void>
} & ReplaceEmptyObject<Params, object, ParamsObject<Params>>

export function createTimeoutRedirect<Params extends RouteParams>({
  timeout,
  route,
  clearOn,
  routeParams,
}: RedirectOptions<Params>) {
  const redirectFx = createEffect(() => {
    return setTimeout(() => route.open(routeParams), timeout)
  })

  const clearTimeoutFx = createEffect((timeoutId: NodeJS.Timeout) => {
    clearTimeout(timeoutId)
  })

  const call = createEvent()
  const $timeoutId = restore(redirectFx, null)

  sample({
    clock: call,
    target: redirectFx,
  })

  sample({
    clock: clearOn,
    source: $timeoutId,
    filter(timeoutId) {
      return timeoutId !== null
    },
    fn(timeoutId) {
      return timeoutId as NodeJS.Timeout
    },
    target: clearTimeoutFx,
  })

  sample({
    clock: clearOn,
    fn: () => null,
    target: $timeoutId,
  })

  return { call, $pending: not(equals($timeoutId, null)) } as const
}
