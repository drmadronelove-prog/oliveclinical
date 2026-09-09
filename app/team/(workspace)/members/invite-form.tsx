'use client'

import { useActionState, useEffect, useRef } from 'react'
import { inviteMember, type MembersFormState } from './actions'
import { Field, SubmitButton, FormMessage } from '@/components/team/form-controls'

export function InviteForm() {
  const [state, action] = useActionState<MembersFormState, FormData>(inviteMember, {})
  const formRef = useRef<HTMLFormElement>(null)

  // Clear the fields after a successful send so the next invite is quick.
  useEffect(() => {
    if (state.success) formRef.current?.reset()
  }, [state.success])

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="off"
        placeholder="name@example.com"
      />
      <Field
        label="Name"
        name="name"
        required={false}
        autoComplete="off"
        hint="Optional. They can change it themselves later."
      />
      <div className="space-y-1.5">
        <label htmlFor="role" className="block text-sm font-medium">
          Role
        </label>
        <select
          id="role"
          name="role"
          defaultValue="member"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
        >
          <option value="member">Member — can see and do everything except manage people</option>
          <option value="admin">Admin — can also invite and remove people</option>
        </select>
      </div>
      <FormMessage error={state.error} success={state.success} />
      <SubmitButton pendingLabel="Sending invitation…">Send invitation</SubmitButton>
    </form>
  )
}
