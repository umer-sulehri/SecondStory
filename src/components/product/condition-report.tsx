import { Check, AlertTriangle, ShieldCheck } from "lucide-react";
import type { ConditionReport as Report } from "@/types";
import { Badge } from "@/components/ui/badge";

export function ConditionReport({ report }: { report: Report }) {
  const flags = [
    { label: "Authenticity verified", value: report.authenticityVerified, good: true },
    { label: "Has stains", value: report.stains, good: false },
    { label: "Has scratches", value: report.scratches, good: false },
    { label: "Has repairs", value: report.repairs, good: false },
  ].filter((f) => f.value);

  return (
    <div className="rounded-3xl border border-border bg-surface p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Condition report</h3>
        <Badge variant="primary">{report.rating}</Badge>
      </div>

      {flags.length > 0 && (
        <ul className="mt-4 space-y-2">
          {flags.map((flag) => (
            <li key={flag.label} className="flex items-center gap-2 text-sm">
              {flag.good ? (
                <ShieldCheck className="size-4 text-success" />
              ) : (
                <AlertTriangle className="size-4 text-warning" />
              )}
              <span className="text-text-secondary">{flag.label}</span>
            </li>
          ))}
        </ul>
      )}

      {report.notes && (
        <p className="mt-4 rounded-2xl bg-background p-4 text-sm text-text-secondary">
          {report.notes}
        </p>
      )}
    </div>
  );
}
