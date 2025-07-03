import type { Icon } from '@/components/icon/types'

export type MenuActionItem = {
  label: string
  icon: Icon
  link?: string
  action?: () => void
  disabled?: boolean
  divider?: boolean
}
