"use client"

import { useState } from "react"

export function ExpandableImage({
  src,
  alt,
  caption,
}: {
  src: string
  alt?: string
  caption?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <figure className="my-10">
        <div
          className="relative group cursor-zoom-in overflow-hidden"
          style={{ borderRadius: 6 }}
          onClick={() => setOpen(true)}
          role="button"
          aria-label="Expand diagram"
        >
          <img
            src={src}
            alt={alt ?? ""}
            style={{ width: "100%", display: "block" }}
          />
          <div
            className="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: "linear-gradient(to top left, rgba(0,0,0,0.18), transparent)" }}
          >
            <span
              className="text-[0.68rem] font-mono tracking-widest text-white bg-black/40 px-2 py-1 rounded"
              style={{ letterSpacing: "0.12em" }}
            >
              EXPAND
            </span>
          </div>
        </div>
        {caption && (
          <figcaption
            className="mt-3 text-center text-[0.78rem]"
            style={{
              fontFamily: "var(--font-mono)",
              color: "rgba(11,37,69,0.5)",
              letterSpacing: "0.04em",
            }}
          >
            {caption}
          </figcaption>
        )}
      </figure>

      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          style={{ background: "rgba(11,37,69,0.82)", backdropFilter: "blur(6px)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-w-[95vw] max-h-[92vh] overflow-auto"
            style={{ borderRadius: 8, boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt ?? ""}
              style={{ display: "block", maxWidth: "none", width: "min(2450px, 95vw)" }}
            />
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-[0.7rem] font-mono tracking-widest bg-black/50 text-white px-3 py-1.5 rounded hover:bg-black/70 transition-colors"
              style={{ letterSpacing: "0.12em" }}
            >
              CLOSE ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}
