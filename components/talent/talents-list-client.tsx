"use client"

import { TalentStatus } from "@/generated/prisma/browser"
import { useEffect, useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"

import { TalentCard } from "@/components/talent/talent-card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTalentsQuery } from "@/lib/query-hooks"

type TalentSearchValues = {
  search: string
  skill: string
  experienceRange: string
  hasResume: string
  hasImage: string
  sortBy: string
}

export function TalentsListClient({
  page,
  search,
  skill,
  minYears,
  maxYears,
  hasResume,
  hasImage,
  sortBy,
}: {
  page: number
  search: string
  skill: string
  minYears: number | undefined
  maxYears: number | undefined
  hasResume: boolean | undefined
  hasImage: boolean | undefined
  sortBy: string
}) {
  const defaultRange =
    typeof minYears === "number" && typeof maxYears === "number"
      ? `${minYears}-${maxYears}`
      : typeof minYears === "number" && minYears >= 10
        ? "10-plus"
        : "all"

  const form = useForm<TalentSearchValues>({
    defaultValues: {
      search,
      skill,
      experienceRange: defaultRange,
      hasResume: typeof hasResume === "boolean" ? (hasResume ? "yes" : "no") : "all",
      hasImage: typeof hasImage === "boolean" ? (hasImage ? "yes" : "no") : "all",
      sortBy,
    },
  })
  const [currentPage, setCurrentPage] = useState(page)
  const searchValue = useWatch({ control: form.control, name: "search" }) ?? ""
  const skillValue = useWatch({ control: form.control, name: "skill" }) ?? ""
  const experienceRangeValue = useWatch({ control: form.control, name: "experienceRange" }) ?? "all"
  const hasResumeValue = useWatch({ control: form.control, name: "hasResume" }) ?? "all"
  const hasImageValue = useWatch({ control: form.control, name: "hasImage" }) ?? "all"
  const sortByValue = useWatch({ control: form.control, name: "sortBy" }) ?? "newest"
  const [debouncedFilters, setDebouncedFilters] = useState({
    search: searchValue,
    skill: skillValue,
    experienceRange: experienceRangeValue,
    hasResume: hasResumeValue,
    hasImage: hasImageValue,
    sortBy: sortByValue,
  })

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedFilters({
        search: searchValue,
        skill: skillValue,
        experienceRange: experienceRangeValue,
        hasResume: hasResumeValue,
        hasImage: hasImageValue,
        sortBy: sortByValue,
      })
      setCurrentPage(1)
    }, 220)

    return () => window.clearTimeout(timeout)
  }, [experienceRangeValue, hasImageValue, hasResumeValue, searchValue, skillValue, sortByValue])

  const parsedExperience = useMemo(() => {
    switch (debouncedFilters.experienceRange) {
      case "0-2":
        return { minYears: 0, maxYears: 2 }
      case "3-5":
        return { minYears: 3, maxYears: 5 }
      case "6-9":
        return { minYears: 6, maxYears: 9 }
      case "10-plus":
        return { minYears: 10, maxYears: undefined }
      default:
        return { minYears: undefined, maxYears: undefined }
    }
  }, [debouncedFilters.experienceRange])

  const { data, isLoading, isError } = useTalentsQuery({
    page: currentPage,
    search: debouncedFilters.search,
    skill: debouncedFilters.skill === "all" ? "" : debouncedFilters.skill,
    minYears: parsedExperience.minYears,
    maxYears: parsedExperience.maxYears,
    hasResume:
      debouncedFilters.hasResume === "all" ? undefined : debouncedFilters.hasResume === "yes",
    hasImage: debouncedFilters.hasImage === "all" ? undefined : debouncedFilters.hasImage === "yes",
    sortBy: debouncedFilters.sortBy as "newest" | "oldest" | "experience_desc" | "experience_asc" | "name_asc" | "name_desc",
    status: TalentStatus.APPROVED,
    adminView: false,
  })
  const items = data?.items ?? []
  const total = data?.total ?? 0
  const hasNext = currentPage * 10 < total

  return (
    <>
      <Form {...form}>
        <form className="my-5 space-y-4 rounded-2xl border border-border bg-card p-4 md:p-5">
          <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">Filter Talent</p>
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Search by name, skill, or email</FormLabel>
                <FormControl>
                  <Input {...field} className="rounded-full bg-background/90" placeholder="Start typing a name, skill, or email" />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <FormField
              control={form.control}
              name="skill"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skill</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-10 w-full rounded-full bg-background/90">
                        <SelectValue placeholder="Any skill" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">Any skill</SelectItem>
                      <SelectItem value="React">React</SelectItem>
                      <SelectItem value="Node.js">Node.js</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experienceRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-10 w-full rounded-full bg-background/90">
                        <SelectValue placeholder="Any range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">Any range</SelectItem>
                      <SelectItem value="0-2">0 - 2 years</SelectItem>
                      <SelectItem value="3-5">3 - 5 years</SelectItem>
                      <SelectItem value="6-9">6 - 9 years</SelectItem>
                      <SelectItem value="10-plus">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hasResume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-10 w-full rounded-full bg-background/90">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">Any</SelectItem>
                      <SelectItem value="yes">Has resume</SelectItem>
                      <SelectItem value="no">No resume</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hasImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-10 w-full rounded-full bg-background/90">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">Any</SelectItem>
                      <SelectItem value="yes">Has image</SelectItem>
                      <SelectItem value="no">No image</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sortBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-10 w-full rounded-full bg-background/90">
                        <SelectValue placeholder="Newest" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="newest">Newest first</SelectItem>
                      <SelectItem value="oldest">Oldest first</SelectItem>
                      <SelectItem value="experience_desc">Most experienced</SelectItem>
                      <SelectItem value="experience_asc">Least experienced</SelectItem>
                      <SelectItem value="name_asc">Name A - Z</SelectItem>
                      <SelectItem value="name_desc">Name Z - A</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">{total} talents found</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                form.reset({
                  search: "",
                  skill: "all",
                  experienceRange: "all",
                  hasResume: "all",
                  hasImage: "all",
                  sortBy: "newest",
                })
              }
            >
              Clear all filters
            </Button>
          </div>
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
