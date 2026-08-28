/// <reference types="node"  />

import test from "node:test";
import assert from "node:assert";
import {
  ETH_JDN_OFFSET,
  ethToJDN,
  jdnToEth,
  ethToGreg,
  gregToJDN,
  jdnToGreg,
  gregToEth,
} from "../dist/index.js";
import { dateStr, isValidEthDate, type SimpleDate } from "../dist/utils.js";

type JDNDateMap = [number, SimpleDate][];
const ethJDNTestCases: JDNDateMap = [
  [ETH_JDN_OFFSET, { year: 1, month: 1, day: 1 }],
  [ETH_JDN_OFFSET + 1460, { year: 4, month: 13, day: 6 }],
  [ETH_JDN_OFFSET + 1461, { year: 5, month: 1, day: 1 }],
];

// Ethiopian Dates
for (const [jdn, date] of ethJDNTestCases) {
  test(`${dateStr(date)} EC is JDN ${jdn}`, () => {
    assert.equal(ethToJDN(date), jdn);
  });

  test(`JDN ${jdn} is ${dateStr(date)} EC`, () => {
    assert.deepEqual(jdnToEth(jdn), date);
  });
}

// Valid & Invalid Ethiopian Dates
const validInvalidDates: [boolean, SimpleDate][] = [
  [false, { year: 1900, month: 23, day: 2 }],
  [true, { year: 2016, month: 8, day: 25 }],
  [false, { year: 2000, month: 10, day: 31 }],
  [true, { year: 8, month: 13, day: 6 }],
];

for (const [isValid, date] of validInvalidDates) {
  test(`Date ${dateStr(date)} is ${isValid ? "Valid" : "Invalid"}`, () => {
    assert.equal(isValidEthDate(date), isValid);
  });

  test(`ethToGreg(${dateStr(date)}) ${isValid ? "does not throw." : "throws."}`, () => {
    if (!isValid) {
      assert.throws(() => ethToGreg(date));
    } else {
      assert.doesNotThrow(() => ethToGreg(date));
    }
  });
}
