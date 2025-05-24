// https://vueschool.io/articles/vuejs-tutorials/use-supabase-auth-with-vue-js-3/

import { supabase } from '@/db'
import { useAuthStore } from '@/stores/Auth'

let initialized = false

export function useAuthService() {
  const authStore = useAuthStore()

  /**
   * Initialize the auth service.
   * This function sets up an event listener for authentication state changes.
   * It updates the auth store with the current user session.
   */
  function init() {
    // Prevent multiple initializations
    if (initialized) return

    initialized = true
    // Set up an event listener for authentication state changes
    supabase.auth.onAuthStateChange(async (_, session) => {
      if (session) {
        // user is signed in
        loadProfile(session.user.id)
        authStore.setUser(session.user)
      } else {
        // user is signed out
        authStore.setProfile(null)
        authStore.setUser(null)
      }
    })
  }

  /**
   * Sign a user in with email and password.
   *
   * @param email - The user's email address.
   * @param password - The user's password.
   * @throws {Error} If the sign-in fails.
   * @returns - The sign-in data.
   */
  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  /**
   * Sign a user out.
   *
   * @throws {Error} - If the sign-out fails.
   */
  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  /**
   * Load the user's profile data.
   *
   * @throws {Error} - If loading the profile fails.
   */
  async function loadProfile(userId: string) {
    const { data, error } = await supabase.from('profiles').select().eq('id', userId).single()
    if (error) throw error
    authStore.setProfile(data)
  }

  return {
    init,
    signIn,
    signOut,
  }
}
