"use client"

import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, type ColumnDef, type ColumnFiltersState, type SortingState, useReactTable } from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { TalentStatus, type TalentProfile } from "@/generated/prisma/browser"
import { useCallback, useMemo, useState, useTransition } from "react"
import { toast } from "sonner"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
  const [menuAction, setMenuAction] = useState<{ kind: "approve" | "reject" | "delete"; row: TalentProfile } | null>(null)
  const { approve, reject, remove } = useTalentMutations();

  function runAction(handler: () => Promise<{ success: boolean; error?: string }>, successMessage = "Action completed.") {
    startTransition(async () => {
      const res = await handler();
      if (!res.success) toast.error(res.error ?? "Action failed.");
      else toast.success(successMessage);
    });
  }

  const renderActions = useCallback(
    (row: TalentProfile) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={`Open actions for ${row.fullName}`}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {canApprove ? (
            <DropdownMenuItem onSelect={() => setMenuAction({ kind: "approve", row })}>Approve</DropdownMenuItem>
          ) : null}
          {canReject ? (
            <DropdownMenuItem onSelect={() => setMenuAction({ kind: "reject", row })}>Reject</DropdownMenuItem>
          ) : null}
          {canUpdate ? (
            <DropdownMenuItem asChild>
              <Link href={routeBuilders.adminTalentEdit(row.id)}>Edit</Link>
            </DropdownMenuItem>
          ) : null}
          {canDelete ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => setMenuAction({ kind: "delete", row })}>
                Delete
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    [canApprove, canDelete, canReject, canUpdate],
  )

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
        cell: ({ row }) => renderActions(row.original),
      },
    ],
    [renderActions],
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("fullName")?.setFilterValue(event.target.value)}
          className="w-full sm:max-w-sm"
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
      <div className="space-y-3 lg:hidden">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <div key={row.id} className="space-y-3 rounded-xl border border-border/80 bg-card p-4 shadow-(--cursor-shadow-ambient)">
              <div>
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="font-medium">{row.original.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="break-all">{row.original.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Skill</p>
                  <p>{row.original.primarySkill}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p>{row.original.yearsOfExperience}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <StatusBadge status={row.original.status} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p>{new Date(row.original.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs text-muted-foreground">Actions</p>
                {renderActions(row.original)}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-border/80 bg-card p-6 text-center text-sm text-muted-foreground shadow-(--cursor-shadow-ambient)">
            No records found.
          </div>
        )}
      </div>
      <div className="hidden lg:block">
        <Table className="min-w-[900px]">
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
                <TableCell className="h-20 text-center" colSpan={table.getVisibleLeafColumns().length}>
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
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
      <AlertDialog open={Boolean(menuAction)} onOpenChange={(open) => (!open ? setMenuAction(null) : null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {menuAction?.kind === "approve"
                ? "Approve Submission"
                : menuAction?.kind === "reject"
                  ? "Reject Submission"
                  : "Delete Submission"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {menuAction?.kind === "approve"
                ? `Approve ${menuAction.row.fullName}'s submission?`
                : menuAction?.kind === "reject"
                  ? `Reject ${menuAction.row.fullName}'s submission?`
                  : `Delete ${menuAction?.row.fullName}'s submission? This cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={menuAction?.kind === "delete" ? "destructive" : "default"}
              disabled={!menuAction || isPending}
              onClick={() => {
                if (!menuAction) return
                if (menuAction.kind === "approve") {
                  runAction(() => approve.mutateAsync(menuAction.row.id), "Submission approved.")
                } else if (menuAction.kind === "reject") {
                  runAction(() => reject.mutateAsync(menuAction.row.id), "Submission rejected.")
                } else {
                  runAction(() => remove.mutateAsync(menuAction.row.id), "Submission deleted.")
                }
                setMenuAction(null)
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
