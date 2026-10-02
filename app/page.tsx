import { Calculator } from "@/components/calculator";
import { SponsorSlot } from "@/components/sponsor-slot";

const moves = [
  {
    title: "Win back repeat guests",
    text: "Guests who found you on an OTA once can book direct next time. A thank-you card or follow-up email with a direct-booking perk is the cheapest fix.",
  },
  {
    title: "Make direct as easy as the OTA",
    text: "A clear Book Now button, mobile-friendly checkout, and the same or better price on your own site. Many guests check the hotel's site before booking.",
  },
  {
    title: "Give a reason that isn't price",
    text: "Free breakfast, late checkout, or a room upgrade for direct bookings. Check your OTA contract's rate-parity terms first.",
  },
  {
    title: "Keep OTAs for discovery",
    text: "OTAs are good at bringing first-time guests. The goal is to stop paying commission on guests who already know you.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <section className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Free hotel calculator · no login</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
          How much are Booking.com and Expedia really costing your hotel?
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Enter your rooms, rate, occupancy, and OTA mix. See your yearly commission bill, what it
          costs per day, and what moving some guests to direct booking would keep in your pocket.
          Everything runs in your browser.
        </p>
      </section>

      <section className="mt-8">
        <Calculator />
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">Four ways to shift bookings to direct</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {moves.map((m, i) => (
            <article key={m.title} className="rounded-3xl border border-line bg-panel/60 p-5">
              <span className="font-mono text-amber">0{i + 1}</span>
              <h3 className="mt-1 text-lg font-semibold text-foreground">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{m.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">How the math works</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
          Room nights are rooms × 365 × occupancy. Room revenue is room nights × your average rate.
          Commission is the OTA share of that revenue × your average commission. Savings are the
          OTA revenue you move to direct × (commission − your direct-booking cost). The burden label
          is HIGH when commission is 10% or more of all room revenue, MED from 5% to 10%, and LOW
          below 5%.
        </p>
      </section>

      <section className="mt-16 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-line bg-panel/50 p-6">
          <h2 className="font-display text-3xl tracking-tight">Not affiliated with any OTA</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Booking.com, Expedia, Agoda, and Rakuten Travel are trademarks of their owners. This
            calculator doesn&apos;t connect to them, and it doesn&apos;t store anything you type.
          </p>
        </div>
        <SponsorSlot />
      </section>
    </div>
  );
}
