import { useEffect } from 'react'
import { ThemeToggle } from '~/shared/theme'
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

export const EditorPage = () => {
  useEffect(() => pageUnmounted, [])

  return (
    <main>
      <div className="md:pl-[384px]">
        <PreviewCard />
      </div>
      <div className="hidden left-0 top-0 bottom-0 fixed md:flex md:border-r bg-background flex-col w-full md:w-[384px] p-6 h-full overflow-scroll">
        <Header />
        <EditorTabs />
      </div>
      <div className="fixed right-3 bottom-3">
        <ThemeToggle variant="secondary" />
      </div>
    </main>
  )
}
