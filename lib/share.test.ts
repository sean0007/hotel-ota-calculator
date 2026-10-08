import { test } from "node:test";
import assert from "node:assert/strict";
import { calculate } from "./calc";
import { ENDPOINTS } from "./api";
import {
  EXAMPLE_INPUTS,
  MAX_ROOMS,
  hasResult,
  isExample,
  ogPath,
  parseResultParams,
  resultHeadline,
  resultPath,
  resultQuery,
} from "./share";

const EXAMPLE_QUERY = "rooms=20&adr=120&occupancy=70&otaShare=60&commission=18&directCost=3&shift=20";

test("result query round-trips through the parser", () => {
  const q = resultQuery(EXAMPLE_INPUTS);
  assert.equal(q, EXAMPLE_QUERY);
  assert.deepEqual(parseResultParams(new URLSearchParams(q)), EXAMPLE_INPUTS);
});

test("share URL uses the same parameter names as /api/calculate", () => {
  assert.equal(ENDPOINTS.calculate.example, `/api/calculate?${EXAMPLE_QUERY}`);
  const apiNames = ENDPOINTS.calculate.params.map((p) => p.name).sort();
  const shareNames = [...new URLSearchParams(resultQuery(EXAMPLE_INPUTS)).keys()].sort();
  assert.deepEqual(shareNames, apiNames);
});

test("share URL gives the same numbers as the calculator and the API", () => {
  const back = parseResultParams(new URLSearchParams(resultQuery(EXAMPLE_INPUTS)));
  const r = calculate(back);
  const api = ENDPOINTS.calculate.compute(Object.fromEntries(new URLSearchParams(EXAMPLE_QUERY))) as {
    result: { commissionPaid: number; level: string };
  };
  assert.equal(Math.round(r.commissionPaid), Math.round(api.result.commissionPaid));
  assert.equal(r.level, api.result.level);
  assert.equal(resultHeadline(r), "66,226 a year in OTA commission (10.8% of room revenue)");
});

test("paths use /r and /og", () => {
  assert.equal(resultPath(EXAMPLE_INPUTS), `/r?${EXAMPLE_QUERY}`);
  assert.equal(ogPath(EXAMPLE_INPUTS), `/og?${EXAMPLE_QUERY}`);
});

test("missing optional params fall back to the API defaults", () => {
  const i = parseResultParams({ rooms: "20", adr: "120" });
  assert.deepEqual(i, EXAMPLE_INPUTS);
  assert.equal(isExample(i), true);
});

test("parser accepts a plain record and drops junk", () => {
  const i = parseResultParams({ rooms: ["12", "99"], adr: "$1,500", occupancy: "abc", commission: "-5", shift: "250", evil: "1" });
  assert.equal(i.rooms, 12);
  assert.equal(i.adr, 1500);
  assert.equal(i.occupancy, 70);
  assert.equal(i.commission, 18);
  assert.equal(i.shift, 100);
  assert.equal(isExample(i), false);
});

test("parser caps huge values and handles empty input", () => {
  const i = parseResultParams(new URLSearchParams("rooms=1e12&adr=100"));
  assert.equal(i.rooms, MAX_ROOMS);
  assert.equal(hasResult(parseResultParams(new URLSearchParams(""))), false);
  assert.equal(hasResult(parseResultParams(new URLSearchParams("rooms=10"))), false);
  assert.equal(hasResult(parseResultParams(new URLSearchParams("rooms=10&adr=80&occupancy=0"))), false);
  assert.equal(hasResult(i), true);
});
