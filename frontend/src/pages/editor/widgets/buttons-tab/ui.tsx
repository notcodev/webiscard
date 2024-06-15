import { useList } from 'effector-react'
import { socialNetworkConfig } from '~/entites/business-card'
import { Button, Label, PrefixInput } from '~/shared/ui'
import { SocialNetworkIcon } from '../../entities/social-network-icon'
import * as socialNetworks from '../../features/social-networks'
import { AddDialog, EditDialog } from '../../features/social-networks'

export const ButtonsTab = () => {
  const buttons = useList(socialNetworks.$buttonsList, {
    getKey: (item) => item.id,
    fn: (button, key) => {
      const config = socialNetworkConfig[button.type]

      return (
        <div key={key} className="flex gap-2">
          <SocialNetworkIcon icon={config.icon} gradient={config.gradient} />
          <PrefixInput
            type={config.input.type}
            value={button.value}
            disabled
            prefix={config.input.prefix}
          />
          <EditDialog
            dialogTrigger={<Button>Edit</Button>}
            {...config}
            {...button}
          />
        </div>
      )
    },
  })

  return (
    <div className="mt-8 flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Label>Social networks and messengers</Label>
        {buttons}
        <AddDialog dialogTrigger={<Button size="lg">+ Add button</Button>} />
      </div>
    </div>
  )
}
