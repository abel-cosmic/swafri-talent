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
    <section className={cn("mx-auto w-full space-y-4", className)}>
      {title || description || actions ? (
        <header className="space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              {title ? <h1 className="text-2xl font-semibold">{title}</h1> : null}
              {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
            </div>
            {actions ? <div>{actions}</div> : null}
          </div>
        </header>
      ) : null}
      <div>{children}</div>
    </section>
  )
}
