"use client";

import { useMemo, useState } from "react";
import { calculate, type Inputs } from "@/lib/calc";
import { CardDisclaimer } from "@/components/card-disclaimer";
import { ShareBar } from "@/components/share-bar";
import { PUBLIC_URL, resultHeadline, resultPath } from "@/lib/share";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const levelColor = { HIGH: "text-rose-300", MED: "text-amber", LOW: "text-teal-200" } as const;

type Field = { key: keyof Inputs; label: string; help: string; suffix?: string };

const fields: Field[] = [
  { key: "rooms", label: "Rooms", help: "Rooms or units you sell" },
  { key: "adr", label: "Average nightly rate", help: "Any currency, used for every money figure" },
  { key: "occupancy", label: "Occupancy", help: "Average over the year", suffix: "%" },
  { key: "otaShare", label: "Revenue from OTAs", help: "Booking.com, Expedia, Agoda, Rakuten, etc.", suffix: "%" },
  { key: "commission", label: "Average OTA commission", help: "Check your contracts; often around 15–25%", suffix: "%" },
  { key: "directCost", label: "Cost of a direct booking", help: "Card fees, booking engine, ads", suffix: "%" },
  { key: "shift", label: "OTA bookings you move to direct", help: "Repeat guests, locals, phone bookings", suffix: "%" },
];

const defaults: Record<keyof Inputs, string> = {
  rooms: "20",
  adr: "120",
  occupancy: "70",
  otaShare: "60",
  commission: "18",
  directCost: "3",
  shift: "20",
};

export type CalculatorInitial = Record<keyof Inputs, string>;

export function Calculator({ initial }: { initial?: CalculatorInitial }) {
  const [v, setV] = useState<CalculatorInitial>(initial ?? defaults);
  const inputs = useMemo(
    () => Object.fromEntries(Object.entries(v).map(([k, x]) => [k, Number(x)])) as Inputs,
    [v],
  );
  const r = useMemo(() => calculate(inputs), [inputs]);
  const shareUrl = `${PUBLIC_URL}${resultPath(inputs)}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="rounded-3xl border border-line bg-panel/60 p-5 sm:p-6">
        <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">Your hotel</p>
        <ul className="mt-4 divide-y divide-line">
          {fields.map((f) => (
            <li key={f.key} className="flex items-center justify-between gap-4 py-3">
              <label htmlFor={`f-${f.key}`} className="min-w-0">
                <span className="block text-sm font-medium text-foreground">{f.label}</span>
                <span className="block text-xs text-muted">{f.help}</span>
              </label>
              <div className="flex items-center gap-1 text-muted">
                <input
                  id={`f-${f.key}`}
                  inputMode="decimal"
                  value={v[f.key]}
                  onChange={(e) => setV((s) => ({ ...s, [f.key]: e.target.value.replace(/[^0-9.]/g, "") }))}
                  className="w-24 rounded-xl border border-line bg-black/40 px-3 py-2 text-right font-mono text-sm text-foreground focus:border-amber"
                />
                <span className="w-4 font-mono text-sm">{f.suffix ?? ""}</span>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted">
          {initial ? "Pre-filled from a shared link. Change any number to see your own." : "Pre-filled with an example 20-room hotel. Replace with your numbers."}
        </p>
      </div>

      <article
        data-testid="result-card"
        className="relative flex flex-col overflow-hidden rounded-3xl border border-line bg-black/50 lg:sticky lg:top-16 lg:self-start"
      >
        <div className="p-5 sm:p-7">
          <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">Commission burden</p>
          <h2 className={`mt-2 font-display text-5xl ${levelColor[r.level]}`}>
            {r.roomRevenue > 0 ? r.level : "—"}
          </h2>
          <p className="mt-3 text-lg font-medium text-foreground">{r.headline}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{r.summary}</p>

          {r.roomRevenue > 0 && (
            <>
              <div className="mt-5 rounded-2xl border border-rose-300/30 bg-rose-300/5 p-4">
                <p className="text-xs text-muted">Paid to OTAs per year</p>
                <p className="font-mono text-3xl text-rose-200">{fmt(r.commissionPaid)}</p>
                <p className="mt-1 text-xs text-muted">That&apos;s about {fmt(r.commissionPerDay)} every single day.</p>
              </div>
              <div className="mt-3 rounded-2xl border border-teal-200/30 bg-teal-200/5 p-4">
                <p className="text-xs text-muted">Kept per year by moving {v.shift || 0}% of OTA bookings to direct</p>
                <p className="font-mono text-3xl text-teal-100">{fmt(r.savings)}</p>
                <p className="mt-1 text-xs text-muted">After your direct-booking costs.</p>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-line p-3">
                  <dt className="text-xs text-muted">Room nights / yr</dt>
                  <dd className="font-mono text-foreground">{fmt(r.roomNights)}</dd>
                </div>
                <div className="rounded-2xl border border-line p-3">
                  <dt className="text-xs text-muted">Room revenue / yr</dt>
                  <dd className="font-mono text-foreground">{fmt(r.roomRevenue)}</dd>
                </div>
              </dl>
              <div className="mt-6 border-t border-line pt-4" data-testid="share-result">
                <p className="text-xs text-muted">
                  Share this result. The link carries your numbers, so anyone who opens it sees the same math.
                  Nothing is stored.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <ShareBar url={shareUrl} text={`My hotel pays about ${resultHeadline(r)}. Free calculator:`} />
                  <a href={resultPath(inputs)} className="text-sm text-muted underline underline-offset-2 hover:text-foreground">
                    Open result page
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
        <CardDisclaimer />
      </article>
    </div>
  );
}
