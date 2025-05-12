import type { User } from '@supabase/supabase-js'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const _user = ref<User | null>(null)

  const user = computed(() => _user.value)

  function setUser(newUser: User | null) {
    _user.value = newUser
  }

  return { user, setUser }
})
