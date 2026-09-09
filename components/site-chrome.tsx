'use client'

import { usePathname } from 'next/navigation'

/**
 * The marketing site's header and footer wrap every public page, but the
 * /team workspace is a different surface with its own sidebar chrome.
 * This hides the public chrome there without moving the twenty-odd
 * marketing routes into a Next.js route group — a much larger change to a
 * site that is live.
 *
 * `usePathname` resolves during server rendering too, so there is no
 * flash of the wrong header.
 */
export function PublicChromeOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/team')) return null
  return <>{children}</>
}
