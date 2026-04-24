"use client"

import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, type ColumnDef, type ColumnFiltersState, type SortingState, useReactTable } from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { useCallback, useMemo, useState, useTransition } from "react"
import { toast } from "sonner"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

type UserRole = "superAdmin" | "admin" | "moderator" | "user"

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
  const [menuAction, setMenuAction] = useState<{ kind: "ban" | "delete"; user: UserRecord } | null>(null)
  const [roleDialogUser, setRoleDialogUser] = useState<UserRecord | null>(null)
  const [selectedRole, setSelectedRole] = useState<UserRole>("user")
  const { setRole, ban, remove } = useUserMutations()

  function doAction(fn: () => Promise<{ success: boolean; error?: string }>, successMessage = "Action completed") {
    startTransition(async () => {
      const result = await fn()
      if (!result.success) toast.error(result.error ?? "Action failed")
      else toast.success(successMessage)
    })
  }

  const openSetRoleDialog = useCallback((user: UserRecord) => {
    setRoleDialogUser(user)
    setSelectedRole((user.role as UserRole | undefined) ?? "user")
  }, [])

  const renderActionMenu = useCallback(
    (user: UserRecord) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={`Open actions for ${user.name}`}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {canSetRole ? (
            <DropdownMenuItem onSelect={() => openSetRoleDialog(user)}>
              Set Role
            </DropdownMenuItem>
          ) : null}
          {canBan ? (
            <DropdownMenuItem onSelect={() => setMenuAction({ kind: "ban", user })}>
              Ban User
            </DropdownMenuItem>
          ) : null}
          {canDelete ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => setMenuAction({ kind: "delete", user })}>
                Delete User
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    [canBan, canDelete, canSetRole, openSetRoleDialog],
  )

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
        cell: ({ row }) => renderActionMenu(row.original),
      },
    ],
    [renderActionMenu],
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
          placeholder="Filter by email..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
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
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium">{row.original.name}</p>
                </div>
                {renderActionMenu(row.original)}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="break-all">{row.original.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <Badge variant="secondary">{row.original.role ?? "user"}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Banned</p>
                  <p>{row.original.banned ? "Yes" : "No"}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p>{row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : "-"}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-border/80 bg-card p-6 text-center text-sm text-muted-foreground shadow-(--cursor-shadow-ambient)">
            No users found.
          </div>
        )}
      </div>
      <div className="hidden lg:block">
        <Table className="min-w-[760px]">
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
                  No users found.
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
      <Dialog open={Boolean(roleDialogUser)} onOpenChange={(open) => (!open ? setRoleDialogUser(null) : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set User Role</DialogTitle>
            <DialogDescription>
              Choose a new role for <span className="font-medium">{roleDialogUser?.email ?? ""}</span>.
            </DialogDescription>
          </DialogHeader>
          <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">user</SelectItem>
              <SelectItem value="moderator">moderator</SelectItem>
              <SelectItem value="admin">admin</SelectItem>
              <SelectItem value="superAdmin">superAdmin</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRoleDialogUser(null)}
            >
              Cancel
            </Button>
            <Button
              disabled={!roleDialogUser || isPending}
              onClick={() => {
                if (!roleDialogUser) return
                doAction(
                  () => setRole.mutateAsync({ userId: roleDialogUser.id, role: selectedRole }),
                  "Role updated",
                )
                setRoleDialogUser(null)
              }}
            >
              Save Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={Boolean(menuAction)} onOpenChange={(open) => (!open ? setMenuAction(null) : null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {menuAction?.kind === "delete" ? "Delete User" : "Ban User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {menuAction?.kind === "delete"
                ? `Delete ${menuAction.user.email}? This cannot be undone.`
                : `Ban ${menuAction?.user.email}? They will lose access until unbanned.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={menuAction?.kind === "delete" ? "destructive" : "default"}
              disabled={!menuAction || isPending}
              onClick={() => {
                if (!menuAction) return
                if (menuAction.kind === "delete") {
                  doAction(() => remove.mutateAsync(menuAction.user.id), "User deleted")
                } else {
                  doAction(() => ban.mutateAsync({ userId: menuAction.user.id }), "User banned")
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
