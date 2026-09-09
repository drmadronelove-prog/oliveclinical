import Link from 'next/link'
import { AuthCard } from '@/components/team/auth-card'
import { LoginForm } from './login-form'

export const metadata = { title: 'Sign in — Olive Team', robots: { index: false } }

const LINK_ERROR_MESSAGES: Record<string, string> = {
  expired: 'That link has expired or was already used. Request a new one below.',
  link: "That link didn't work. Request a new one below.",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const { next, error } = await searchParams
  const linkError = error ? (LINK_ERROR_MESSAGES[error] ?? LINK_ERROR_MESSAGES.link) : undefined

  return (
    <AuthCard
      title="Sign in"
      description="This workspace is invite-only. If you do not have an account yet, ask an admin to invite you."
      footer={
        <Link
          href="/team/reset-password"
          className="underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Forgot your password?
        </Link>
      }
    >
      {linkError && (
        <p
          role="status"
          aria-live="polite"
          className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm"
        >
          {linkError}
        </p>
      )}
      <LoginForm next={next} />
    </AuthCard>
  )
}
