'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Home,
  Inbox,
  ListTodo,
  Calendar,
  FolderKanban,
  ListChecks,
  Users,
  Settings,
  FolderOpen,
  CheckSquare,
} from 'lucide-react'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import { searchWorkspace, type SearchResults } from '@/app/team/(workspace)/search-actions'

type NavCommand = { label: string; href: string; icon: typeof Home; adminOnly?: boolean }

const NAV_COMMANDS: NavCommand[] = [
  { label: 'Home', href: '/team', icon: Home },
  { label: 'Inbox', href: '/team/inbox', icon: Inbox },
  { label: 'My Tasks', href: '/team/my-tasks', icon: ListTodo },
  { label: 'Calendar', href: '/team/calendar', icon: Calendar },
  { label: 'Projects', href: '/team/projects', icon: FolderKanban },
  { label: 'Templates', href: '/team/templates', icon: ListChecks },
  { label: 'Members', href: '/team/members', icon: Users, adminOnly: true },
  { label: 'Settings', href: '/team/settings', icon: Settings },
]

/**
 * Cmd/Ctrl+K from anywhere in the workspace, or the Search button in the
 * sidebar — both just flip the `open` state TeamShell owns. Jumps to a
 * page, or searches projects and tasks by name and takes you straight
 * there — the same ?task= deep link the Inbox already uses to open a
 * task's detail pane directly on its project page.
 */
export function CommandPalette({
  open,
  onOpenChange,
  isAdmin,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  isAdmin: boolean
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults>({ projects: [], tasks: [] })
  const router = useRouter()
  const requestId = useRef(0)

  useEffect(() => {
    if (!open) return
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setResults({ projects: [], tasks: [] })
      return
    }
    const id = ++requestId.current
    const timeout = setTimeout(() => {
      searchWorkspace(trimmed).then((r) => {
        if (id === requestId.current) setResults(r)
      })
    }, 200)
    return () => clearTimeout(timeout)
  }, [query, open])

  function go(href: string) {
    onOpenChange(false)
    setQuery('')
    router.push(href)
  }

  const visibleNav = NAV_COMMANDS.filter((c) => !c.adminOnly || isAdmin)
  const trimmed = query.trim()
  const showSearchResults = trimmed.length >= 2

  return (
    <CommandDialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) setQuery('')
      }}
      title="Command palette"
      description="Jump to a page, or search projects and tasks"
    >
      <CommandInput placeholder="Search or jump to..." value={query} onValueChange={setQuery} />
      <CommandList>
        <CommandEmpty>{showSearchResults ? 'Nothing found.' : 'Keep typing to search projects and tasks.'}</CommandEmpty>

        {!showSearchResults && (
          <CommandGroup heading="Go to">
            {visibleNav.map(({ label, href, icon: Icon }) => (
              <CommandItem key={href} value={label} onSelect={() => go(href)}>
                <Icon aria-hidden="true" />
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {showSearchResults && results.projects.length > 0 && (
          <CommandGroup heading="Projects">
            {results.projects.map((project) => (
              <CommandItem
                key={project.id}
                value={`${project.name} ${project.id}`}
                onSelect={() => go(`/team/projects/${project.id}`)}
              >
                <FolderOpen aria-hidden="true" />
                {project.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {showSearchResults && results.tasks.length > 0 && (
          <CommandGroup heading="Tasks">
            {results.tasks.map((task) => (
              <CommandItem
                key={task.id}
                value={`${task.title} ${task.id}`}
                onSelect={() => go(`/team/projects/${task.project_id}?task=${task.id}`)}
              >
                <CheckSquare aria-hidden="true" />
                <span className="truncate">{task.title}</span>
                {task.project_name && <span className="ml-auto shrink-0 text-xs text-muted-foreground">{task.project_name}</span>}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
