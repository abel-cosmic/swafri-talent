import Link from "next/link";

export function AdminNav({ role }: { role?: string | null }) {
  const canSeeUsers = role === "superAdmin" || role === "admin";

  return (
    <nav className="space-y-2">
      <Link href="/admin" className="block rounded px-3 py-2 hover:bg-muted">
        Dashboard
      </Link>
      {canSeeUsers ? (
        <Link href="/admin/users" className="block rounded px-3 py-2 hover:bg-muted">
          User Management
        </Link>
      ) : null}
    </nav>
  );
}
