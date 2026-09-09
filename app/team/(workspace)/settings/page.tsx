import Link from 'next/link'
import { requireProfile } from '@/lib/team/auth'
import { PageHeader } from '@/components/team/page-header'
import { ProfileForm } from './profile-form'

export const metadata = { title: 'Settings — Olive Team', robots: { index: false } }

export default async function SettingsPage() {
  const profile = await requireProfile()

  return (
    <>
      <PageHeader title="Settings" description="Your account." />

      <div className="max-w-2xl space-y-10 px-6 py-8">
        <section>
          <h2 className="font-display text-base font-semibold">Profile</h2>
          <div className="mt-4">
            <ProfileForm name={profile.name ?? ''} />
          </div>
        </section>

        <section>
          <h2 className="font-display text-base font-semibold">Sign-in</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex flex-wrap gap-x-3">
              <dt className="w-28 shrink-0 text-muted-foreground">Email</dt>
              <dd>{profile.email}</dd>
            </div>
            <div className="flex flex-wrap gap-x-3">
              <dt className="w-28 shrink-0 text-muted-foreground">Role</dt>
              <dd className="capitalize">{profile.role}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-muted-foreground">
            To change your password, sign out and use{' '}
            <Link
              href="/team/reset-password"
              className="underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Forgot your password
            </Link>
            . Your email address and role can only be changed by an admin.
          </p>
        </section>
      </div>
    </>
  )
}
