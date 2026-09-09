import Link from 'next/link'

/** Shared frame for the four signed-out pages under /team. */
export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 block text-center font-display text-lg font-semibold tracking-tight text-foreground"
        >
          Olive Clinical
        </Link>
        <div className="rounded-lg border border-border bg-card p-6 shadow-xs">
          <h1 className="font-display text-lg font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
          )}
          <div className="mt-5">{children}</div>
        </div>
        {footer && <div className="mt-4 text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </main>
  )
}
