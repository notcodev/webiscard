import { createRouteView } from 'atomic-router-react'
import { PageLoader } from '~/shared/ui'
import { EditorPage } from './page'
import { currentRoute, editorLoadedRoute } from './shared/routing'

export const EditorRoute = {
  view: createRouteView({
    route: editorLoadedRoute,
    view: EditorPage,
    otherwise: PageLoader,
  }),
  route: currentRoute,
}
