'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Settings, Moon, Sun, Menu, X, LogOut, FolderKanban } from 'lucide-react'
import { Toaster } from 'sonner'
import { cn } from '@/lib/utils'
import { displayName, initialsOf, type Profile } from '@/lib/team/types'
import { signOut } from '@/app/team/actions'

type NavItem = { href: string; label: string; icon: typeof Home; adminOnly?: boolean }

const NAV: NavItem[] = [
  { href: '/team', label: 'Home', icon: Home },
  { href: '/team/projects', label: 'Projects', icon: FolderKanban },
  { href: '/team/members', label: 'Members', icon: Users, adminOnly: true },
  { href: '/team/settings', label: 'Settings', icon: Settings },
]

/**
 * Dark mode is stored per browser and applied by putting the `dark` class
 * on this shell rather than on <html>. Scoping it here means the team
 * workspace can be dark while the public marketing site — which shares
 * this deployment and has no theme switch — stays exactly as it is.
 */
function useTeamTheme() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem('team-theme')
    if (stored) {
      setDark(stored === 'dark')
    } else {
      setDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [])

  const toggle = () => {
    setDark((current) => {
      const next = !current
      window.localStorage.setItem('team-theme', next ? 'dark' : 'light')
      return next
    })
  }

  return { dark, toggle }
}

export function TeamShell({
  profile,
  children,
}: {
  profile: Profile
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { dark, toggle } = useTeamTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close the mobile drawer whenever navigation happens.
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const items = NAV.filter((item) => !item.adminOnly || profile.role === 'admin')

  return (
    <div className={cn(dark && 'dark')}>
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-border bg-secondary/40 transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <Link href="/team" className="font-display text-base font-semibold tracking-tight">
              Olive <span className="text-muted-foreground font-normal">Team</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:hidden"
              aria-label="Close navigation"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <nav className="flex-1 space-y-0.5 p-2" aria-label="Workspace">
            {items.map(({ href, label, icon: Icon }) => {
              const active = href === '/team' ? pathname === href : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    active
                      ? 'bg-background font-medium text-foreground shadow-xs'
                      : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-border p-2">
            <div className="flex items-center gap-2.5 rounded-md px-2.5 py-2">
              <span
                aria-hidden="true"
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground"
              >
                {initialsOf(profile)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm">{displayName(profile)}</span>
                <span className="block text-xs capitalize text-muted-foreground">{profile.role}</span>
              </span>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={toggle}
                className="flex flex-1 items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-background/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {dark ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
                {dark ? 'Light' : 'Dark'}
              </button>
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-background/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </aside>

        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-foreground/20 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              aria-label="Open navigation"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
            <span className="font-display text-base font-semibold">Olive Team</span>
          </header>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>

      {/* Explicit theme prop rather than CSS inheritance — sonner portals
          its toasts to the end of <body>, outside this component's own
          `dark` wrapper div. */}
      <Toaster theme={dark ? 'dark' : 'light'} position="bottom-right" richColors closeButton />
    </div>
  )
}
