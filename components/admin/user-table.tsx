"use client"

import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, type ColumnDef, type ColumnFiltersState, type SortingState, useReactTable } from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown } from "lucide-react"
import { useMemo, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useUserMutations } from "@/lib/query-hooks"

type UserRecord = {
  id: string
  name: string
  email: string
  role?: string
  banned?: boolean
  createdAt?: string | Date
}

function SetRoleControl({ userId, disabled, onSubmit }: { userId: string; disabled: boolean; onSubmit: (userId: string, role: "superAdmin" | "admin" | "moderator" | "user") => void }) {
  const form = useForm<{ role: "superAdmin" | "admin" | "moderator" | "user" }>({
    defaultValues: { role: "user" },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => onSubmit(userId, values.role))}
        className="inline-flex items-center gap-2"
      >
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="h-8 w-[122px]">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user">user</SelectItem>
                  <SelectItem value="moderator">moderator</SelectItem>
                  <SelectItem value="admin">admin</SelectItem>
                  <SelectItem value="superAdmin">superAdmin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button size="sm" disabled={disabled}>
          Set Role
        </Button>
      </form>
    </Form>
  )
}

export function UserTable({
  rows,
  canSetRole,
  canBan,
  canDelete,
}: {
  rows: UserRecord[];
  canSetRole: boolean;
  canBan: boolean;
  canDelete: boolean;
}) {
  const [isPending, startTransition] = useTransition()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({})
  const { setRole, ban, remove } = useUserMutations()

  function doAction(fn: () => Promise<{ success: boolean; error?: string }>) {
    startTransition(async () => {
      const result = await fn()
      if (!result.success) toast.error(result.error ?? "Action failed")
      else toast.success("Action completed")
    })
  }

  const columns = useMemo<ColumnDef<UserRecord>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown />
          </Button>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => <Badge variant="secondary">{row.original.role ?? "user"}</Badge>,
      },
      {
        accessorKey: "banned",
        header: "Banned",
        cell: ({ row }) => (row.original.banned ? "Yes" : "No"),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => (row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : "-"),
      },
      {
        id: "actions",
        enableHiding: false,
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            {canSetRole ? (
              <SetRoleControl
                userId={row.original.id}
                disabled={isPending}
                onSubmit={(userId, role) => doAction(() => setRole.mutateAsync({ userId, role }))}
              />
            ) : null}
            {canBan ? (
              <Button
                size="sm"
                variant="secondary"
                disabled={isPending}
                onClick={() => doAction(() => ban.mutateAsync({ userId: row.original.id }))}
              >
                Ban
              </Button>
            ) : null}
            {canDelete ? (
              <Button
                size="sm"
                variant="destructive"
                disabled={isPending}
                onClick={() => doAction(() => remove.mutateAsync(row.original.id))}
              >
                Delete
              </Button>
            ) : null}
          </div>
        ),
      },
    ],
    [ban, canBan, canDelete, canSetRole, isPending, remove, setRole],
  )

  const table = useReactTable({
    data: rows,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters, columnVisibility },
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          placeholder="Filter by email..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
          className="w-full max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Columns
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="h-20 text-center" colSpan={columns.length}>
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}
