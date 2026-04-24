"use client"

import Link from "next/link"
import { LoaderCircle, Search } from "lucide-react"
import { TalentStatus } from "@/generated/prisma/browser"
import { useEffect, useState } from "react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useTalentsQuery } from "@/lib/query-hooks"
import { routeBuilders } from "@/lib/routes/builders"
import { getTalentProfileImage } from "@/lib/talent-artwork"

export function HomeTalentSearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query.trim())
    }, 250)

    return () => window.clearTimeout(timeout)
  }, [query])

  const { data, isLoading } = useTalentsQuery({
    page: 1,
    search: debouncedQuery,
    status: TalentStatus.APPROVED,
    adminView: false,
    sortBy: "newest",
  })

  const items = data?.items ?? []
  const hasSearch = debouncedQuery.length > 0

  return (
    <>
      <div className="relative sm:col-span-2">
        <Input
          value=""
          readOnly
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          placeholder="Search talent directory..."
          className="h-12 cursor-pointer rounded-full bg-background pl-11"
        />
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[min(94vw,980px)] gap-4 border border-border bg-card p-6 md:p-7">
          <DialogHeader className="space-y-1">
            <DialogTitle className="font-display text-lg">Search Talents</DialogTitle>
            <DialogDescription>Type a name, skill, or email to quickly find a profile.</DialogDescription>
          </DialogHeader>

          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="e.g. React, talent@example.com, Jane"
            className="rounded-full"
          />

          <div className="max-h-104 space-y-3 overflow-y-auto pr-1">
            {isLoading && hasSearch ? (
              <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <LoaderCircle className="size-4 animate-spin" />
                Searching talents...
              </p>
            ) : null}

            {!hasSearch ? <p className="text-sm text-muted-foreground">Start typing to search approved talents.</p> : null}

            {hasSearch && !isLoading && items.length === 0 ? (
              <p className="text-sm text-muted-foreground">No talents found for "{debouncedQuery}".</p>
            ) : null}

            {hasSearch ? (
              <div className="grid gap-3 md:grid-cols-2">
                {items.map((talent) => (
                  <Link
                    key={talent.id}
                    href={routeBuilders.talentDetail(talent.id)}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/60"
                  >
                    <img
                      src={getTalentProfileImage(talent.profileImageUrl)}
                      alt={`${talent.fullName} profile`}
                      className="size-14 rounded-lg border border-border object-cover"
                    />
                    <div className="min-w-0 space-y-0.5">
                      <p className="truncate text-sm text-foreground">{talent.fullName}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {talent.primarySkill} - {talent.yearsOfExperience} years
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
