import { supabase } from '@/db'
import type { Tables, TablesInsert } from '@/db/types/supabase'
import type { PostgrestResponse } from '@supabase/supabase-js'

/**
 * Wrapper function to handle errors for database calls.
 * @param {() => Promise<PostgrestResponse<T>>} dbCall - The database call function.
 * @param {number} retries - The number of retries.
 * @param {number} delay - The delay between retries in milliseconds.
 * @returns {Promise<PostgrestResponse<T>>} - The result of the database call.
 */
async function handleDBCall<T>(
  dbCall: (...args: unknown[]) => Promise<PostgrestResponse<T>>,
  retries: number = 3,
  delay: number = 100,
): Promise<PostgrestResponse<T>> {
  const response = await dbCall()

  if (response.error) {
    console.error(`Database error. Waiting ${delay} ms before retrying.`, response.error)

    retries--
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay))
      return handleDBCall(dbCall, retries, delay)
    } else {
      // Final error handling can go here...
    }
  }

  return response
}

export default function useDB() {
  /**
   * Fetches the list of projects from the database.
   * @returns {Promise<PostgrestResponse<any>>} - Array of votes.
   */
  const getProjects = (): Promise<PostgrestResponse<Tables<'projects'>>> =>
    handleDBCall(async () => await supabase.from('projects').select())

  /**
   * Inserts or updates a project in the database.
   * @param {TablesInsert<'projects'>} project - The project to insert or update.
   * @returns {Promise<PostgrestResponse<any>>} - The inserted or updated vote.
   */
  const setProject = (
    project: TablesInsert<'projects'>,
  ): Promise<PostgrestResponse<Tables<'projects'>>> =>
    handleDBCall(async () => await supabase.from('projects').upsert(project).select())

  return {
    getProjects,
    setProject,
  }
}
