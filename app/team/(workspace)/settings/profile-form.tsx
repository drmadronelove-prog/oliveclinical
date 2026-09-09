'use client'

import { useActionState } from 'react'
import { updateProfile, type SettingsFormState } from './actions'
import { Field, SubmitButton, FormMessage } from '@/components/team/form-controls'

export function ProfileForm({ name }: { name: string }) {
  const [state, action] = useActionState<SettingsFormState, FormData>(updateProfile, {})

  return (
    <form action={action} className="max-w-sm space-y-4">
      <Field
        label="Display name"
        name="name"
        required={false}
        defaultValue={name}
        autoComplete="name"
        hint="How you appear on tasks and comments."
      />
      <FormMessage error={state.error} success={state.success} />
      <SubmitButton pendingLabel="Saving…" className="w-auto px-4">
        Save changes
      </SubmitButton>
    </form>
  )
}
