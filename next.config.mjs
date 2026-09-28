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
      { source: "/brain-games",        destination: "https://cbtgames.com/", permanent: true },
      { source: "/relationships",      destination: "/",                permanent: true },
      { source: "/grief-trauma",       destination: "/",                permanent: true },
      { source: "/depression-burnout", destination: "/",                permanent: true },
    ]
  },
  // The Olive Institute course platform (a separate deployment, separate
  // repo) is mounted at /institute on this domain. It is proxied by a
  // route handler — app/institute/[[...path]]/route.ts — and deliberately
  // NOT by a rewrite, here or in vercel.json.
  //
  // Both were tried and both failed the same way: clicking a link inside
  // /institute returned a 404 while reloading that exact URL worked, and
  // the Institute's own origin was fine throughout. The difference between
  // those two cases is one request header. A click fetches the URL with
  // `RSC: 1`; a reload asks for a plain document. Both this site and the
  // Institute are Next.js apps on Vercel, and a request carrying that
  // header never reached the Institute — this app answered it, has no
  // /institute page, and returned 404, which the Institute's router then
  // rendered as its own "404 — Page not found".
  //
  // A route handler leaves nothing to intercept: /institute/:path* is a
  // real route in this app, and it forwards the request verbatim. See the
  // comment at the top of that file for how it was confirmed.
}

export default nextConfig
