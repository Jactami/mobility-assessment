import type { PostgrestError } from '@supabase/supabase-js'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { supabase } from '../../src/db'
import type { Project } from '../../src/db/types'

/**
 * Validate Supabase Schema and RLS policies based on seed data.
 * Important: Reset the seed data and use it to test the RLS policies.
 *
 * https://dev.to/davepar/testing-supabase-row-level-security-4h32
 */

/** Verify row-level security error */
function rlsError(error: PostgrestError | null) {
  return error?.message.startsWith('new row violates row-level security policy') || false
}

/** Verify permission error */
function permissionError(error: PostgrestError | null) {
  return error?.message.startsWith('permission denied for') || false
}

describe('anonymous user', () => {
  it('cannot read projects', async () => {
    const { data, error } = await supabase.from('projects').select()
    expect(permissionError(error)).toBe(true)
    expect(data).toBeNull()
  })

  it('cannot modify projects', async () => {
    const { error } = await supabase.from('projects').insert({} as Project)
    expect(permissionError(error)).toBe(true)
  })
})

describe('signed in user', () => {
  beforeEach(async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: 'max@mustermann.de',
      password: 'password',
    })
    expect(error).toBeNull()
  })

  afterAll(async () => {
    const { error } = await supabase.auth.signOut()
    expect(error).toBeNull()
  })

  it('can read own projects.', async () => {
    const { data, error } = await supabase
      .from('projects')
      .select()
      .eq('id', '11111111-1111-1111-1111-111111111111')
      .maybeSingle()
    expect(error).toBeNull()
    expect(data).toBeDefined()
  })

  it('can modify own projects.', async () => {
    const { error } = await supabase
      .from('projects')
      .upsert({ id: '11111111-1111-1111-1111-111111111111' } as Project)
    expect(rlsError(error)).toBe(true)
  })

  it('cannot read projects of other users.', async () => {
    const { data, error } = await supabase
      .from('projects')
      .select()
      .eq('id', '33333333-3333-3333-3333-333333333333')
      .maybeSingle()
    expect(error).toBeNull()
    expect(data).toBeNull()
  })

  it('cannot modify projects of other users.', async () => {
    const { error } = await supabase
      .from('projects')
      .upsert({ id: '33333333-3333-3333-3333-333333333333' } as Project)
    expect(rlsError(error)).toBe(true)
  })
})
