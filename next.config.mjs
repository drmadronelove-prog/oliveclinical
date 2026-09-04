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
  // repo) is mounted at /institute on this domain. INSTITUTE_ORIGIN is the
  // Institute deployment's own origin (e.g. https://olive-institute.fly.dev)
  // — there's no plausible default to fall back to, so a missing env var
  // fails the build loudly instead of silently proxying nowhere.
  async rewrites() {
    const institute = process.env.INSTITUTE_ORIGIN;
    if (!institute) {
      throw new Error(
        "INSTITUTE_ORIGIN must be set to the Olive Institute deployment's origin (e.g. https://olive-institute.fly.dev) so /institute/:path* can be proxied to it.",
      );
    }
    return [
      { source: "/institute", destination: `${institute}/institute` },
      { source: "/institute/:path*", destination: `${institute}/institute/:path*` },
    ];
  },
}

export default nextConfig
