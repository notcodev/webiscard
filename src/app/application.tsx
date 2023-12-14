import { RouterProvider } from 'atomic-router-react'
import { Suspense } from 'react'
import { Pages } from '~/pages'
import { router } from '~/shared/routing'
import { ThemeProvider } from '~/shared/theme'
import { PageLoader } from '~/shared/ui'

export const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <RouterProvider router={router}>
        <Suspense fallback={<PageLoader />}>
          <Pages />
        </Suspense>
      </RouterProvider>
    </ThemeProvider>
  )
}
