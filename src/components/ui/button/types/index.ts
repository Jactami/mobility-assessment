export type ButtonProps = {
  type?: 'button' | 'submit' | 'reset'
  title?: string
  disabled?: boolean
  tooltip?: {
    content: string
    position?: 'top' | 'right' | 'bottom' | 'left'
  }
}
