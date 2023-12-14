import { Link } from 'atomic-router-react'
import IPhone from '~/assets/iphone.svg?react'
import { routes } from '~/shared/routing'
import { Button, Title, WebiscardIcon } from '~/shared/ui'

export const HomePage = () => {
  return (
    <>
      <header className="container mx-auto mt-8 flex justify-between items-center">
        <WebiscardIcon />
        <Button asChild variant="outline">
          <Link to={routes.auth.login}>Sign in</Link>
        </Button>
      </header>
      <main className="overflow-hidden">
        <div className="container mx-auto flex flex-col lg:flex-row items-center lg:justify-between py-16 relative">
          <div className="flex items-center gap-4 lg:gap-6 flex-col max-w-sm lg:max-w-lg lg:items-start">
            <Title
              order={1}
              className="text-center text-4xl lg:text-5xl lg:text-start"
            >
              Help your customers reach you faster
            </Title>
            <p className="text-center text-xl font-light lg:text-start tracking-wider">
              Gather all your contact info on one business card and share a link
              to it.
            </p>
            <Button
              asChild
              className="mt-2 font-medium text-md px-12 py-6 lg:text-xl w-fit lg:px-28 lg:py-8 rounded-full"
            >
              <Link to={routes.auth.signup}>Get started for free</Link>
            </Button>
          </div>
          <div className="relative w-64 mt-8 lg:mt-0">
            <div className="absolute -left-[18px] -top-[15px] w-[156%]">
              <img
                draggable={false}
                src="/images/iphone-shadow.png"
                alt="iphone-shadow"
              />
            </div>
            <IPhone className="w-full h-auto" />
          </div>
        </div>
      </main>
    </>
  )
}
