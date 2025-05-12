import type { User } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const _user = ref<User | null>(null)

  const user = computed(() => _user.value)

  function setUser(newUser: User | null) {
    _user.value = newUser
    authInitializedResolve()
  }

  let authInitializedResolve: () => void
  const authInitialized = ref(
    new Promise<void>((resolve) => {
      authInitializedResolve = resolve
    }),
  )

  return { user, setUser, authInitialized }
})
