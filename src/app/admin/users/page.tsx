import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface ProfileRow {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  created_at: string;
}

async function getUsers(): Promise<ProfileRow[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("id, name, email, role, created_at")
      .order("created_at", { ascending: false });
    return (data as ProfileRow[]) ?? [];
  } catch {
    return [];
  }
}

export default async function AdminUsers() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="mt-1 text-text-secondary">{users.length} registered users</p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-border bg-surface">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-text-secondary">
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-slate-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-primary-light font-semibold text-primary">
                      {(u.name ?? u.email ?? "?").charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="font-medium">{u.name ?? "—"}</p>
                      <p className="text-xs text-text-secondary">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant={u.role === "admin" ? "dark" : "neutral"}>{u.role}</Badge>
                </td>
                <td className="p-4 text-text-secondary">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="p-8 text-center text-text-secondary">No users found.</p>
        )}
      </div>
    </div>
  );
}
