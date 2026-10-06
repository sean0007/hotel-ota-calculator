import type { Metadata } from "next";
import { Calculator } from "@/components/calculator";
import { FaqSection, type FaqItem } from "@/components/faq-section";
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

const title = "Free hotel OTA commission calculator (Booking.com, Expedia, Agoda)";
const description =
  "Free hotel OTA commission calculator: enter rooms, average rate, occupancy, OTA share, and commission to see what Booking.com, Expedia, and Agoda cost you per year and per day, and what shifting guests to direct booking would save. No login.";

export const metadata: Metadata = {
  title: { absolute: `${title} · Hotel OTA Commission Calculator` },
  description,
  alternates: { canonical: "/" },
};

const faq: FaqItem[] = [
  {
    q: "Is there a free hotel OTA commission calculator?",
    a: "Yes. This one is free with no login. Enter your rooms, average daily rate, occupancy, the share of bookings that come through OTAs, and your average commission. It shows your yearly commission bill, what that is per day, the share of room revenue it eats, and what moving some OTA guests to direct booking would save. It runs in your browser and stores nothing.",
  },
  {
    q: "How much commission does Booking.com charge hotels?",
    a: "Booking.com commission is commonly quoted at around 15% to 18% of the booking value for many properties, and higher if you join visibility programs. It varies by country and contract, so check your extranet or contract and enter your real rate.",
  },
  {
    q: "How much commission does Expedia charge hotels?",
    a: "Expedia commission is commonly quoted at around 15% to 25%, depending on the contract and on whether bookings are Expedia Collect or Hotel Collect. Use the rate from your own agreement.",
  },
  {
    q: "How do I calculate what OTAs cost my hotel per year?",
    a: "Room nights = rooms × 365 × occupancy. Room revenue = room nights × average daily rate. OTA commission = room revenue × OTA share × average commission. Example: 20 rooms at $150 with 70% occupancy is about $766,500 of room revenue; with 60% from OTAs at 18%, commission is about $82,800 a year, or about $227 a day.",
  },
  {
    q: "How much would shifting bookings from OTAs to direct save?",
    a: "Savings = OTA revenue moved to direct × (commission − your direct-booking cost, such as card fees and booking-engine fees). In the example above, moving 20% of OTA revenue to direct at a 3% direct cost saves about $13,800 a year.",
  },
  {
    q: "What is a high OTA commission burden?",
    a: "There is no universal benchmark. This calculator labels the burden HIGH when commission is 10% or more of all room revenue, MED from 5% to 10%, and LOW below 5%. OTAs still bring first-time guests, so the usual goal is to stop paying commission on guests who already know you, not to leave OTAs.",
  },
  {
    q: "Can I offer a lower price on my own website than on Booking.com?",
    a: "It depends on your contract and country. Many OTA contracts include rate-parity terms. In the EU, Booking.com can no longer enforce price-parity clauses under the Digital Markets Act. Many hotels offer non-price perks instead, like breakfast or late checkout. Check your contract before changing prices.",
  },
  {
    q: "Is there an API for AI agents?",
    a: "Yes. GET https://hotel-ota-calculator.vercel.app/api/calculate?rooms=20&adr=150&occupancy=70&otaShare=60&commission=18 returns the same numbers as JSON with no key. It is also a tool on the free Free Agent Tools MCP server at https://free-agent-tools.vercel.app/mcp.",
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

      <FaqSection items={faq} heading="Hotel OTA commission questions" />
    </div>
  );
}
