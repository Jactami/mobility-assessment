import type { Icon } from '../../icon/types'

export type MenuListItem = {
  label: string
  icon: Icon
  link?: string
  action?: () => void
  disabled?: boolean
  divider?: boolean
}
