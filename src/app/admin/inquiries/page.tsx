import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

interface InquiryRow {
  id: string;
  name: string;
  address: string;
  phone: string;
  quantity: number;
  color_selected: string | null;
  created_at: string;
  products: {
    name: string;
    thumbnail: string;
    selling_price: number;
  } | null;
}

export default async function AdminInquiries() {
  const supabase = await createClient();

  const { data: inquiries, error } = await supabase
    .from("order_inquiries")
    .select(`
      id,
      name,
      address,
      phone,
      quantity,
      color_selected,
      created_at,
      products (
        name,
        thumbnail,
        selling_price
      )
    `)
    .order("created_at", { ascending: false });

  const rows = (inquiries as unknown as InquiryRow[]) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Buy Now Inquiries</h1>
        <p className="mt-1 text-text-secondary">
          {rows.length} {rows.length === 1 ? "inquiry" : "inquiries"} received
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load inquiries: {error.message}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="grid place-items-center rounded-3xl border border-dashed border-border py-20 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-primary-light text-primary">
            <ShoppingBag className="size-7" />
          </span>
          <p className="mt-4 font-medium text-text-primary">No inquiries yet</p>
          <p className="text-sm text-text-secondary">When customers click "Buy Now" and fill the form, they appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-border bg-surface">
          <table className="w-full min-w-[800px] text-sm text-left">
            <thead>
              <tr className="border-b border-border text-text-secondary">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Customer Details</th>
                <th className="p-4 font-semibold">Address</th>
                <th className="p-4 font-semibold">Color / Qty</th>
                <th className="p-4 font-semibold">Inquiry Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0 hover:bg-slate-50">
                  <td className="p-4">
                    {row.products ? (
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 overflow-hidden rounded-xl border border-border">
                          <img
                            src={row.products.thumbnail}
                            alt={row.products.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-text-primary max-w-xs truncate">{row.products.name}</p>
                          <p className="text-xs text-text-secondary">{formatPrice(row.products.selling_price)}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-text-secondary italic">Product deleted</span>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-text-primary">{row.name}</p>
                    <p className="text-xs text-text-secondary">{row.phone}</p>
                  </td>
                  <td className="p-4 max-w-xs">
                    <p className="text-text-primary leading-snug break-words">{row.address}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-text-primary">Qty: {row.quantity}</span>
                      {row.color_selected ? (
                        <span className="inline-flex max-w-fit items-center rounded-full bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
                          {row.color_selected}
                        </span>
                      ) : (
                        <span className="text-xs text-text-secondary">—</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-text-secondary">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
