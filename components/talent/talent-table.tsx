"use client"

import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, type ColumnDef, type ColumnFiltersState, type SortingState, useReactTable } from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown } from "lucide-react"
import Link from "next/link"
import { TalentStatus, type TalentProfile } from "@/generated/prisma/browser"
import { useMemo, useState, useTransition } from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTalentMutations } from "@/lib/query-hooks"
import { routeBuilders } from "@/lib/routes/builders"

function StatusBadge({ status }: { status: TalentStatus }) {
  if (status === "APPROVED") return <Badge className="bg-(--cursor-success)/15 text-(--cursor-success)">APPROVED</Badge>
  if (status === "REJECTED") return <Badge className="bg-destructive/15 text-destructive">REJECTED</Badge>
  return <Badge className="bg-(--cursor-orange)/15 text-(--cursor-orange)">PENDING</Badge>
}

export function TalentTable({
  rows,
  canApprove,
  canReject,
  canUpdate,
  canDelete,
}: {
  rows: TalentProfile[];
  canApprove: boolean;
  canReject: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({})
  const { approve, reject, remove } = useTalentMutations();

  function runAction(handler: () => Promise<{ success: boolean; error?: string }>) {
    startTransition(async () => {
      const res = await handler();
      if (!res.success) toast.error(res.error ?? "Action failed.");
      else toast.success("Action completed.");
    });
  }

  const columns = useMemo<ColumnDef<TalentProfile>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: ({ column }) => (
          <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Full Name
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => row.original.fullName,
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "primarySkill",
        header: "Primary Skill",
      },
      {
        accessorKey: "yearsOfExperience",
        header: "Experience",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "createdAt",
        header: "Submitted",
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
      },
      {
        id: "actions",
        enableHiding: false,
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            {canApprove ? (
              <Button size="sm" disabled={isPending} onClick={() => runAction(() => approve.mutateAsync(row.original.id))}>
                Approve
              </Button>
            ) : null}
            {canReject ? (
              <Button
                size="sm"
                variant="secondary"
                disabled={isPending}
                onClick={() => runAction(() => reject.mutateAsync(row.original.id))}
              >
                Reject
              </Button>
            ) : null}
            {canUpdate ? (
              <Button size="sm" variant="ghost" asChild>
                <Link href={routeBuilders.adminTalentEdit(row.original.id)}>Edit</Link>
              </Button>
            ) : null}
            {canDelete ? (
              <Button
                size="sm"
                variant="destructive"
                disabled={isPending}
                onClick={() => runAction(() => remove.mutateAsync(row.original.id))}
              >
                Delete
              </Button>
            ) : null}
          </div>
        ),
      },
    ],
    [approve, canApprove, canDelete, canReject, canUpdate, isPending, reject, remove],
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
          placeholder="Filter by name..."
          value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("fullName")?.setFilterValue(event.target.value)}
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
                No records found.
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
