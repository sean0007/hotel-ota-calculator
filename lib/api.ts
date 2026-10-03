import { calculate } from "./calc";
import { num, type Endpoint } from "./agent-api";
import { DISCLAIMER_SHORT, HONESTY, SITE_NAME, SITE_TAGLINE } from "./site";

export const PUBLIC_URL = "https://hotel-ota-calculator.vercel.app";
export const API_DISCLAIMER = `${DISCLAIMER_SHORT} ${HONESTY}`;
export const API_INFO = { title: `${SITE_NAME} API`, description: SITE_TAGLINE };

const r2 = (n: number) => Math.round(n * 100) / 100;

export const ENDPOINTS: Record<"calculate", Endpoint> = {
  calculate: {
    path: "/api/calculate",
    operationId: "hotelOtaCommission",
    summary: "Annual OTA commission a hotel pays (Booking.com, Expedia, Agoda...) and savings from shifting bookings to direct",
    description:
      "From room count, average daily rate, occupancy, OTA share, and commission, returns yearly room nights and revenue, OTA commission paid per year and per day, commission as a share of room revenue (HIGH >= 10%, MED >= 5%, else LOW), and net yearly savings if a percentage of OTA bookings moves to direct (after direct booking costs). Currency is whatever the caller uses.",
    params: [
      { name: "rooms", type: "number", required: true, minimum: 0, description: "Number of rooms." },
      { name: "adr", type: "number", required: true, minimum: 0, description: "Average daily rate per occupied room, any currency." },
      { name: "occupancy", type: "number", default: 70, minimum: 0, maximum: 100, description: "Average yearly occupancy percent." },
      { name: "otaShare", type: "number", default: 60, minimum: 0, maximum: 100, description: "Percent of room revenue booked through OTAs." },
      { name: "commission", type: "number", default: 18, minimum: 0, maximum: 100, description: "Average OTA commission percent (often 15-25)." },
      { name: "directCost", type: "number", default: 3, minimum: 0, maximum: 100, description: "Cost of a direct booking as percent of revenue (card fees, booking engine, ads)." },
      { name: "shift", type: "number", default: 20, minimum: 0, maximum: 100, description: "Percent of current OTA bookings moved to direct." },
    ],
    example: "/api/calculate?rooms=20&adr=120&occupancy=70&otaShare=60&commission=18&directCost=3&shift=20",
    compute: (i) => {
      const input = {
        rooms: num(i, "rooms"),
        adr: num(i, "adr"),
        occupancy: num(i, "occupancy", 70),
        otaShare: num(i, "otaShare", 60),
        commission: num(i, "commission", 18),
        directCost: num(i, "directCost", 3),
        shift: num(i, "shift", 20),
      };
      const r = calculate(input);
      return {
        input,
        result: {
          ...r,
          roomNights: r2(r.roomNights),
          roomRevenue: r2(r.roomRevenue),
          otaRevenue: r2(r.otaRevenue),
          commissionPaid: r2(r.commissionPaid),
          commissionPerDay: r2(r.commissionPerDay),
          commissionShareOfRevenue: Math.round(r.commissionShareOfRevenue * 10000) / 10000,
          shiftedRevenue: r2(r.shiftedRevenue),
          savings: r2(r.savings),
        },
      };
    },
  },
};

export const PLUGIN = {
  name: "Hotel OTA Commission Calculator",
  nameForModel: "hotel_ota_calculator",
  descriptionForHuman: "What OTAs like Booking.com and Expedia cost a hotel per year, and what direct bookings save.",
  descriptionForModel:
    "Use when a hotel, ryokan, guesthouse, or B&B owner asks how much OTA commission costs them or what moving guests to direct booking would save. Deterministic estimate from the numbers given. Relay the disclaimer: educational estimate, not financial advice.",
  logo: "/icon.svg",
};
