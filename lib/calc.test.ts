import { test } from "node:test";
import assert from "node:assert/strict";
import { calculate } from "./calc";

const base = { rooms: 20, adr: 100, occupancy: 70, otaShare: 60, commission: 18, directCost: 3, shift: 20 };

test("core math", () => {
  const r = calculate(base);
  assert.equal(r.roomNights, 20 * 365 * 0.7);
  assert.equal(r.roomRevenue, 5110 * 100);
  assert.equal(Math.round(r.otaRevenue), 306600);
  assert.equal(Math.round(r.commissionPaid), 55188);
  assert.equal(Math.round(r.savings), Math.round(306600 * 0.2 * 0.15));
  assert.equal(r.level, "HIGH");
});

test("low ota share is LOW", () => {
  assert.equal(calculate({ ...base, otaShare: 20 }).level, "LOW");
});

test("mid ota share is MED", () => {
  assert.equal(calculate({ ...base, otaShare: 40 }).level, "MED");
});

test("empty input", () => {
  const r = calculate({ ...base, rooms: 0 });
  assert.equal(r.roomRevenue, 0);
  assert.equal(r.headline, "Enter your hotel's numbers");
});

test("direct cost above commission never gives negative savings", () => {
  assert.equal(calculate({ ...base, directCost: 30 }).savings, 0);
});

test("percentages are clamped", () => {
  const r = calculate({ ...base, occupancy: 150, otaShare: -10 });
  assert.equal(r.roomNights, 20 * 365);
  assert.equal(r.otaRevenue, 0);
});
