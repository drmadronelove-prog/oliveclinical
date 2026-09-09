import { requireAdmin } from '@/lib/team/auth'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/team/page-header'
import { displayName, initialsOf, type Profile } from '@/lib/team/types'
import { InviteForm } from './invite-form'
import { setMemberRole, setMemberArchived } from './actions'

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
            {members.map((member) => {
              const isMe = member.id === me.id
              const archived = Boolean(member.archived_at)
              return (
                <li
                  key={member.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground"
                  >
                    {initialsOf(member)}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-medium">
                        {displayName(member)}
                      </span>
                      {isMe && (
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-[11px] text-muted-foreground">
                          you
                        </span>
                      )}
                      {archived && (
                        <span className="rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">
                          Access removed
                        </span>
                      )}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {member.email}
                    </span>
                  </span>

                  <form action={setMemberRole} className="shrink-0">
                    <input type="hidden" name="id" value={member.id} />
                    <label htmlFor={`role-${member.id}`} className="sr-only">
                      Role for {displayName(member)}
                    </label>
                    <select
                      id={`role-${member.id}`}
                      name="role"
                      defaultValue={member.role}
                      disabled={isMe || archived}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs capitalize outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-50"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      type="submit"
                      disabled={isMe || archived}
                      className="ml-1.5 rounded-md border border-border px-2 py-1 text-xs hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
                    >
                      Save
                    </button>
                  </form>

                  {!isMe && (
                    <form action={setMemberArchived} className="shrink-0">
                      <input type="hidden" name="id" value={member.id} />
                      <input type="hidden" name="archived" value={archived ? 'false' : 'true'} />
                      <button
                        type="submit"
                        className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        {archived ? 'Restore access' : 'Remove access'}
                      </button>
                    </form>
                  )}
                </li>
              )
            })}
          </ul>

          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Removing access keeps the person&apos;s history — the tasks they completed stay
            attributed to them — but they can no longer sign in or read anything.
            You cannot change your own role or remove your own access, so the
            workspace can never be locked out.
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
