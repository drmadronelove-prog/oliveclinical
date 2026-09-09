'use client'

import { useFormStatus } from 'react-dom'
import { cn } from '@/lib/utils'

export function Field({
  label,
  name,
  type = 'text',
  autoComplete,
  required = true,
  defaultValue,
  placeholder,
  hint,
}: {
  label: string
  name: string
  type?: string
  autoComplete?: string
  required?: boolean
  defaultValue?: string
  placeholder?: string
  hint?: string
}) {
  const hintId = hint ? `${name}-hint` : undefined
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-describedby={hintId}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
      />
      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  )
}

export function SubmitButton({
  children,
  pendingLabel,
  className,
}: {
  children: React.ReactNode
  pendingLabel?: string
  className?: string
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(
        'inline-flex w-full items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60',
        className,
      )}
    >
      {pending ? (pendingLabel ?? 'Working…') : children}
    </button>
  )
}

/**
 * Errors are announced, not just shown — a screen reader reads this the
 * moment it appears without the person having to hunt for it.
 */
export function FormMessage({ error, success }: { error?: string; success?: string }) {
  if (!error && !success) return null
  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        'rounded-md border px-3 py-2 text-sm',
        error
          ? 'border-destructive/40 bg-destructive/10 text-foreground'
          : 'border-border bg-secondary text-foreground',
      )}
    >
      {error ?? success}
    </p>
  )
}
