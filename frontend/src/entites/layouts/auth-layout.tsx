import { PropsWithChildren } from 'react'
import { WebiscardIcon } from '~/shared/ui'

export const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="flex">
      <div className="hidden w-full h-screen lg:block">
        <img
          className="h-full object-cover"
          src="/images/auth-background.jpg"
          alt="background"
        />
      </div>
      <div className="lg:border-l flex items-center bg-background flex-col gap-12 w-full lg:w-fit lg:min-w-[384px] lg:px-4 h-screen pt-16">
        <WebiscardIcon />
        {children}
      </div>
    </main>
  )
}
