import { useList } from 'effector-react'
import { CheckIcon, XIcon } from 'lucide-react'
import { PropsWithChildren } from 'react'
import { match } from 'ts-pattern'
import { Alert, AlertDescription, AlertTitle } from '~/shared/ui'
import { $notifications } from './model'

export const NotificationsLayout = ({ children }: PropsWithChildren) => {
  const notifications = useList($notifications, {
    getKey: (notification) => notification.id,
    fn({ type, description }, key) {
      const { Icon, title } = match(type)
        .with('success', () => ({ Icon: CheckIcon, title: 'Success!' }))
        .with('error', () => ({
          Icon: XIcon,
          title: 'Something went wrong...',
        }))
        .exhaustive()

      return (
        <Alert key={key} className="relative overflow-hidden">
          <Icon className="h-4 w-4" />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
          <div className="scale-x-0 absolute bottom-0 left-0 h-1 w-full origin-left bg-primary animate-[compress-x_5s_linear]" />
        </Alert>
      )
    },
  })

  return (
    <>
      {children}
      <div className="fixed flex flex-col gap-2 top-4 mx-auto max-w-md left-4 right-4">
        {notifications}
      </div>
    </>
  )
}
