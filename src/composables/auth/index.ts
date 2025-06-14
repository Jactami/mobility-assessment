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
      console.log('Auth state changed:', session?.access_token)
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
    const response = await supabase.auth.signInWithPassword({ email, password })
    return response
  }

  /**
   * Sign a user out.
   *
   * @throws {Error} - If the sign-out fails.
   */
  async function signOut() {
    const response = await supabase.auth.signOut()
    return response
  }

  /**
   * Update the user's email and/or password.
   *
   * @param password - The new password for the user (optional).
   * @param email - The new email for the user (optional).
   * @returns - The response from the update operation.
   */
  async function updateUser(email?: string, password?: string) {
    const response = await supabase.auth.updateUser({
      email,
      password,
    })
    return response
  }

  /**
   * Load the user's profile data.
   *
   * @throws {Error} - If loading the profile fails.
   */
  async function loadProfile(userId: string) {
    const response = await supabase.from('profiles').select().eq('id', userId).single()
    authStore.setProfile(response.data)
    return response
  }

  return {
    init,
    signIn,
    signOut,
    updateUser,
  }
}
