import { ToolPageLayout } from "@/components/tool-page-layout"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact — Olive Clinical",
  description: "Get in touch with Olive Clinical. In-person therapy in Oakland and Berkeley, CA. Telehealth throughout California.",
}

const locations = [
  {
    name: "Oakland",
    detail: "Olive Clinical",
    address: "541 Athol",
    city: "Oakland, CA 94606",
  },
  {
    name: "Berkeley",
    detail: "Anam Cara Therapy Center",
    address: "2915 Martin Luther King Junior Way",
    city: "Berkeley, CA 94703",
  },
  {
    name: "Virtual",
    detail: "Telehealth",
    address: "Available throughout California",
    city: "Secure video sessions",
  },
]

const sectionHeading: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 500,
  letterSpacing: "-0.018em",
}

const buttonText: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontWeight: 500,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontSize: "0.78rem",
}

export default function ContactPage() {
  return (
    <ToolPageLayout title="Contact" color="text-ink">
      <div className="space-y-14">

        {/* Get in Touch */}
        <div className="space-y-6 max-w-prose">
          <h2 className="text-2xl text-foreground" style={sectionHeading}>
            Get in touch
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We are currently accepting new clients. Please reach out by phone or
            email to schedule a free 20 minute consultation.
          </p>

          {/* Contact actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="tel:+14159152183"
              className="inline-flex items-center gap-3 px-5 py-3 border border-slate text-slate hover:bg-slate/10 transition-colors"
              style={buttonText}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              (415) 915-2183
            </a>

            <a
              href="mailto:info@oliveclinical.com"
              className="inline-flex items-center gap-3 px-5 py-3 border border-slate text-slate hover:bg-slate/10 transition-colors"
              style={buttonText}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              info@oliveclinical.com
            </a>
          </div>
        </div>

        {/* Locations */}
        <div>
          <h2 className="text-2xl text-foreground mb-6" style={sectionHeading}>
            Locations
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {locations.map((loc) => (
              <div
                key={loc.name}
                className="bg-card border border-border border-l-2 border-l-slate p-5 space-y-1"
              >
                <h3
                  className="text-foreground text-base mb-2"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500, letterSpacing: "-0.01em" }}
                >
                  {loc.name}
                </h3>
                <p className="text-sm text-muted-foreground">{loc.detail}</p>
                <p className="text-sm text-muted-foreground">{loc.address}</p>
                <p className="text-sm text-muted-foreground">{loc.city}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional info */}
        <div className="border-l-2 border-slate pl-6 space-y-2 max-w-prose">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sessions are available in-person at both Bay Area offices and via
            telehealth for clients anywhere in California. I offer a sliding scale
            for a limited number of clients — please inquire when you reach out.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This practice is out-of-network for all insurance plans. Superbills are
            provided monthly for potential reimbursement through your out-of-network
            benefits.
          </p>
        </div>

      </div>
    </ToolPageLayout>
  )
}
