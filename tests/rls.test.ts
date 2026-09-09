import { describe, it, expect } from 'vitest'
import { createClient } from '@supabase/supabase-js'

/**
 * Proves the database itself refuses strangers.
 *
 * Everything else in this app — the middleware, the requireProfile guard,
 * the hidden nav links — is application code, and application code can
 * have bugs. Row-level security is the layer underneath: even holding the
 * public anon key and talking straight to the database with no session,
 * a stranger must come away with nothing.
 *
 * This test needs a real Supabase project. Until one is connected it
 * reports as skipped rather than as passing, so an unconfigured setup can
 * never look like a verified one.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const configured = Boolean(url && anonKey)

describe.skipIf(!configured)('row-level security, with no session', () => {
  const anonymous = () =>
    createClient(url!, anonKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

  it('cannot read any profile', async () => {
    const { data, error } = await anonymous().from('profiles').select('*')
    // Either an outright refusal or an empty set is correct. A row is not.
    expect(error ?? data).not.toBeNull()
    expect(data ?? []).toHaveLength(0)
  })

  it('cannot count profiles', async () => {
    const { count } = await anonymous()
      .from('profiles')
      .select('*', { count: 'exact', head: true })
    expect(count ?? 0).toBe(0)
  })

  it('cannot create a profile for itself', async () => {
    const { error } = await anonymous()
      .from('profiles')
      .insert({ id: crypto.randomUUID(), email: 'intruder@example.com', role: 'admin' })
    expect(error).not.toBeNull()
  })

  it('cannot promote anyone to admin', async () => {
    const { data, error } = await anonymous()
      .from('profiles')
      .update({ role: 'admin' })
      .neq('email', '')
      .select()
    expect(error ?? (data ?? []).length === 0).toBeTruthy()
  })

  it('cannot delete a profile', async () => {
    const { data, error } = await anonymous()
      .from('profiles')
      .delete()
      .neq('email', '')
      .select()
    expect(error ?? (data ?? []).length === 0).toBeTruthy()
  })
})

describe.skipIf(configured)('row-level security (skipped)', () => {
  it('needs a Supabase project before it can run — see PHASE-1.md', () => {
    expect(configured).toBe(false)
  })
})
