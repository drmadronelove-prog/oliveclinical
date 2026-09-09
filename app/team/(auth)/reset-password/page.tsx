import Link from 'next/link'
import { AuthCard } from '@/components/team/auth-card'
import { ResetForm } from './reset-form'

export const metadata = { title: 'Reset password — Olive Team', robots: { index: false } }

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      description="We will email you a link that signs you in and lets you set a new password."
      footer={
        <Link
          href="/team/login"
          className="underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Back to sign in
        </Link>
      }
    >
      <ResetForm />
    </AuthCard>
  )
}
