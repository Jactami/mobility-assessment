// https://vueschool.io/articles/vuejs-tutorials/use-supabase-auth-with-vue-js-3/

import { supabase } from '@/db'

export function useAuthService() {
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

  // TODO: Add signOut function

  return { signIn }
}
