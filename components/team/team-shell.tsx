'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Settings, Moon, Sun, Menu, X, LogOut, FolderKanban, ListChecks, Calendar, ListTodo, Inbox, Search, HardDrive, ExternalLink } from 'lucide-react'
import { Toaster } from 'sonner'
import { cn } from '@/lib/utils'
import { displayName, initialsOf, type Profile } from '@/lib/team/types'
import { signOut } from '@/app/team/actions'
import { CommandPalette } from './command-palette'

/**
 * The Olive Clinical mark — a filled circle with the pimento sheen set
 * upper-right, the same shape the marketing site's hero blobs wear. Inline
 * rather than an <img> so it inherits the text color (and so flips with the
 * theme) and stays crisp at the two sizes the sidebar uses it at.
 */
function OliveMark({ className, fill = 'currentColor' }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <circle cx="50" cy="50" r="50" fill={fill} />
      <ellipse cx="62" cy="40" rx="15" ry="22" fill="#ffffff" opacity="0.28" />
    </svg>
  )
}

type NavItem = { href: string; label: string; icon: typeof Home; adminOnly?: boolean }

const NAV: NavItem[] = [
  { href: '/team', label: 'Home', icon: Home },
  { href: '/team/inbox', label: 'Inbox', icon: Inbox },
  { href: '/team/my-tasks', label: 'My Tasks', icon: ListTodo },
  { href: '/team/calendar', label: 'Calendar', icon: Calendar },
  { href: '/team/projects', label: 'Projects', icon: FolderKanban },
  { href: '/team/templates', label: 'Templates', icon: ListChecks },
  { href: '/team/members', label: 'Members', icon: Users, adminOnly: true },
  { href: '/team/settings', label: 'Settings', icon: Settings },
]

const GOOGLE_DRIVE_URL = 'https://drive.google.com/drive/folders/1Gyy3ulm6OnZGm2aJGsw6Fbk2w1oRrL07?usp=drive_link'

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
  unreadCount = 0,
  children,
}: {
  profile: Profile
  unreadCount?: number
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { dark, toggle } = useTeamTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  // Close the mobile drawer whenever navigation happens.
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const items = NAV.filter((item) => !item.adminOnly || profile.role === 'admin')

  return (
    <div className={cn(dark && 'dark')}>
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex w-[17rem] shrink-0 flex-col border-r border-border bg-secondary/40 transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex h-16 items-center justify-between px-5">
            <Link
              href="/team"
              className="flex items-center gap-3.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <OliveMark className="size-6.5 shrink-0" />
              <span aria-hidden="true" className="h-6.5 w-px bg-gold" />
              <span className="font-display text-xl tracking-tight">
                Olive <span className="font-normal text-muted-foreground">Team</span>
              </span>
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

          <div className="px-4 pb-4">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="flex w-full items-center gap-2.5 rounded-md border border-border bg-background/60 px-3 py-2.5 text-sm text-muted-foreground hover:border-gold hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Search className="size-4 shrink-0" aria-hidden="true" />
              Search
              <span className="ml-auto text-xs text-muted-foreground/70">⌘K</span>
            </button>
          </div>

          <nav className="flex-1 space-y-0.5 overflow-y-auto px-3" aria-label="Workspace">
            {items.map(({ href, label, icon: Icon }) => {
              const active = href === '/team' ? pathname === href : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2.5 text-[0.9375rem] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    active
                      ? 'bg-background font-semibold text-foreground shadow-[inset_2px_0_0_var(--gold)]'
                      : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {label}
                  {href === '/team/inbox' && unreadCount > 0 && (
                    <span
                      className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-gold/35 px-2 text-xs font-semibold text-foreground"
                      aria-label={`${unreadCount} unread`}
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="px-3 pt-4">
            <a
              href={GOOGLE_DRIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-background/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <HardDrive className="size-4 shrink-0" aria-hidden="true" />
              Google Drive
              <ExternalLink className="ml-auto size-3 shrink-0 text-muted-foreground/60" aria-hidden="true" />
            </a>
          </div>

          <div className="mt-3.5 flex flex-col gap-4 border-t border-border px-5 py-4.5">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="relative grid size-9.5 shrink-0 place-items-center">
                <OliveMark className="absolute inset-0 size-9.5" fill="var(--plum)" />
                <span className="relative text-xs font-semibold text-paper">{initialsOf(profile)}</span>
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="block truncate font-display text-base">{displayName(profile)}</span>
                <span className="block text-[11px] tracking-[0.09em] text-muted-foreground uppercase">
                  {profile.role}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggle}
                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-border bg-background/60 px-2.5 py-2 text-[0.8125rem] text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {dark ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
                {dark ? 'Light' : 'Dark'}
              </button>
              <form action={signOut} className="flex-1">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background/60 px-2.5 py-2 text-[0.8125rem] text-muted-foreground hover:border-plum/35 hover:bg-plum/10 hover:text-plum focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
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
            <span className="flex items-center gap-2.5">
              <OliveMark className="size-5 shrink-0" />
              <span className="font-display text-lg">
                Olive <span className="font-normal text-muted-foreground">Team</span>
              </span>
            </span>
          </header>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>

      {/* Explicit theme prop rather than CSS inheritance — sonner portals
          its toasts to the end of <body>, outside this component's own
          `dark` wrapper div. */}
      <Toaster theme={dark ? 'dark' : 'light'} position="bottom-right" richColors closeButton />

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} isAdmin={profile.role === 'admin'} />
    </div>
  )
}
