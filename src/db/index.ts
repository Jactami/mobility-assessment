import { useAuthStore } from '@/stores/Auth'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

/**
 * Auth event listener to update and set initial auth data.
 * This will be triggered on page load and when the user logs in or out.
 * It mitigates the need to have a persistent pinia store for auth data.
 */
supabase.auth.onAuthStateChange((_, session) => {
  useAuthStore().setUser(session?.user || null)
})
