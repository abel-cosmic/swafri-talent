import { cn } from "@/lib/utils"

type PageWrapperProps = {
  title?: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function PageWrapper({ title, description, actions, children, className }: PageWrapperProps) {
  return (
    <section className={cn("mx-auto w-full min-w-0 space-y-6", className)}>
      {title || description || actions ? (
        <header className="rounded-2xl border border-border bg-card p-5 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              {title ? <h1 className="font-display text-display-lg">{title}</h1> : null}
              {description ? <p className="max-w-3xl text-[1.05rem] text-muted-foreground">{description}</p> : null}
            </div>
            {actions ? <div>{actions}</div> : null}
          </div>
        </header>
      ) : null}
      <div className="min-w-0">{children}</div>
    </section>
  )
}
