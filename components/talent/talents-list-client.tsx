"use client"

import { TalentStatus } from "@/generated/prisma/browser"
import { useEffect, useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"

import { TalentCard } from "@/components/talent/talent-card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useTalentsQuery } from "@/lib/query-hooks"

type TalentSearchValues = {
  search: string
  skill: string
  minYears: string
}

export function TalentsListClient({
  page,
  search,
  skill,
  minYears,
}: {
  page: number
  search: string
  skill: string
  minYears: number | undefined
}) {
  const form = useForm<TalentSearchValues>({
    defaultValues: {
      search,
      skill,
      minYears: typeof minYears === "number" ? String(minYears) : "",
    },
  })
  const [currentPage, setCurrentPage] = useState(page)
  const searchValue = useWatch({ control: form.control, name: "search" }) ?? ""
  const skillValue = useWatch({ control: form.control, name: "skill" }) ?? ""
  const minYearsValue = useWatch({ control: form.control, name: "minYears" }) ?? ""
  const [debouncedFilters, setDebouncedFilters] = useState({ search: searchValue, skill: skillValue, minYears: minYearsValue })

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedFilters({ search: searchValue, skill: skillValue, minYears: minYearsValue })
      setCurrentPage(1)
    }, 350)

    return () => window.clearTimeout(timeout)
  }, [minYearsValue, searchValue, skillValue])

  const parsedMinYears = useMemo(() => {
    const value = Number(debouncedFilters.minYears)
    return Number.isFinite(value) && value >= 0 ? value : undefined
  }, [debouncedFilters.minYears])

  const { data, isLoading, isError } = useTalentsQuery({
    page: currentPage,
    search: debouncedFilters.search,
    skill: debouncedFilters.skill,
    minYears: parsedMinYears,
    status: TalentStatus.APPROVED,
    adminView: false,
  })
  const items = data?.items ?? []
  const total = data?.total ?? 0
  const hasNext = currentPage * 10 < total

  return (
    <>
      <Form {...form}>
        <form className="my-4 grid gap-3 rounded-xl border border-border/80 bg-card p-3 shadow-(--cursor-shadow-ambient) md:grid-cols-3">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Search</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Name, skill, or email" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="skill"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Filter Skill</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. UI/UX, Backend" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minYears"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Experience</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min={0} placeholder="0" />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
      {isLoading ? <p className="text-sm text-muted-foreground">Loading talents...</p> : null}
      {isError ? <p className="text-destructive">Failed to load talents.</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((talent) => (
          <TalentCard key={talent.id} talent={talent} />
        ))}
      </div>
      <div className="mt-7 flex gap-3">
        <Button variant="secondary" disabled={currentPage <= 1} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
          Previous
        </Button>
        <Button variant="secondary" disabled={!hasNext} onClick={() => setCurrentPage((prev) => prev + 1)}>
          Next
        </Button>
      </div>
    </>
  )
}
