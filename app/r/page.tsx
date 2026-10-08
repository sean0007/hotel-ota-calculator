import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Calculator } from "@/components/calculator";
import { calculate } from "@/lib/calc";
import {
  PARAMS,
  PUBLIC_URL,
  fmtMoney,
  fmtPct,
  hasResult,
  isExample,
  ogPath,
  parseResultParams,
  resultHeadline,
  resultPath,
} from "@/lib/share";
import { DISCLAIMER_SHORT, HONESTY } from "@/lib/site";

type SP = Promise<Record<string, string | string[] | undefined>>;

const levelColor = { HIGH: "text-rose-300", MED: "text-amber", LOW: "text-teal-200" } as const;

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const inputs = parseResultParams(await searchParams);
  if (!hasResult(inputs)) return { title: "Your result", robots: { index: false, follow: true } };
  const r = calculate(inputs);
  const title = resultHeadline(r);
  const description = `${inputs.rooms} rooms at ${fmtMoney(inputs.adr)} a night, ${inputs.occupancy}% occupancy, ${inputs.otaShare}% from OTAs at ${inputs.commission}% commission: about ${fmtMoney(r.commissionPerDay)} a day to OTAs (burden ${r.level}). Moving ${inputs.shift}% of OTA bookings to direct keeps about ${fmtMoney(r.savings)} a year. Estimate only; check your OTA contract. Free calculator, no login.`;
  const url = `${PUBLIC_URL}${resultPath(inputs)}`;
  const image = ogPath(inputs);
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: isExample(inputs) ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title: `Hotel OTA Commission Calculator · ${title}`,
      description,
      type: "website",
      url,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title: `Hotel OTA Commission Calculator · ${title}`, description, images: [image] },
  };
}

export default async function ResultPage({ searchParams }: { searchParams: SP }) {
  const inputs = parseResultParams(await searchParams);
  if (!hasResult(inputs)) redirect("/");
  const r = calculate(inputs);
  const initial = Object.fromEntries(PARAMS.map((k) => [k, String(inputs[k])])) as Record<(typeof PARAMS)[number], string>;
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <section className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Shared result · Hotel OTA Commission Calculator</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          <span className="text-rose-200">{fmtMoney(r.commissionPaid)}</span> a year in OTA commission{" "}
          <span className={levelColor[r.level]}>({fmtPct(r.commissionShareOfRevenue)} of room revenue)</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          {r.headline}. {r.summary}
        </p>
        <p className="mt-3 text-sm text-muted">
          {inputs.rooms} rooms · rate {fmtMoney(inputs.adr)} · {inputs.occupancy}% occupancy · {inputs.otaShare}% from OTAs ·{" "}
          {inputs.commission}% commission · about {fmtMoney(r.commissionPerDay)} a day · moving {inputs.shift}% to direct keeps about{" "}
          {fmtMoney(r.savings)} a year
        </p>
        <p className="mt-3 text-sm text-muted">Estimate from the numbers in this link. Check your own OTA contract for real rates.</p>
        <p className="mt-4 text-sm">
          <Link href="/" className="text-muted underline underline-offset-2 hover:text-foreground">
            ← Start over with your own numbers
          </Link>
        </p>
      </section>
      <section className="mt-8">
        <Calculator initial={initial} />
      </section>
      <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted">
        {DISCLAIMER_SHORT} {HONESTY}
      </p>
    </div>
  );
}
