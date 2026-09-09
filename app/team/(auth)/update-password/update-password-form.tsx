'use client'

import { useActionState } from 'react'
import { updatePassword, type AuthFormState } from '../login/actions'
import { Field, SubmitButton, FormMessage } from '@/components/team/form-controls'

export function UpdatePasswordForm() {
  const [state, action] = useActionState<AuthFormState, FormData>(updatePassword, {})

  return (
    <form action={action} className="space-y-4">
      <Field
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        hint="At least 10 characters."
      />
      <Field label="Confirm password" name="confirm" type="password" autoComplete="new-password" />
      <FormMessage error={state.error} />
      <SubmitButton pendingLabel="Saving…">Save password and continue</SubmitButton>
    </form>
  )
}
