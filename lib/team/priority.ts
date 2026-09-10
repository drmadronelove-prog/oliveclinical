export type Priority = 'none' | 'low' | 'medium' | 'high'

export const PRIORITY_ORDER: Priority[] = ['high', 'medium', 'low', 'none']

export const PRIORITY_LABEL: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  none: 'No priority',
}

// Tailwind classes, not raw colors — so light/dark mode stay correct
// without this file needing to know which mode is active.
export const PRIORITY_BADGE_CLASS: Record<Priority, string> = {
  high: 'border-transparent bg-destructive/15 text-destructive',
  medium: 'border-transparent bg-[var(--gold)]/20 text-[var(--ink)] dark:text-[var(--paper)]',
  low: 'border-transparent bg-secondary text-secondary-foreground',
  none: 'border-border text-muted-foreground',
}

export function comparePriority(a: Priority, b: Priority): number {
  return PRIORITY_ORDER.indexOf(a) - PRIORITY_ORDER.indexOf(b)
}
