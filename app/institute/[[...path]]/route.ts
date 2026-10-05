/**
 * Proxies everything under /institute to the Olive Institute app.
 *
 * This is a real route in this app, not a rewrite, and that is the whole
 * point. Two earlier attempts proxied /institute with a rewrite — first
 * Next's own `rewrites()`, then one at the CDN in vercel.json — and both
 * had the same symptom: clicking a link inside /institute returned a 404
 * while reloading that exact URL worked, and the Institute's own origin
 * was fine throughout.
 *
 * What separates those two cases is a single request header. Clicking a
 * link makes the App Router fetch the same URL with `RSC: 1`; a reload
 * asks for it as an ordinary document. Both apps are Next.js apps on
 * Vercel, and a request carrying `RSC: 1` was never reaching the
 * Institute at all — this app has no /institute page of its own, so it
 * answered 404, and the Institute's router rendered its own not-found
 * from that status. Confirmed from the outside: pasting
 * /institute/explore into the address bar serves the page, clicking a
 * link to it does not, and adding the `?_rsc=` marker by hand (without
 * the header) still serves the page, so it is the header and not the
 * query that decides.
 *
 * A route handler has nothing left to intercept: /institute/:path* is
 * this app's own route, and what it does with the request is forward it
 * verbatim. Headers, method, body, query and status all pass through
 * untouched in both directions, so the Institute sees exactly what the
 * browser sent, including that header.
 */

/** Never prerender or cache: every request is proxied as it arrives. */
export const dynamic = "force-dynamic";

/**
 * Where the Institute is deployed. The literal is the default because
 * vercel.json could not read an env var and so hardcoded it; this keeps
 * working with no configuration, while still allowing an override when
 * the Institute moves.
 */
const INSTITUTE_ORIGIN =
  process.env.INSTITUTE_ORIGIN ??
  "https://oliveinstitute-production.up.railway.app";

/**
 * Headers that describe how *this* hop was framed, not what was sent.
 * `content-encoding` and `content-length` are the ones that actually
 * break things: fetch decompresses the upstream body for us, so passing
 * the original `content-encoding: gzip` along would leave the browser
 * trying to gunzip bytes that are already plain.
 */
const HOP_BY_HOP = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

async function proxy(request: Request): Promise<Response> {
  const incoming = new URL(request.url);
  const target = new URL(
    incoming.pathname + incoming.search,
    INSTITUTE_ORIGIN,
  );

  const headers = new Headers(request.headers);
  // Address the upstream by its own name; tell it who was really asked.
  headers.set("host", new URL(INSTITUTE_ORIGIN).host);
  headers.set("x-forwarded-host", incoming.host);
  headers.set("x-forwarded-proto", incoming.protocol.replace(":", ""));
  for (const name of HOP_BY_HOP) headers.delete(name);

  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: request.method,
      headers,
      body: hasBody ? request.body : undefined,
      // Streams the request body through rather than buffering it, which
      // is what lets a Server Action's multipart POST pass along intact.
      ...(hasBody ? { duplex: "half" } : {}),
      // Hand redirects back to the browser instead of following them
      // here: a sign-in redirect belongs to the visitor, not to us.
      redirect: "manual",
    } as RequestInit);
  } catch (error) {
    console.error("[institute proxy] upstream request failed", error);
    return new Response("The Institute is unreachable right now.", {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  // Set-Cookie is rebuilt one header at a time rather than copied with
  // the rest. A response can carry several, and collapsing them into one
  // comma-joined value — which a plain header copy can do — would break
  // the Institute's session cookie on sign-in.
  const responseHeaders = new Headers();
  for (const [name, value] of upstream.headers) {
    if (HOP_BY_HOP.has(name) || name === "set-cookie") continue;
    responseHeaders.append(name, value);
  }
  for (const cookie of upstream.headers.getSetCookie()) {
    responseHeaders.append("set-cookie", cookie);
  }

  // 204/304 and friends must not carry a body at all; constructing a
  // Response with one throws.
  const bodiless = new Set([101, 103, 204, 205, 304]);

  return new Response(bodiless.has(upstream.status) ? null : upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const HEAD = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
