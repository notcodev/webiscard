import { router } from '~/shared/routing'

export function getRouterPaths() {
  return router.routes.map((value) => value.path.slice(1))
}
