import Link from "next/link";
import { SettingsPanel } from "@/components/dashboard/settings-panel";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-text-secondary">
          Manage notifications and your account.
        </p>
      </div>

      <SettingsPanel />

      <div className="rounded-3xl border border-border bg-surface p-6">
        <h2 className="font-semibold">Account</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/dashboard/profile"
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
          >
            Edit profile
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
