/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/individual-therapy", destination: "https://v0-madronelove-website.vercel.app/", permanent: true },
      { source: "/tests-blog",         destination: "/blog",            permanent: true },
      { source: "/adhd-asd-skills",    destination: "/adhd-skills",     permanent: true },
      { source: "/mindfulness-games",  destination: "/mindfulness",     permanent: true },
      { source: "/relationships",      destination: "/",                permanent: true },
      { source: "/grief-trauma",       destination: "/",                permanent: true },
      { source: "/depression-burnout", destination: "/",                permanent: true },
    ]
  },
  // The Olive Institute course platform (a separate deployment, separate
  // repo) is mounted at /institute on this domain — but the rewrite that
  // proxies it lives in vercel.json, NOT here, and that is deliberate.
  //
  // Next.js strips the `_rsc` marker from the App Router's own data
  // requests when it performs the rewrite itself (vercel/next.js#69296).
  // The Institute app then answers those requests as if they were page
  // loads, its router cannot use what comes back, and it renders its own
  // "404 — Page not found". The symptom is specific and was confusing to
  // track down: clicking a link inside /institute 404s while reloading
  // that exact URL works, and the Institute's own origin is fine
  // throughout. The same issue records that a rewrite performed at the
  // CDN level does not strip it, which is what vercel.json gets us.
  //
  // Consequences of the move, both acceptable: the destination is a
  // literal in vercel.json rather than the INSTITUTE_ORIGIN env var
  // (vercel.json cannot read env vars), so moving the Institute means
  // editing that file; and `next dev` here no longer proxies /institute,
  // since vercel.json is a platform config the dev server does not read.
}

export default nextConfig
