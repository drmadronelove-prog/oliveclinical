"use client"

import { motion } from "framer-motion"
import { useState } from "react"

type Status = "idle" | "loading" | "success" | "error"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("") // honeypot — real people leave this blank
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === "loading") return

    setStatus("loading")
    setMessage("")

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setStatus("error")
        setMessage(data?.error || "Something went wrong. Please try again.")
        return
      }

      setStatus("success")
      setMessage(data?.message || "You're on the list — thank you.")
      setEmail("")
    } catch {
      setStatus("error")
      setMessage("Couldn't reach the server. Please try again.")
    }
  }

  return (
    <section
      id="newsletter"
      className="relative px-5 sm:px-8 lg:px-12 py-20 lg:py-28"
      style={{ background: "var(--linen)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center"
        >
          {/* Copy */}
          <div className="space-y-5">
            <span
              className="inline-block text-xs sm:text-sm font-bold tracking-[0.18em] uppercase"
              style={{ fontFamily: "var(--font-display)", color: "var(--gold)" }}
            >
              Stay in touch
            </span>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.9rem, 4.5vw, 3.5rem)",
                fontWeight: 400,
                color: "var(--ink)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Join the Olive Clinical
              <br />
              email list
            </h2>

            <p
              className="text-base sm:text-lg leading-relaxed max-w-md"
              style={{ color: "var(--slate)" }}
            >
              Occasional notes on neuroinclusive practice — new tools, writing, and
              resources as they&apos;re released. No spam, and you can unsubscribe
              from any email.
            </p>
          </div>

          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} noValidate>
              <label
                htmlFor="newsletter-email"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--ink)" }}
              >
                Email address
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-describedby="newsletter-status"
                  disabled={status === "loading"}
                  className="flex-1 px-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 disabled:opacity-60"
                  style={{
                    background: "var(--paper)",
                    color: "var(--ink)",
                    border: "1px solid var(--soft)",
                  }}
                />

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-8 py-3 rounded-full font-bold text-sm tracking-wider uppercase transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: "var(--ink)",
                    color: "var(--paper)",
                  }}
                >
                  {status === "loading" ? "Signing up…" : "Sign up"}
                </button>
              </div>

              {/* Honeypot — visually hidden, ignored by real users, filled by bots */}
              <div aria-hidden="true" className="absolute w-px h-px -m-px overflow-hidden p-0 border-0" style={{ clip: "rect(0 0 0 0)" }}>
                <label htmlFor="newsletter-company">Company</label>
                <input
                  id="newsletter-company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <p
                id="newsletter-status"
                role="status"
                aria-live="polite"
                className="text-sm mt-3 min-h-[1.25rem]"
                style={{
                  color: status === "error" ? "var(--plum)" : "var(--slate)",
                }}
              >
                {message}
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
