import type { Profile } from '@/db/types'
import type { User } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const _user = ref<User | null>(null)
  const _profile = ref<null | Profile>(null)

  const user = computed(() => _user.value)
  const profile = computed(() => _profile.value)

  function setUser(newUser: User | null) {
    _user.value = newUser
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
    setUser,
    profile,
    setProfile,
    authInitialized,
  }
})
