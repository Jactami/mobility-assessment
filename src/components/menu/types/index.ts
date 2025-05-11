export type MenuItem = {
  label: string
  icon: string
  link?: string
  action?: () => void
  disabled?: boolean
  divider?: boolean
}

export type Menu = MenuItem[]
