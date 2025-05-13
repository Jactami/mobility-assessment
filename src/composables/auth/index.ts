// https://vueschool.io/articles/vuejs-tutorials/use-supabase-auth-with-vue-js-3/

import { supabase } from '@/db'
import { useAuthStore } from '@/stores/Auth'

let initialized = false

export function useAuthService() {
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
    supabase.auth.onAuthStateChange((_, session) => {
      useAuthStore().setUser(session?.user || null)
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

  return { init, signIn, signOut }
}
