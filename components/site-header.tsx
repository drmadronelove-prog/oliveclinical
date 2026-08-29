"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { OliveLockup } from "@/components/olive-logo"

type NavLink = { label: string; href: string }
type NavGroup = { heading: string; items: NavLink[] }

const SERVICES_LINKS: NavLink[] = [
  { label: "Psychotherapy", href: "/psychotherapy" },
  { label: "Neuroinclusive Assessments", href: "/tests" },
]

const RESOURCES_GROUPS: NavGroup[] = [
  {
    heading: "Skills",
    items: [
      { label: "ADHD Skills", href: "/adhd-skills" },
      { label: "ASD Skills", href: "/asd-skills" },
      { label: "OCD Skills", href: "/ocd-skills" },
      { label: "Neurodiverse Relationships", href: "/neurodiverse-relationships" },
    ],
  },
  {
    heading: "Tools",
    items: [
      { label: "Therapeutic Tools", href: "/tools" },
      { label: "Brain Games", href: "/brain-games" },
    ],
  },
  {
    heading: "Writing",
    items: [{ label: "Blog", href: "/blog" }],
  },
]

const dropdownButtonStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontWeight: 600,
  color: "var(--ink)",
}

const groupHeadingStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontWeight: 600,
  letterSpacing: "0.1em",
  color: "var(--slate)",
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: "transform 160ms ease",
        transform: open ? "rotate(180deg)" : "none",
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line
        x1="4" y1="7" x2="20" y2="7"
        stroke="var(--ink)" strokeWidth={2} strokeLinecap="round"
        style={{
          transformOrigin: "center",
          transition: "transform 180ms ease, opacity 180ms ease",
          transform: open ? "translateY(5px) rotate(45deg)" : "none",
        }}
      />
      <line
        x1="4" y1="12" x2="20" y2="12"
        stroke="var(--ink)" strokeWidth={2} strokeLinecap="round"
        style={{ transition: "opacity 180ms ease", opacity: open ? 0 : 1 }}
      />
      <line
        x1="4" y1="17" x2="20" y2="17"
        stroke="var(--ink)" strokeWidth={2} strokeLinecap="round"
        style={{
          transformOrigin: "center",
          transition: "transform 180ms ease, opacity 180ms ease",
          transform: open ? "translateY(-5px) rotate(-45deg)" : "none",
        }}
      />
    </svg>
  )
}

function DropdownPanel({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="menu"
      className="absolute left-0 top-full mt-2 min-w-[16rem] rounded-lg p-2"
      style={{
        background: "var(--paper)",
        border: "1px solid var(--border)",
        boxShadow: "0 14px 32px rgba(11,37,69,0.16), 0 2px 8px rgba(11,37,69,0.08)",
      }}
    >
      {children}
    </div>
  )
}

function DropdownLink({
  href,
  onNavigate,
  children,
}: {
  href: string
  onNavigate: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onNavigate}
      className="block px-3 py-2 rounded-md text-[0.9rem] transition-colors hover:bg-[var(--linen)]"
      style={{ fontFamily: "var(--font-body)", color: "var(--ink)" }}
    >
      {children}
    </Link>
  )
}

export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<null | "services" | "resources">(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenMenu(null)
        setMobileOpen(false)
      }
    }
    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const closeAll = () => {
    setOpenMenu(null)
    setMobileOpen(false)
  }

  return (
    <header
      className="no-print w-full sticky top-0 z-50"
      style={{
        backgroundColor: "var(--paper)",
        backgroundImage: "var(--bg-lines)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-4 sm:py-5 flex flex-wrap items-center gap-x-4 gap-y-3">
        {/* Left: lockup */}
        <div className="shrink-0">
          <Link href="/" aria-label="Olive Clinical home" className="inline-flex items-center" onClick={closeAll}>
            <OliveLockup size={0.5} />
          </Link>
        </div>

        {/* Desktop dropdown nav */}
        <nav ref={navRef} className="hidden lg:flex items-center gap-1 ml-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu((m) => (m === "services" ? null : "services"))}
              aria-expanded={openMenu === "services"}
              aria-haspopup="true"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-[0.92rem] rounded-md transition-colors hover:bg-[var(--linen)]"
              style={dropdownButtonStyle}
            >
              Services
              <ChevronDown open={openMenu === "services"} />
            </button>
            {openMenu === "services" && (
              <DropdownPanel>
                {SERVICES_LINKS.map((l) => (
                  <DropdownLink key={l.href} href={l.href} onNavigate={closeAll}>
                    {l.label}
                  </DropdownLink>
                ))}
              </DropdownPanel>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenMenu((m) => (m === "resources" ? null : "resources"))}
              aria-expanded={openMenu === "resources"}
              aria-haspopup="true"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-[0.92rem] rounded-md transition-colors hover:bg-[var(--linen)]"
              style={dropdownButtonStyle}
            >
              Resources
              <ChevronDown open={openMenu === "resources"} />
            </button>
            {openMenu === "resources" && (
              <DropdownPanel>
                {RESOURCES_GROUPS.map((group, i) => (
                  <div key={group.heading} className={i > 0 ? "mt-1" : ""}>
                    <div className="px-3 pt-2 pb-1 text-[0.68rem] uppercase" style={groupHeadingStyle}>
                      {group.heading}
                    </div>
                    {group.items.map((l) => (
                      <DropdownLink key={l.href} href={l.href} onNavigate={closeAll}>
                        {l.label}
                      </DropdownLink>
                    ))}
                  </div>
                ))}
              </DropdownPanel>
            )}
          </div>
        </nav>

        {/* Right: booking CTA + mobile hamburger */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 ml-auto">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-md px-4 py-2.5 sm:px-5 text-[0.9rem] transition-opacity hover:opacity-90"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              background: "var(--gold)",
              color: "var(--ink)",
            }}
            onClick={closeAll}
          >
            Book a consultation
          </Link>

          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md transition-colors hover:bg-[var(--linen)]"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div
          className="lg:hidden"
          style={{ borderTop: "1px solid var(--border)", background: "var(--paper)" }}
        >
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
            <div>
              <div className="px-1 pb-2 text-[0.72rem] uppercase" style={groupHeadingStyle}>
                Services
              </div>
              <div className="flex flex-col">
                {SERVICES_LINKS.map((l) => (
                  <DropdownLink key={l.href} href={l.href} onNavigate={closeAll}>
                    {l.label}
                  </DropdownLink>
                ))}
              </div>
            </div>

            <div>
              <div className="px-1 pb-2 text-[0.72rem] uppercase" style={groupHeadingStyle}>
                Resources
              </div>
              <div className="flex flex-col gap-3">
                {RESOURCES_GROUPS.map((group) => (
                  <div key={group.heading}>
                    <div
                      className="px-3 pb-1 text-[0.66rem] uppercase"
                      style={{ ...groupHeadingStyle, opacity: 0.75 }}
                    >
                      {group.heading}
                    </div>
                    {group.items.map((l) => (
                      <DropdownLink key={l.href} href={l.href} onNavigate={closeAll}>
                        {l.label}
                      </DropdownLink>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
