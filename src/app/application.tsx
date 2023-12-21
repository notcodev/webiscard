import { RouterProvider } from 'atomic-router-react'
import { Suspense } from 'react'
import { NotificationsLayout } from '~/entites/notification-center'
import { Pages } from '~/pages'
import { router } from '~/shared/routing'
import { PageLoader } from '~/shared/ui'

export const App = () => {
  return (
    <RouterProvider router={router}>
      <Suspense fallback={<PageLoader />}>
        <NotificationsLayout>
          <Pages />
        </NotificationsLayout>
      </Suspense>
    </RouterProvider>
  )
}
