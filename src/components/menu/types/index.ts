import type { Icon } from '@/components/icon/types'

export type MenuItem = {
  label: string
  icon: Icon
  link?: string
  action?: () => void
  disabled?: boolean
  divider?: boolean
}

export type Menu = MenuItem[]
