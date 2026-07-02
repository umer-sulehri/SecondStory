"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "@/store/toast";

function Toggle({
  label,
  description,
  defaultOn = true,
}: {
  label: string;
  description: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn((v) => !v)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          on ? "bg-primary" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${
            on ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export function SettingsPanel() {
  function deleteAccount() {
    toast.info("Account deletion requires confirmation. Contact support to proceed.");
  }

  return (
    <>
      <div className="rounded-3xl border border-border bg-surface p-6">
        <h2 className="font-semibold">Notifications</h2>
        <div className="mt-2 divide-y divide-border">
          <Toggle label="New products" description="Get notified about fresh drops." />
          <Toggle label="Featured drops" description="Curated highlights each week." />
          <Toggle label="AI generation status" description="When your try-on is ready." />
          <Toggle label="Email newsletter" description="Occasional updates and offers." defaultOn={false} />
        </div>
      </div>

      <div className="rounded-3xl border border-error/30 bg-red-50/50 p-6">
        <h2 className="font-semibold text-error">Danger zone</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Permanently delete your account and all associated data.
        </p>
        <button
          onClick={deleteAccount}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-error px-4 py-2.5 text-sm font-medium text-error transition-colors hover:bg-error hover:text-white"
        >
          <Trash2 className="size-4" />
          Delete account
        </button>
      </div>
    </>
  );
}
