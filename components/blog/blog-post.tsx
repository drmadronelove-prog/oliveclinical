import React from "react"
import { ExpandableImage } from "@/components/blog/expandable-image"

// ── Types ─────────────────────────────────────────────────────────────────────

export type Block =
  | { type: "paragraph"; text: string; dropCap?: boolean }
  | { type: "heading"; text: string }
  | { type: "pull-quote"; text: string }
  | { type: "footer-note"; text: string }
  | { type: "callout"; heading: string; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt?: string; caption?: string }

export type BlogPost = {
  slug: string
  title: string
  subtitle?: string
  author: string
  credential: string
  category: string
  date?: string
  blocks: Block[]
}

// ── Olive Clinical settled palette tokens ────────────────────────────────────
const C = {
  ink:    "#0b2545",
  paper:  "#f7f7f7",
  linen:  "#e8e8e8",
  mist:   "#8c9bb0",
  slate:  "#5b6e88",
  plum:   "#7a4f6e",
  rule:   "rgba(11,37,69,0.18)",
  inkSoft: "rgba(11,37,69,0.65)",
  inkMute: "rgba(11,37,69,0.5)",
} as const

// ── Renderer ──────────────────────────────────────────────────────────────────

export function BlogPostArticle({ post }: { post: BlogPost }) {
  return (
    <article
      className="max-w-2xl mx-auto space-y-8"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Header */}
      <header
        className="space-y-5 pb-8"
        style={{ borderBottom: `1px solid ${C.rule}` }}
      >
        {/* Category eyebrow */}
        <div
          className="text-[0.7rem]"
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: C.slate,
          }}
        >
          {post.category}
        </div>

        {/* Title */}
        <h1
          className="text-4xl sm:text-5xl leading-[1.05] tracking-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            letterSpacing: "-0.025em",
            color: C.ink,
          }}
        >
          {post.title}
        </h1>

        {/* Subtitle */}
        {post.subtitle && (
          <p
            className="text-lg sm:text-xl italic leading-snug"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              color: C.inkSoft,
            }}
          >
            {post.subtitle}
          </p>
        )}

        {/* Byline */}
        <div
          className="flex items-center gap-2 pt-1 text-[0.78rem]"
          style={{
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.06em",
            color: C.slate,
          }}
        >
          <span style={{ color: C.ink }}>{post.author}</span>
          <span style={{ color: C.mist }}>·</span>
          <span>{post.credential}</span>
          {post.date && (
            <>
              <span style={{ color: C.mist }}>·</span>
              <span>{post.date}</span>
            </>
          )}
        </div>
      </header>

      {/* Body blocks */}
      <div className="space-y-6">
        {post.blocks.map((block, i) => {
          switch (block.type) {
            case "paragraph":
              return (
                <p
                  key={i}
                  className={`leading-relaxed text-[1.05rem]${block.dropCap ? " prose-drop-cap-bg" : ""}`}
                  style={{ color: C.ink }}
                >
                  {block.text}
                </p>
              )

            case "heading":
              return (
                <h2
                  key={i}
                  className="text-2xl sm:text-3xl tracking-tight pt-4"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    letterSpacing: "-0.018em",
                    color: C.ink,
                  }}
                >
                  {block.text}
                </h2>
              )

            case "pull-quote":
              return (
                <blockquote
                  key={i}
                  className="pl-6 py-2 my-10"
                  style={{ borderLeft: `3px solid ${C.plum}` }}
                >
                  <p
                    className="text-xl sm:text-2xl italic leading-snug"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 400,
                      color: C.plum,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {block.text}
                  </p>
                </blockquote>
              )

            case "footer-note":
              return (
                <footer
                  key={i}
                  className="mt-12 pt-6 text-sm leading-relaxed"
                  style={{
                    borderTop: `1px solid ${C.rule}`,
                    color: C.inkSoft,
                  }}
                >
                  <p>{block.text}</p>
                </footer>
              )

            case "callout":
              return (
                <aside
                  key={i}
                  className="px-6 py-5 my-8"
                  style={{ backgroundColor: C.linen }}
                >
                  <p
                    className="text-[0.7rem] mb-3"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: 500,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: C.slate,
                    }}
                  >
                    {block.heading}
                  </p>
                  <p
                    className="text-[0.98rem] leading-relaxed"
                    style={{ color: C.ink }}
                  >
                    {block.text}
                  </p>
                </aside>
              )

            case "list":
              return (
                <ul key={i} className="space-y-2.5 my-4">
                  {block.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex gap-3 text-[1.05rem] leading-relaxed"
                      style={{ color: C.ink }}
                    >
                      <span
                        className="mt-2.5 h-1 w-1 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: C.slate }}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )

            case "image":
              return (
                <ExpandableImage
                  key={i}
                  src={block.src}
                  alt={block.alt}
                  caption={block.caption}
                />
              )

            default:
              return null
          }
        })}
      </div>
    </article>
  )
}
