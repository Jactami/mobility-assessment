import type { Enums, Tables, TablesInsert } from './supabase'

export type Profile = Tables<'profiles'>
export type Project = Tables<'projects'>

// manually overwrite footway type because supabase code gen can't handle nested arrays
// TODO: not happy with this solution; check if there's a better way
export type Poi = Omit<TablesInsert<'pois'>, 'footway'> & {
  footway?: number[][]
}

export type UserRole = Enums<'user_role'>
