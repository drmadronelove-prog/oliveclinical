import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runMutation } from '@/lib/team/run-mutation'

const toastError = vi.fn()
vi.mock('sonner', () => ({
  toast: { error: (...args: unknown[]) => toastError(...args) },
}))

beforeEach(() => {
  toastError.mockClear()
})

describe('runMutation', () => {
  it('calls onSuccess and never rolls back when the action succeeds', async () => {
    const rollback = vi.fn()
    const onSuccess = vi.fn()

    await runMutation(async () => ({ ok: true as const, data: { id: '1' } }), rollback, onSuccess)

    expect(onSuccess).toHaveBeenCalledWith({ id: '1' })
    expect(rollback).not.toHaveBeenCalled()
    expect(toastError).not.toHaveBeenCalled()
  })

  it('rolls back and shows the error when the action returns ok: false', async () => {
    const rollback = vi.fn()

    await runMutation(async () => ({ ok: false as const, error: 'Nope.' }), rollback)

    expect(rollback).toHaveBeenCalledOnce()
    expect(toastError).toHaveBeenCalledWith('Nope.')
  })

  // The bug this exists to fix: a server action called directly from a
  // client event handler (never through a <form>) can reject outright —
  // an expired session, a dropped request — rather than ever returning
  // { ok: false }. Before this helper, nothing downstream had a .catch(),
  // so the optimistic UI just stayed as it was: it looked saved until the
  // next full reload silently reverted it.
  it('rolls back and shows an error when the action throws', async () => {
    const rollback = vi.fn()

    await runMutation(async () => {
      throw new Error('Network blip.')
    }, rollback)

    expect(rollback).toHaveBeenCalledOnce()
    expect(toastError).toHaveBeenCalledWith('Network blip.')
  })

  it('shows a generic message when the thrown value has no message', async () => {
    const rollback = vi.fn()

    await runMutation(async () => {
      throw 'not an Error instance'
    }, rollback)

    expect(rollback).toHaveBeenCalledOnce()
    expect(toastError).toHaveBeenCalledWith("Couldn't save that change. Try again.")
  })

  // redirect() inside a server action (requireProfile(), session really
  // gone) throws a special Next.js error — that must keep propagating
  // so Next's own handling can act on it, not get swallowed into a
  // confusing error toast instead of actually signing the person out.
  it('re-throws a Next.js redirect error instead of rolling back or toasting', async () => {
    const rollback = vi.fn()
    const redirectError = { digest: 'NEXT_REDIRECT;replace;/team/login;307;' }

    await expect(
      runMutation(async () => {
        throw redirectError
      }, rollback),
    ).rejects.toBe(redirectError)

    expect(rollback).not.toHaveBeenCalled()
    expect(toastError).not.toHaveBeenCalled()
  })
})
