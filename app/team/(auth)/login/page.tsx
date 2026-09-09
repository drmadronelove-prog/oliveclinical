import Link from 'next/link'
import { AuthCard } from '@/components/team/auth-card'
import { LoginForm } from './login-form'

export const metadata = { title: 'Sign in — Olive Team', robots: { index: false } }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams

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
      <LoginForm next={next} />
    </AuthCard>
  )
}
