import { RouterProvider } from 'atomic-router-react'
import { Suspense } from 'react'
import { Pages } from '~/pages'
import { router } from '~/shared/routing'
import { PageLoader } from '~/shared/ui'

export const App = () => {
  return (
    <RouterProvider router={router}>
      <Suspense fallback={<PageLoader />}>
        <Pages />
      </Suspense>
    </RouterProvider>
  )
}
