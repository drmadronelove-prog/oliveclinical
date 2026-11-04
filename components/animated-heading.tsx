export function AnimatedHeading() {
  return (
    <p
      className="text-2xl sm:text-3xl font-normal leading-snug max-w-lg text-foreground"
      style={{
        fontFamily: "var(--font-body)",
        textShadow: "0 1px 6px rgba(251,248,243,0.6)",
      }}
    >
      psychotherapy, couples therapy, and assessment for people who{" "}
      <span className="whitespace-nowrap">
        think{" "}
        <span
          className="italic"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            color: "#946284",
          }}
        >
          different
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            color: "#946284",
          }}
        >
          .
        </span>
      </span>
    </p>
  )
}
