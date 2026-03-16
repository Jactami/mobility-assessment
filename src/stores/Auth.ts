import type { Profile, UserRole } from '@/db/types'
import type { Session, User } from '@supabase/supabase-js'
import { jwtDecode } from 'jwt-decode'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const _user = ref<User | null>(null)
  const _profile = ref<null | Profile>(null)
  const _role = ref<UserRole | null>(null)

  const user = computed(() => _user.value)
  const profile = computed(() => _profile.value)
  const role = computed(() => _role.value)

  const isExpired = computed(() => {
    if (!profile.value?.expires_at) return false

    const now = new Date()
    return (
      new Date(profile.value.expires_at) <
      new Date(now.getFullYear(), now.getMonth(), now.getDate())
    )
  })

  const isBlocked = computed(() => {
    if (!profile.value) return false
    return profile.value.is_disabled || isExpired.value
  })

  function setSession(session: Session | null) {
    if (session) {
      _user.value = session.user
      const jwt = jwtDecode<{ user_role: UserRole }>(session.access_token)
      _role.value = jwt.user_role
    } else {
      _user.value = null
      _role.value = null
    }
    authInitializedResolve()
  }

  function setProfile(newProfile: Profile | null) {
    _profile.value = newProfile
  }

  let authInitializedResolve: () => void
  const authInitialized = ref(
    new Promise<void>((resolve) => {
      authInitializedResolve = resolve
    }),
  )

  return {
    user,
    setSession,
    profile,
    setProfile,
    role,
    isExpired,
    isBlocked,
    authInitialized,
  }
})
