import type { Tables, TablesInsert } from './supabase'

export type Profile = Tables<'profiles'>
export type Project = Tables<'projects'>
export type Poi = TablesInsert<'pois'>
