import { ImageResponse } from "next/og";
import { calculate } from "@/lib/calc";
import { EXAMPLE_INPUTS, fmtMoney, fmtPct, hasResult, parseResultParams } from "@/lib/share";

const COLOR = { HIGH: "#fda4af", MED: "#f0b429", LOW: "#99f6e4" } as const;

export async function GET(req: Request) {
  const parsed = parseResultParams(new URL(req.url).searchParams);
  const inputs = hasResult(parsed) ? parsed : EXAMPLE_INPUTS;
  const r = calculate(inputs);
  const stats = [
    { label: "per day to OTAs", value: fmtMoney(r.commissionPerDay) },
    { label: "of room revenue", value: fmtPct(r.commissionShareOfRevenue) },
    { label: `kept / yr moving ${inputs.shift}% direct`, value: fmtMoney(r.savings) },
  ];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#07080c", color: "#f3efe4", padding: "56px 64px", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: "0.24em", textTransform: "uppercase", color: "#f0b429" }}>Hotel OTA Commission</div>
          <div style={{ display: "flex", fontSize: 22, color: "#9b9588" }}>{`burden: ${r.level}`}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 30, color: "#c9c3b6" }}>Paid to OTAs per year</div>
          <div style={{ display: "flex", alignItems: "baseline", marginTop: 6 }}>
            <span style={{ fontSize: 132, fontWeight: 800, letterSpacing: "-0.04em", color: COLOR[r.level], lineHeight: 1 }}>{fmtMoney(r.commissionPaid)}</span>
            <span style={{ fontSize: 44, color: "#9b9588", marginLeft: 14 }}>/ year</span>
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#9b9588", marginTop: 14 }}>
            {`${inputs.rooms} rooms · rate ${fmtMoney(inputs.adr)} · ${inputs.occupancy}% occupancy · ${inputs.otaShare}% via OTAs at ${inputs.commission}%`}
          </div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", flex: 1, border: "2px solid #23252c", borderRadius: 24, padding: "14px 20px", background: "#101218" }}>
              <span style={{ fontSize: 40, fontWeight: 700, color: "#f3efe4" }}>{s.value}</span>
              <span style={{ fontSize: 20, color: "#9b9588" }}>{s.label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#6f6a60" }}>
          <span>hotel-ota-calculator.vercel.app · free, no login</span>
          <span>Estimate only. Check your OTA contract.</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable" } },
  );
}
