import type { Icon } from '../../icon/types'

// add more variants, e.g. outline, soft, link, etc.?
export type ButtonVariant = 'solid' | 'ghost'

// add more severities, e.g. secondary, success, warning, info, etc.?
export type ButtonSeverity = 'primary' | 'neutral' | 'danger'

export interface ButtonProps {
  variant?: ButtonVariant
  severity?: ButtonSeverity
  icon?: Icon
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  title?: string
  disabled?: boolean
  ariaLabel?: string
  class?: string // additional (tailwind) classes to apply to the button
}
