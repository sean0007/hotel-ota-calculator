import type { Metadata } from "next";
import { DISCLAIMER_SHORT, HONESTY } from "@/lib/site";

export const metadata: Metadata = { title: "Disclaimer", description: DISCLAIMER_SHORT };

export default function DisclaimerPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Read this</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">Disclaimer</h1>
      <p className="mt-4 text-lg text-foreground">{DISCLAIMER_SHORT}</p>
      <p className="mt-2 text-muted">{HONESTY}</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-base font-semibold text-foreground">What this is</h2>
          <p className="mt-2">
            A free calculator. A fixed formula in your browser turns the numbers you enter into an
            estimate of yearly OTA commission and possible savings from direct bookings.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">What it is not</h2>
          <p className="mt-2">
            It is not financial, accounting, or legal advice. Real commission depends on your
            contracts, programs, taxes, cancellations, and seasonality, which this tool ignores.
            Before offering direct-booking perks, check any rate-parity terms in your OTA contracts.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Trademarks</h2>
          <p className="mt-2">
            Booking.com, Expedia, Agoda, and Rakuten Travel are trademarks of their owners. This site
            is not affiliated with or endorsed by any of them.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Your data</h2>
          <p className="mt-2">Numbers you type stay in your browser. No login, database, or tracking.</p>
        </section>
      </div>
    </div>
  );
}
