import { requireAdmin } from '@/lib/team/auth'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/team/page-header'
import type { Profile } from '@/lib/team/types'
import { InviteForm } from './invite-form'
import { MemberRow } from './member-row'

export const metadata = { title: 'Members — Olive Team', robots: { index: false } }

export default async function MembersPage() {
  const me = await requireAdmin()
  const supabase = await createClient()

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('archived_at', { ascending: true, nullsFirst: true })
    .order('created_at', { ascending: true })

  const members = (data ?? []) as Profile[]

  return (
    <>
      <PageHeader
        title="Members"
        description="Everyone who can sign in. There is no public sign-up — people get in only by invitation from this page."
      />

      <div className="grid gap-10 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
        <section>
          <h2 className="font-display text-base font-semibold">
            {members.length} {members.length === 1 ? 'person' : 'people'}
          </h2>

          <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
            {members.map((member) => (
              <MemberRow key={member.id} member={member} isMe={member.id === me.id} />
            ))}
          </ul>

          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            &quot;Send reset link&quot; emails someone the same link they&apos;d get from
            &quot;Forgot your password?&quot; on the sign-in page — use it if they can&apos;t
            find that link themselves. Removing access keeps the person&apos;s history — the
            tasks they completed stay attributed to them — but they can no longer sign in or
            read anything. Deleting goes further and erases their account entirely, which only
            works if they have no history yet. You cannot change your own role, remove your own
            access, or delete your own account, so the workspace can never be locked out.
          </p>
        </section>

        <section className="lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-lg border border-border bg-secondary/30 p-5">
            <h2 className="font-display text-base font-semibold">Invite someone</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              They get an email with a link that lets them set a password. The link is
              good for 24 hours.
            </p>
            <div className="mt-5">
              <InviteForm />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
