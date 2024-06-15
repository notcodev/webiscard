import {
  ButtonHTMLAttributes,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger, Title } from '~/shared/ui'
import { pageUnmounted } from './shared/config'
import { BackgroundTab } from './widgets/background-tab'
import { ButtonsTab } from './widgets/buttons-tab'
import { PreviewCard } from './widgets/preview-card'
import { ProfileTab } from './widgets/profile-tab'

const Header = () => {
  return (
    <div className="flex items-center">
      <Title order={4}>Page editor</Title>
    </div>
  )
}

const EditorTabs = () => {
  return (
    <Tabs defaultValue="profile" className="mt-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="buttons">Buttons</TabsTrigger>
        <TabsTrigger value="background">Background</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <ProfileTab />
      </TabsContent>
      <TabsContent value="buttons">
        <ButtonsTab />
      </TabsContent>
      <TabsContent value="background">
        <BackgroundTab />
      </TabsContent>
    </Tabs>
  )
}

const SideBar = () => {
  return (
    <div className="left-0 top-0 bottom-0 fixed flex md:border-r bg-background flex-col w-full md:w-[384px] p-6 h-full overflow-scroll">
      <Header />
      <EditorTabs />
    </div>
  )
}

interface DisclosureButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  opened: boolean
}

const DisclosureButton = ({ opened, ...props }: DisclosureButtonProps) => {
  const config = !opened
    ? {
        className:
          'bg-black bg-opacity-[35%] hover:bg-opacity-[45%] transition duration-300',
        text: 'Edit',
      }
    : {
        className: 'bg-primary hover:bg-primary/90',
        text: 'Preview',
      }

  return (
    <button
      className={
        'md:hidden inline-flex items-center h-10 fixed bottom-2 left-2 right-2 justify-center text-white font-medium rounded-lg ' +
        config.className
      }
      {...props}
    >
      {config.text}
    </button>
  )
}

const DisclosureContainer = ({ children }: PropsWithChildren) => {
  const [hidden, setHidden] = useState(false)

  return (
    <>
      <div className="aria-hidden:hidden md:!block" aria-hidden={hidden}>
        {children}
      </div>
      <DisclosureButton
        opened={!hidden}
        onClick={() => setHidden((prev) => !prev)}
      />
    </>
  )
}

export const EditorPage = () => {
  useEffect(() => pageUnmounted, [])

  return (
    <main>
      <div className="md:pl-[384px]">
        <PreviewCard />
      </div>
      <DisclosureContainer>
        <SideBar />
      </DisclosureContainer>
    </main>
  )
}
