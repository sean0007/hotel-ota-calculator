export type Inputs = {
  rooms: number;
  /** average daily rate, in your currency */
  adr: number;
  /** occupancy, 0-100 */
  occupancy: number;
  /** share of room revenue booked via OTAs, 0-100 */
  otaShare: number;
  /** average OTA commission, 0-100 */
  commission: number;
  /** cost of a direct booking (payment fees, booking engine, ads), 0-100 */
  directCost: number;
  /** share of current OTA bookings you move to direct, 0-100 */
  shift: number;
};

export type Level = "HIGH" | "MED" | "LOW";

export type Result = {
  roomNights: number;
  roomRevenue: number;
  otaRevenue: number;
  commissionPaid: number;
  commissionPerDay: number;
  commissionShareOfRevenue: number;
  shiftedRevenue: number;
  savings: number;
  level: Level;
  headline: string;
  summary: string;
};

const pct = (n: number) => Math.min(Math.max(Number.isFinite(n) ? n : 0, 0), 100) / 100;
const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function calculate(i: Inputs): Result {
  const roomNights = pos(i.rooms) * 365 * pct(i.occupancy);
  const roomRevenue = roomNights * pos(i.adr);
  const otaRevenue = roomRevenue * pct(i.otaShare);
  const commissionPaid = otaRevenue * pct(i.commission);
  const commissionPerDay = commissionPaid / 365;
  const commissionShareOfRevenue = roomRevenue > 0 ? commissionPaid / roomRevenue : 0;
  const shiftedRevenue = otaRevenue * pct(i.shift);
  const savings = Math.max(shiftedRevenue * (pct(i.commission) - pct(i.directCost)), 0);

  let level: Level = "LOW";
  if (commissionShareOfRevenue >= 0.1) level = "HIGH";
  else if (commissionShareOfRevenue >= 0.05) level = "MED";

  const share = Math.round(commissionShareOfRevenue * 1000) / 10;
  const headline =
    roomRevenue === 0
      ? "Enter your hotel's numbers"
      : level === "HIGH"
        ? `OTAs take about ${share}% of all your room revenue`
        : level === "MED"
          ? `OTA commission is ${share}% of room revenue: worth trimming`
          : `OTA commission is ${share}% of room revenue: fairly healthy`;
  const summary =
    roomRevenue === 0
      ? "Rooms, rate, and occupancy are enough to start."
      : level === "HIGH"
        ? "That's a big slice. Even a small shift to direct bookings adds up fast."
        : level === "MED"
          ? "Moving repeat guests and locals to direct booking is the easiest win."
          : "You already rely on direct bookings. Keep OTAs for discovery, not for repeat guests.";

  return {
    roomNights,
    roomRevenue,
    otaRevenue,
    commissionPaid,
    commissionPerDay,
    commissionShareOfRevenue,
    shiftedRevenue,
    savings,
    level,
    headline,
    summary,
  };
}
