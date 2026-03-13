import type { Profile } from '@/db/types'

export interface ProfileWithPassword extends Partial<Profile> {
  password?: string
  password_confirm?: string
}
