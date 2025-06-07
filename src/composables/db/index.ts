import { supabase } from '@/db'
import type { Tables, TablesInsert } from '@/db/types/supabase'
import type { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js'

/**
 * Wrapper function to handle errors for database calls.
 * @param {() => Promise<PostgrestResponse<T> | PostgrestSingleResponse<T>>} dbCall - The database call function.
 * @param {number} retries - The number of retries.
 * @param {number} delay - The delay between retries in milliseconds.
 * @returns {Promise<PostgrestResponse<T> | PostgrestSingleResponse<T>>} - The result of the database call.
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
  let attempt = 0

  while (attempt < retries) {
    const response = await dbCall()

    if (!response.error) {
      return response
    }

    attempt++
    if (attempt < retries) {
      console.error(`Database error. Waiting ${delay} ms before retrying.`, response.error)
      await new Promise((resolve) => setTimeout(resolve, delay))
    } else {
      console.error(`Final database error after ${retries} attempts.`, response.error)
      return response
    }
  }

  throw new Error('Unexpected error in database call.')
}

export default function useDB() {
  /**
   * Fetches the list of projects from the database.
   * @returns {Promise<PostgrestResponse<any>>} - Array of projects.
   */
  const getProjects = (): Promise<PostgrestResponse<Tables<'projects'>>> =>
    handleDBCall(async () => await supabase.from('projects').select())

  /**
   * Fetches a project from the database.
   * @param {string} id - The ID of the project to fetch.
   * @returns {Promise<PostgrestSingleResponse<any>>} - The project with the specified ID.
   */
  const getProject = (id: string): Promise<PostgrestSingleResponse<Tables<'projects'> | null>> =>
    handleDBCall(async () => await supabase.from('projects').select().eq('id', id).maybeSingle())

  /**
   * Inserts or updates a project in the database.
   * @param {TablesInsert<'projects'>} project - The project to insert or update.
   * @returns {Promise<PostgrestResponse<any>>} - The inserted or updated project.
   */
  const setProject = (
    project: TablesInsert<'projects'>,
  ): Promise<PostgrestSingleResponse<Tables<'projects'> | null>> =>
    handleDBCall(async () => await supabase.from('projects').upsert(project).select().maybeSingle())

  /**
   * Fetches the list of Points of Interest (POIs) for a specific project.
   *
   * @param {string} projectId - The ID of the project to fetch POIs for.
   * @returns {Promise<PostgrestResponse<Tables<'pois'>>>} - The list of POIs for the specified project.
   */
  const getPois = (projectId: string): Promise<PostgrestResponse<Tables<'pois'>>> =>
    handleDBCall(async () => await supabase.from('pois').select().eq('project_id', projectId))

  /**
   * Inserts or updates Points of Interest (POIs) in the database.
   *
   * @param {TablesInsert<'pois'>[]} pois - The list of POIs to insert or update.
   * @returns {Promise<PostgrestResponse<Tables<'pois'>>>} - The inserted or updated POIs.
   */
  const setPois = (pois: TablesInsert<'pois'>[]): Promise<PostgrestResponse<Tables<'pois'>>> =>
    handleDBCall(async () => await supabase.from('pois').upsert(pois).select())

  return {
    getProjects,
    getProject,
    setProject,
    getPois,
    setPois,
  }
}
