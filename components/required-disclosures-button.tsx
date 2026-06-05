"use client"

import { useState } from "react"

export function RequiredDisclosuresButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-plum border border-plum px-4 py-2.5 hover:bg-plum/10 transition-colors"
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontSize: "0.72rem",
        }}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Required Disclosures
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div className="bg-background rounded-xl border border-border max-w-lg w-full max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 p-6 border-b border-border">
              <h2 className="font-[var(--font-display)] font-black text-lg tracking-tight text-foreground leading-tight">
                REQUIRED DISCLOSURES
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <div>
                <h3 className="font-[var(--font-display)] font-bold text-foreground text-sm tracking-wide mb-2">
                  LICENSE &amp; CREDENTIALS
                </h3>
                <ul className="space-y-2">
                  {[
                    "Madrone Love, PsyD — Licensed Clinical Psychologist",
                    "California License #PSY35899",
                    "PsyD, The Wright Institute (2023)",
                    "Post-doctoral Fellow, UCSF (2025)",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                      <span className="text-nav-coral font-bold shrink-0 mt-0.5">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-[var(--font-display)] font-bold text-foreground text-sm tracking-wide mb-2">
                  PRACTICE LOCATIONS
                </h3>
                <ul className="space-y-2">
                  {[
                    "541 Athol, Oakland, CA 94606",
                    "2915 Martin Luther King Junior Way, Berkeley, CA 94703",
                    "Telehealth available throughout California",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                      <span className="text-nav-coral font-bold shrink-0 mt-0.5">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-[var(--font-display)] font-bold text-foreground text-sm tracking-wide mb-2">
                  CLIENT RIGHTS
                </h3>
                <ul className="space-y-2">
                  {[
                    "You have the right to receive a written summary of your rights as a client.",
                    "You have the right to confidentiality, with exceptions required by law (e.g., mandated reporting, imminent danger).",
                    "You have the right to be informed of the nature and extent of services, costs, and alternatives.",
                    "You have the right to refuse or withdraw consent for treatment at any time.",
                    "You have the right to request records and be informed of limits to access.",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                      <span className="text-nav-coral font-bold shrink-0 mt-0.5">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-nav-coral/5 border border-nav-coral/20 rounded-lg p-4 text-sm text-muted-foreground leading-relaxed">
                For questions about your rights as a client, contact the California Board of Psychology at{" "}
                <strong className="text-foreground">(916) 574-7720</strong> or visit{" "}
                <strong className="text-foreground">psychology.ca.gov</strong>.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
