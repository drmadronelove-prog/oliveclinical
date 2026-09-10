"use client"

import { useEffect, useState } from "react"

/**
 * Access code gate for pages shared with clients rather than the public.
 *
 * Note on what this does and does not do: the check runs in the browser, so
 * the code and the gated markup both ship to every visitor inside the page
 * bundle. It keeps the page from reading as public and stops casual visitors,
 * but it is not a security boundary — anyone who opens developer tools can
 * read past it. Gating anything that genuinely must not be readable needs the
 * content served from behind a server-side check instead.
 */
const ACCESS_CODE = "olive"
const UNLOCK_KEY = "olive-clinical-tests-unlocked"

export function AccessGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false)
  const [ready, setReady] = useState(false)
  const [value, setValue] = useState("")
  const [error, setError] = useState(false)

  // Checked after mount so the server and client first paint agree.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(UNLOCK_KEY) === "1") setUnlocked(true)
    } catch {
      // Private browsing can refuse storage; the gate just asks again.
    }
    setReady(true)
  }, [])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (value.trim().toLowerCase() === ACCESS_CODE) {
      try {
        sessionStorage.setItem(UNLOCK_KEY, "1")
      } catch {
        // Unlocking for this view still works without storage.
      }
      setUnlocked(true)
    } else {
      setError(true)
    }
  }

  if (!ready) return null
  if (unlocked) return <>{children}</>

  return (
    <div className="max-w-md mx-auto py-10 space-y-5">
      <div className="space-y-3">
        <h2
          className="text-2xl text-foreground"
          style={{ fontFamily: "var(--font-display)", fontWeight: 500, letterSpacing: "-0.018em" }}
        >
          These tools are shared with clients
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Enter the access code you were given to open the assessments. If you are working with Olive
          Clinical and need the code, ask your clinician or get in touch and we will send it to you.
        </p>
      </div>

      <form onSubmit={submit} className="flex flex-wrap gap-2">
        <label htmlFor="tests-access-code" className="sr-only">
          Access code
        </label>
        <input
          id="tests-access-code"
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(false)
          }}
          placeholder="Access code"
          autoComplete="off"
          autoFocus
          className="flex-1 min-w-[12rem] px-3 py-2 text-sm rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-nav-teal"
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-md hover:opacity-90 transition-opacity"
        >
          Unlock
        </button>
      </form>

      {error && (
        <p className="text-sm text-nav-coral" role="alert">
          That code doesn&rsquo;t match. Check with your clinician if you need it again.
        </p>
      )}

      <p className="text-xs text-muted-foreground border-t border-border pt-4 leading-relaxed">
        These are screening and self-report tools, not diagnostic instruments, and they do not
        replace an evaluation with a qualified clinician.
      </p>
    </div>
  )
}
