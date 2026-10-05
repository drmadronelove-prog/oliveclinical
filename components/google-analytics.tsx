"use client"

import Script from "next/script"
import { usePathname } from "next/navigation"

/**
 * Google tag (gtag.js) for the GA4 property linked to Google Ads.
 *
 * The measurement ID is not a secret — it ships in the client bundle of
 * every site that uses gtag — so it lives here rather than in an env var.
 */
export const GA_MEASUREMENT_ID = "G-GQNTW75FGY"

/**
 * Deliberately not loaded on /team: that is the internal staff portal, and
 * its URLs contain project and record IDs that have no business being sent
 * to Google. Note this only prevents loading on a direct visit to a /team
 * page — GA4's enhanced measurement keeps reporting route changes after the
 * tag has loaded on a public page, so a client-side navigation into /team
 * within the same tab can still be counted.
 */
const EXCLUDED_PREFIXES = ["/team"]

export function GoogleAnalytics() {
  const pathname = usePathname()

  if (EXCLUDED_PREFIXES.some((prefix) => pathname?.startsWith(prefix))) {
    return null
  }

  return (
    <>
      {/* Server-rendered rather than a next/script, so dataLayer and gtag
          exist from the moment the document parses. An inline next/script
          only runs after hydration, which would leave the async gtag.js
          loader able to arrive first on a slow client. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`,
        }}
      />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
    </>
  )
}
