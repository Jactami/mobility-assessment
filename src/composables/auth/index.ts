import { supabase } from '@/db'
import { useAuthStore } from '@/stores/Auth'

/**
 * Auth event listener to update and set initial auth data.
 * This will be triggered on page load and when the user logs in or out.
 * It mitigates the need to have a persistent pinia store for auth data.
 */
supabase.auth.onAuthStateChange((_, session) => {
  useAuthStore().setUser(session?.user || null)
})

export function useAuthService() {
  /**
   * Authenticates and logs in a user with the given email and password.
   *
   * @param {string} email - Email address of the user.
   * @param {string} password - User's password.
   * @throws {AuthError} - Throws an error if the sign-in fails.
   */
  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    useAuthStore().setUser(data.user)
  }

  // TODO: Add signOut function

  return { signIn }
}
