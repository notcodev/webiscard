import { routes } from '~/shared/routing'
import { Anchor, Title, WebiscardIcon } from '~/shared/ui'

export const NotFoundPage = () => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center px-8">
      <WebiscardIcon className="absolute top-12" />
      <Title className="text-center" order={1}>
        Oops, page not found
      </Title>
      <p className="text-lg text-center text-muted-foreground mt-2">
        Perhaps you entered the address <br />
        incorrectly, or such a page no longer exists.
      </p>
      <Anchor className="text-lg mt-4" to={routes.home}>
        Go to main page
      </Anchor>
    </div>
  )
}
