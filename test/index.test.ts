/// <reference types="node"  />
import { describe, it } from "node:test";
import assert from "node:assert";

import {
  ETH_JDN_OFFSET,
  GREG_JDN_OFFSET,
  ethToJDN,
  jdnToEth,
  ethToGreg,
  gregToJDN,
  jdnToGreg,
  gregToEth,
} from "../dist/index.js";

import {
  toDateString,
  isValidEthDate,
  isValidGregDate,
  isEthLeapYear,
  isGregLeapYear,
} from "../dist/utils.js";

const offset =
  (baseOffset: number) =>
  (...offsets: number[]) =>
    offsets.reduce((p, c) => p + c, 0) + baseOffset;

// Leap year test
describe("Leap years", () => {
  describe("Ethiopian years", () => {
    const years = [
      [true, 4],
      [false, 2015],
      [false, 1990],
    ] as const;

    for (const [isLeapYear, year] of years) {
      it(`isEthLeapYear(${year})should return ${isLeapYear} `, () =>
        assert.equal(isEthLeapYear(year), isLeapYear));
    }
  });

  describe("Gregorian years", () => {
    const years = [
      [true, 4],
      [false, 100],
      [true, 400],
    ] as const;

    for (const [isLeapYear, year] of years) {
      it(`isGregLeapYear(${year})should return ${isLeapYear} `, () =>
        assert.equal(isGregLeapYear(year), isLeapYear));
    }
  });
});

// Valid & invalid date test
describe("Valid & Invalid dates", () => {
  describe("Ethiopian dates", () => {
    const dates = [
      [false, { year: 1900, month: 23, day: 2 }],
      [true, { year: 2016, month: 8, day: 25 }],
      [false, { year: 2000, month: 10, day: 31 }],
      [true, { year: 8, month: 13, day: 6 }],
    ] as const;

    for (const [isValid, date] of dates) {
      it(`isValidEthDate(${toDateString(date)}) should return ${isValid}`, () => {
        assert.equal(isValidEthDate(date), isValid);
      });

      it(`ethToGreg(${toDateString(date)}) should ${isValid ? "not throw" : "throw"}`, () => {
        if (!isValid) {
          assert.throws(() => ethToGreg(date));
        } else {
          assert.doesNotThrow(() => ethToGreg(date));
        }
      });
    }
  });

  describe("Gregorian dates", () => {
    const dates = [
      [true, { year: 2021, month: 8, day: 25 }],
      [true, { year: 2000, month: 10, day: 31 }],
      [false, { year: 8, month: 13, day: 6 }],
    ] as const;

    for (const [isValid, date] of dates) {
      it(`isValidGregDate(${toDateString(date)}) should return ${isValid}`, () => {
        assert.equal(isValidGregDate(date), isValid);
      });

      it(`gregToEth(${toDateString(date)}) should ${isValid ? "not throw" : "throw"}`, () => {
        if (!isValid) {
          assert.throws(() => gregToEth(date));
        } else {
          assert.doesNotThrow(() => gregToEth(date));
        }
      });
    }
  });
});

// Julian day number test
describe("Julian day numbers", () => {
  describe("ethToJDN & jdnToEth", () => {
    const sum = offset(ETH_JDN_OFFSET);
    const jdnDateMap = [
      [sum(0), { year: 1, month: 1, day: 1 }],
      [sum(1460), { year: 4, month: 13, day: 6 }],
      [sum(1461), { year: 5, month: 1, day: 1 }],
      [sum(25 * 1461, 3 * 365, 2 * 30, 9), { year: 104, month: 3, day: 10 }],
    ] as const;

    for (const [jdn, date] of jdnDateMap) {
      it(`ethToJDN(${toDateString(date)}) should equal ${jdn}`, () => {
        assert.equal(ethToJDN(date), jdn);
      });

      it(`jdnToEth(${jdn}) should equal ${toDateString(date)}`, () => {
        assert.deepEqual(jdnToEth(jdn), date);
      });
    }
  });

  describe("gregToJDN & jdnToGreg", () => {
    const sum = offset(GREG_JDN_OFFSET);
    const jdnDateMap = [
      [sum(0), { year: 1, month: 1, day: 1 }],
      [sum(1461), { year: 5, month: 1, day: 1 }],
      [sum(10 * 1461), { year: 41, month: 1, day: 1 }],
      [sum(25 * 1461, -1), { year: 101, month: 1, day: 1 }],
    ] as const;

    for (const [jdn, date] of jdnDateMap) {
      it(`gregToJDN(${toDateString(date)}) should equal ${jdn}`, () => {
        assert.equal(gregToJDN(date), jdn);
      });

      it(`jdnToGreg(${jdn}) should equal ${toDateString(date)}`, () => {
        assert.deepEqual(jdnToGreg(jdn), date);
      });
    }
  });
});

describe("Calendar conversion", () => {
  const ethDates = [{ year: 2018, month: 12, day: 24 }];
  const gregDates = [{ year: 2026, month: 8, day: 30 }];
  describe("Ethiopian -> Gregorian", () => {
    ethDates.forEach((date, idx) => {
      const gregDate = gregDates[idx];
      it(`${toDateString(date)} EC should equal ${toDateString(gregDate)} GC`, () => {
        assert.deepEqual(ethToGreg(date), gregDate);
      });
    });
  });

  describe("Gregorian -> Ethiopian", () => {
    gregDates.forEach((date, idx) => {
      const ethDate = ethDates[idx];
      it(`${toDateString(date)} GC should equal ${toDateString(ethDate)} EC`, () => {
        assert.deepEqual(gregToEth(date), ethDate);
      });
    });
  });
});
