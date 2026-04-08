import { supabase } from '@/db'
import type { Tables, TablesInsert } from '@/db/types/supabase'
import {
  PostgrestError,
  type PostgrestResponse,
  type PostgrestSingleResponse,
} from '@supabase/supabase-js'

/**
 * Wrapper function to handle errors for database calls.
 * @param dbCall The database call function.
 * @param retries The number of retries.
 * @param delay The delay between retries in milliseconds.
 * @returns The result of the database call.
 */

// Overload #1: for array responses (e.g. .select())
function handleDBCall<T>(
  dbCall: () => Promise<PostgrestResponse<T[]>>,
  retries?: number,
  delay?: number,
): Promise<PostgrestResponse<T[]>>

// Overload #2: for single record responses (e.g. .single())
function handleDBCall<T>(
  dbCall: () => Promise<PostgrestSingleResponse<T>>,
  retries?: number,
  delay?: number,
): Promise<PostgrestSingleResponse<T>>

async function handleDBCall<T>(
  dbCall: () => Promise<PostgrestResponse<T[]> | PostgrestSingleResponse<T>>,
  retries = 3,
  delay = 100,
): Promise<PostgrestResponse<T[]> | PostgrestSingleResponse<T>> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Make database call
      const response = await dbCall()

      // Check for errors
      if (!response.error) {
        return response
      } else {
        throw response.error
      }
    } catch (e) {
      // Log error
      console.error(`Database call failed (attempt ${attempt}/${retries}).`, e)

      if (attempt === retries) {
        // Log final error
        console.error(`Final database call failed after ${retries} attempts.`)
      } else {
        // Retry db call after delay
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  // Return a fake PostgrestError response
  return {
    data: null,
    success: false,
    error: new PostgrestError({ message: 'Unknown error.', details: '', hint: '', code: '500' }),
    count: null,
    status: 500,
    statusText: 'Internal Error',
  }
}

/**
 * Replaces undefined values in an object with null.
 * This is useful to ensure that undefined values are deleted when inserting into the database.
 *
 * @param obj The object to process.
 * @return The processed object with undefined values replaced by null.
 */
function undefinedToNull<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === undefined ? null : v]),
  ) as T
}

export default function useDB() {
  /**
   * Fetches the list of projects from the database.
   *
   * @returns The list of projects ordered by creation date.
   */
  const getProjects = (): Promise<PostgrestResponse<Tables<'projects'>>> =>
    handleDBCall(async () => await supabase.from('projects').select().order('created_at'))

  /**
   * Fetches a project from the database.
   *
   * @param id The ID of the project to fetch.
   * @returns The project with the specified ID, or null if not found.
   */
  const getProject = (id: string): Promise<PostgrestSingleResponse<Tables<'projects'> | null>> =>
    handleDBCall(async () => await supabase.from('projects').select().eq('id', id).maybeSingle())

  /**
   * Inserts or updates a project in the database.
   *
   * @param project The project to insert or update.
   * @returns The inserted or updated project.
   */
  const setProject = (
    project: TablesInsert<'projects'>,
  ): Promise<PostgrestSingleResponse<Tables<'projects'> | null>> =>
    handleDBCall(async () => {
      // Set id explicitly to undefined for new projects to make insert
      const _project = { ...undefinedToNull(project), id: project.id || undefined }
      // Upsert project data
      return await supabase.from('projects').upsert(_project).select().maybeSingle()
    })

  /**
   * Deletes a project from the database.
   *
   * @param id The ID of the project to delete.
   * @returns The deleted project.
   */
  const deleteProject = (id: string): Promise<PostgrestSingleResponse<Tables<'projects'> | null>> =>
    handleDBCall(
      async () => await supabase.from('projects').delete().eq('id', id).select().maybeSingle(),
    )

  /**
   * Fetches the list of Points of Interest (POIs) for a specific project.
   *
   * @param projectId The ID of the project to fetch POIs for.
   * @returns The list of POIs for the specified project ordered by distance.
   */
  const getPois = (projectId: string): Promise<PostgrestResponse<Tables<'pois'>>> =>
    handleDBCall(
      async () =>
        await supabase.from('pois').select().eq('project_id', projectId).order('distance'),
    )

  /**
   * Inserts or updates Points of Interest (POIs) in the database.
   *
   * @param pois The list of POIs to insert or update.
   * @returns The inserted or updated POIs.
   */
  const setPois = (pois: TablesInsert<'pois'>[]): Promise<PostgrestResponse<Tables<'pois'>>> => {
    // Set id explicitly to undefined for new POIs to make insert
    const _pois = pois.map((poi) => ({ ...undefinedToNull(poi), id: poi.id || undefined }))
    // Upsert POI data
    return handleDBCall(
      async () => await supabase.from('pois').upsert(_pois, { defaultToNull: false }).select(),
    )
  }

  /**
   * Deletes all Points of Interest (POIs) for a specific project.
   *
   * @param projectId The ID of the project to delete POIs for.
   * @returns The list of deleted POIs.
   */
  const deletePois = (projectId: string): Promise<PostgrestResponse<Tables<'pois'>>> =>
    handleDBCall(
      async () => await supabase.from('pois').delete().eq('project_id', projectId).select(),
    )

  /**
   * Fetches the list of user profiles from the database.
   *
   * @returns The list of user profiles ordered by last name.
   */
  const getProfiles = (): Promise<PostgrestResponse<Tables<'profiles'>>> =>
    handleDBCall(
      async () =>
        // await supabase.from('profiles').select().neq('user_role', 'admin').order('last_name'),
        await supabase.from('profiles').select().order('last_name'),
    )

  /**
   * Creates a new user profile in the database or updates an existing user.
   *
   * @param user The user object containing the user details.
   * @returns The inserted or updated user profile.
   */
  const setUser = (user: {
    id?: string
    firstName: string
    lastName: string
    email: string
    expiresAt?: Date
    isDisabled?: boolean
    password?: string
  }) =>
    handleDBCall(async () => {
      if (user.id) {
        // Update existing user
        return await supabase.rpc('update_user', {
          target_user_id: user.id,
          new_first_name: user.firstName,
          new_last_name: user.lastName,
          new_email: user.email,
          new_expires_at: user.expiresAt?.toISOString(),
          new_is_disabled: user.isDisabled,
          new_password: user.password,
        })
      } else if (user.password) {
        // Create new user
        return await supabase.rpc('create_user', {
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          password: user.password,
        })
      }

      // Neither id nor password provided -> cannot create or update user.
      throw new Error('Invalid user data: either id or password must be provided.')
    })

  /**
   * Deletes a user profile from the database.
   *
   * @param id The ID of the user to delete.
   * @returns The deleted user profile
   */
  const deleteUser = (id: string): Promise<PostgrestSingleResponse<Tables<'profiles'> | null>> =>
    handleDBCall(async () => await supabase.rpc('delete_user', { target_user_id: id }))

  return {
    getProjects,
    getProject,
    setProject,
    deleteProject,
    getPois,
    setPois,
    deletePois,
    getProfiles,
    setUser,
    deleteUser,
  }
}
