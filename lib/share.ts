import type { Inputs, Result } from "./calc";

export const PUBLIC_URL = "https://hotel-ota-calculator.vercel.app";

/** Same defaults as /api/calculate. rooms and adr have no default (required). */
export const DEFAULTS = { occupancy: 70, otaShare: 60, commission: 18, directCost: 3, shift: 20 } as const;
/** Parameter order in share URLs. Same names as /api/calculate. */
export const PARAMS = ["rooms", "adr", "occupancy", "otaShare", "commission", "directCost", "shift"] as const;
const PERCENT = new Set<keyof Inputs>(["occupancy", "otaShare", "commission", "directCost", "shift"]);
/** Hard caps so a hand-edited link can't render absurd numbers. */
export const MAX_ROOMS = 100_000;
export const MAX_ADR = 10_000_000;

/** Example result used in the sitemap, llms.txt, and the canary. Same as the API example. */
export const EXAMPLE_INPUTS: Inputs = { rooms: 20, adr: 120, occupancy: 70, otaShare: 60, commission: 18, directCost: 3, shift: 20 };

type Params = URLSearchParams | Record<string, string | string[] | undefined>;

function get(p: Params, key: string): string | undefined {
  if (p instanceof URLSearchParams) return p.get(key) ?? undefined;
  const v = p[key];
  return Array.isArray(v) ? v[0] : v;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

function cap(key: keyof Inputs, n: number): number {
  if (PERCENT.has(key)) return Math.min(n, 100);
  if (key === "rooms") return Math.min(n, MAX_ROOMS);
  return Math.min(n, MAX_ADR);
}

function value(key: keyof Inputs, raw: string | undefined, fallback: number): number {
  if (raw === undefined || raw.trim() === "") return fallback;
  const n = Number(raw.replace(/[,_\s$%¥€£]/g, ""));
  if (!Number.isFinite(n) || n < 0) return fallback;
  return cap(key, round2(n));
}

/** Reads calculator inputs from a share URL. Uses the same names and defaults as /api/calculate. */
export function parseResultParams(p: Params): Inputs {
  return {
    rooms: value("rooms", get(p, "rooms"), 0),
    adr: value("adr", get(p, "adr"), 0),
    occupancy: value("occupancy", get(p, "occupancy"), DEFAULTS.occupancy),
    otaShare: value("otaShare", get(p, "otaShare"), DEFAULTS.otaShare),
    commission: value("commission", get(p, "commission"), DEFAULTS.commission),
    directCost: value("directCost", get(p, "directCost"), DEFAULTS.directCost),
    shift: value("shift", get(p, "shift"), DEFAULTS.shift),
  };
}

/** Query string for a result, parameters in a stable order. Bad values fall back to API defaults. */
export function resultQuery(inputs: Inputs): string {
  const q = new URLSearchParams();
  for (const k of PARAMS) {
    const n = Number(inputs[k]);
    const fallback = k === "rooms" || k === "adr" ? 0 : DEFAULTS[k];
    q.set(k, String(Number.isFinite(n) && n >= 0 ? cap(k, round2(n)) : fallback));
  }
  return q.toString();
}

export const resultPath = (inputs: Inputs) => `/r?${resultQuery(inputs)}`;
export const ogPath = (inputs: Inputs) => `/og?${resultQuery(inputs)}`;
/** A result needs rooms, a rate, and some occupancy to produce any revenue. */
export const hasResult = (inputs: Inputs) => inputs.rooms > 0 && inputs.adr > 0 && inputs.occupancy > 0;
export const isExample = (inputs: Inputs) => resultQuery(inputs) === resultQuery(EXAMPLE_INPUTS);

/** Whole-number figures with thousands separators. Currency-free, like the calculator. */
export const fmtMoney = (n: number) => Math.round(n).toLocaleString("en-US");
export const fmtPct = (share: number) => `${Math.round(share * 1000) / 10}%`;

/** Headline for <title>, H1, and share text, built only from the calculator's own result. */
export function resultHeadline(r: Result): string {
  return `${fmtMoney(r.commissionPaid)} a year in OTA commission (${fmtPct(r.commissionShareOfRevenue)} of room revenue)`;
}
