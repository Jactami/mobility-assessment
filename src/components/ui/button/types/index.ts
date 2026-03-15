import type { Icon } from '../../icon/types'
import type { UISeverity } from '../../types'

// TODO: Add more variants, e.g. outline, soft, link, etc.?
// TODO:Create shared ui variant type
export type ButtonVariant = 'solid' | 'ghost'

// TODO: Create shared ui size type
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  variant?: ButtonVariant
  severity?: UISeverity
  icon?: Icon
  size?: ButtonSize
  type?: 'button' | 'submit' | 'reset'
  title?: string
  disabled?: boolean
  ariaLabel?: string
  class?: string // additional (tailwind) classes to apply to the button
}
