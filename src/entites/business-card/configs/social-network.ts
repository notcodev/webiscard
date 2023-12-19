import { FC, HTMLInputTypeAttribute, SVGAttributes } from 'react'
import Behance from '~/assets/social-networks/behance.svg?react'
import Dribbble from '~/assets/social-networks/dribbble.svg?react'
import Email from '~/assets/social-networks/email.svg?react'
import Facebook from '~/assets/social-networks/facebook.svg?react'
import GitHub from '~/assets/social-networks/github.svg?react'
import Instagram from '~/assets/social-networks/instagram.svg?react'
import LinkedIn from '~/assets/social-networks/linkedin.svg?react'
import Messenger from '~/assets/social-networks/messenger.svg?react'
import OK from '~/assets/social-networks/odnoklassniki.svg?react'
import Skype from '~/assets/social-networks/skype.svg?react'
import Snapchat from '~/assets/social-networks/snapchat.svg?react'
import Telegram from '~/assets/social-networks/telegram.svg?react'
import Telephone from '~/assets/social-networks/telephone.svg?react'
import TwitterX from '~/assets/social-networks/twitterx.svg?react'
import Viber from '~/assets/social-networks/viber.svg?react'
import VK from '~/assets/social-networks/vk.svg?react'
import WhatsApp from '~/assets/social-networks/whatsapp.svg?react'
import YouTube from '~/assets/social-networks/youtube.svg?react'
import { SocialNetwork } from '~/shared/api'

export interface SocialNetworkConfig {
  name: string
  icon: FC<SVGAttributes<SVGElement>>
  gradient: string
  input: {
    type: HTMLInputTypeAttribute
    placeholder: string
    hint?: string
    prefix?: string
  }
  getLink: (value: string) => string
}

const telephonePlaceholder = 'Enter a phone number'
const telephoneHint = 'For example: +79212345678'

const usernamePlaceholder = 'Enter your username'

export const socialNetworkConfig: Record<SocialNetwork, SocialNetworkConfig> = {
  [SocialNetwork.MESSENGER]: {
    name: 'Messenger',
    icon: Messenger,
    gradient: 'linear-gradient(180deg,#79d1ff,#43a5ff)',
    input: {
      type: 'text',
      placeholder: usernamePlaceholder,
      prefix: 'm.me/',
    },
    getLink(value: string) {
      return `https://m.me/${value}`
    },
  },
  [SocialNetwork.WHATSAPP]: {
    name: 'WhatsApp',
    icon: WhatsApp,
    gradient: 'linear-gradient(180deg,#00d100,#00a500)',
    input: {
      type: 'tel',
      placeholder: telephonePlaceholder,
      hint: telephoneHint,
    },
    getLink(value: string) {
      const phone = value.replace('+', '')

      return `https://api.whatsapp.com/send/?phone=${phone}&text&type=phone_number&app_absent=0`
    },
  },
  [SocialNetwork.VKONTAKTE]: {
    name: 'VKontakte',
    icon: VK,
    gradient: 'linear-gradient(180deg,#659de1,#45668e)',
    input: {
      type: 'text',
      placeholder: usernamePlaceholder,
      prefix: 'vk.com/',
    },
    getLink(value: string) {
      return `https://vk.com/${value}`
    },
  },
  [SocialNetwork.VIBER]: {
    name: 'Viber',
    icon: Viber,
    gradient: 'linear-gradient(180deg,#b389cb,#7c519b)',
    input: {
      type: 'tel',
      placeholder: telephonePlaceholder,
      hint: telephoneHint,
    },
    getLink(value: string) {
      const phone = value.replace('+', '%2B')

      return `viber://contact?number=${phone}`
    },
  },
  [SocialNetwork.OK]: {
    name: 'OK',
    icon: OK,
    gradient: 'linear-gradient(180deg,#ffb74e,#f99400)',
    input: {
      type: 'text',
      placeholder: usernamePlaceholder,
      prefix: 'ok.ru/',
    },
    getLink(value: string) {
      return `https://ok.ru/${value}`
    },
  },
  [SocialNetwork.SKYPE]: {
    name: 'Skype',
    icon: Skype,
    gradient: 'linear-gradient(180deg,#60d4ff,#00aff0)',
    input: {
      type: 'text',
      placeholder: usernamePlaceholder,
    },
    getLink(value: string) {
      return `skype:${value}?chat`
    },
  },
  [SocialNetwork.TELEGRAM]: {
    name: 'Telegram',
    icon: Telegram,
    gradient: 'linear-gradient(180deg,#5ad0fe,#139bd0)',
    input: {
      type: 'text',
      placeholder: usernamePlaceholder,
      prefix: 't.me/',
    },
    getLink(value: string) {
      return `https://t.me/${value}`
    },
  },
  [SocialNetwork.INSTAGRAM]: {
    name: 'Instagram',
    icon: Instagram,
    gradient: 'linear-gradient(180deg,#f39750,#ec3975)',
    input: {
      type: 'text',
      placeholder: usernamePlaceholder,
    },
    getLink(value: string) {
      return `https://instagram.com/${value}`
    },
  },
  [SocialNetwork.X]: {
    name: 'X',
    icon: TwitterX,
    gradient: 'linear-gradient(180deg,#454d53,#24292d)',
    input: {
      type: 'text',
      placeholder: usernamePlaceholder,
      prefix: 'x.com/',
    },
    getLink(value: string) {
      return `https://x.com/${value}`
    },
  },
  [SocialNetwork.EMAIL]: {
    name: 'Email',
    icon: Email,
    gradient: 'linear-gradient(180deg,#689bff,#4a88ff)',
    input: {
      type: 'email',
      placeholder: 'Enter your email address',
    },
    getLink(value: string) {
      return `mailto:${value}`
    },
  },
  [SocialNetwork.FACEBOOK]: {
    name: 'Facebook',
    icon: Facebook,
    gradient: 'linear-gradient(180deg,#789ef6,#5170b7)',
    input: {
      type: 'text',
      placeholder: usernamePlaceholder,
      prefix: 'fb.me/',
    },
    getLink(value: string) {
      return `https://fb.me/${value}`
    },
  },
  [SocialNetwork.TELEPHONE]: {
    name: 'Telephone',
    icon: Telephone,
    gradient: 'linear-gradient(180deg,#17e48a,#06bb6c)',
    input: {
      type: 'tel',
      placeholder: telephonePlaceholder,
      hint: telephoneHint,
    },
    getLink(value: string) {
      return `tel:${value}`
    },
  },
  [SocialNetwork.YOUTUBE]: {
    name: 'YouTube',
    icon: YouTube,
    gradient: 'linear-gradient(0deg,#ce1312,#ff6d6c)',
    input: {
      type: 'text',
      placeholder: usernamePlaceholder,
      prefix: 'youtube.com/',
    },
    getLink(value: string) {
      return `https://youtube.com/${value}`
    },
  },
  [SocialNetwork.BEHANCE]: {
    name: 'Behance',
    icon: Behance,
    gradient: 'linear-gradient(180deg,#33a2ff,#1769ff)',
    input: {
      type: 'text',
      placeholder: usernamePlaceholder,
    },
    getLink(value: string) {
      return `https://www.behance.net/${value}`
    },
  },
  [SocialNetwork.SNAPCHAT]: {
    name: 'Snapchat',
    icon: Snapchat,
    gradient: 'linear-gradient(180deg,#ffe931,#f1d807)',
    input: {
      type: 'text',
      placeholder: usernamePlaceholder,
      prefix: 'snapchat.com/add/',
    },
    getLink(value: string) {
      return `https://snapchat.com/add/${value}`
    },
  },
  [SocialNetwork.DRIBBBLE]: {
    name: 'Dribbble',
    icon: Dribbble,
    gradient: 'linear-gradient(180deg,#f07ca9,#ec4a89)',
    input: {
      type: 'text',
      placeholder: usernamePlaceholder,
    },
    getLink(value: string) {
      return `https://dribbble.com/${value}`
    },
  },
  [SocialNetwork.LINKEDIN]: {
    name: 'LinkedIn',
    icon: LinkedIn,
    gradient: 'linear-gradient(0deg,#007ebb,#25b1f5)',
    input: {
      type: 'text',
      placeholder: usernamePlaceholder,
      prefix: 'linkedin.com/user/',
    },
    getLink(value: string) {
      return `https://linkedin.com/user/${value}`
    },
  },
  [SocialNetwork.GITHUB]: {
    name: 'GitHub',
    icon: GitHub,
    gradient: 'linear-gradient(180deg,#454d53,#24292d)',
    input: {
      type: 'text',
      placeholder: usernamePlaceholder,
    },
    getLink(value: string) {
      return `https://github.com/${value}`
    },
  },
}
