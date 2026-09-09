import { AuthCard } from '@/components/team/auth-card'
import { UpdatePasswordForm } from './update-password-form'

export const metadata = { title: 'Choose a password — Olive Team', robots: { index: false } }

export default function UpdatePasswordPage() {
  return (
    <AuthCard
      title="Choose a password"
      description="Pick something at least 10 characters long that you do not use anywhere else."
    >
      <UpdatePasswordForm />
    </AuthCard>
  )
}
