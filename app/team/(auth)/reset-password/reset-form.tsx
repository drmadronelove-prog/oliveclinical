'use client'

import { useActionState } from 'react'
import { requestPasswordReset, type AuthFormState } from '../login/actions'
import { Field, SubmitButton, FormMessage } from '@/components/team/form-controls'

export function ResetForm() {
  const [state, action] = useActionState<AuthFormState, FormData>(requestPasswordReset, {})

  return (
    <form action={action} className="space-y-4">
      <Field label="Email" name="email" type="email" autoComplete="email" />
      <FormMessage error={state.error} success={state.success} />
      <SubmitButton pendingLabel="Sending…">Send reset link</SubmitButton>
    </form>
  )
}
