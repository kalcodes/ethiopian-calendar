/// <reference types="node"  />
import { describe, it } from "node:test";
import assert from "node:assert";

import {
  EthiopianCalendar as EC,
  GregorianCalendar as GC,
} from "../dist/index.js";

const dates = {
  valid: {
    ethiopian: ["8-13-6", "2016-8-25"],
    gregorian: ["2021-8-25", "2000-10-31"],
  },

  invalid: {
    ethiopian: ["1900-23-2", "2000-10-31"],
    gregorian: ["8-13-06", "500-2-30"],
  },

  leapYears: {
    ethiopian: [4, 1600, 2000],
    gregorian: [4, 400, 1600],
  },

  nonLeapYears: {
    ethiopian: [2015, 1990],
    gregorian: [10, 100, 500],
  },

  jdnMap: {
    ethiopian: [[EC.jdnOffset, EC.epoch()]],
    gregorian: [[GC.jdnOffset, GC.epoch()]],
  },

  conversionMap: {
    ethiopian: ["2018-12-24"],
    gregorian: ["2026-08-30"],
  },
} as const;

// Leap year test
describe("Leap years", () => {
  const { leapYears, nonLeapYears } = dates;

  describe("Ethiopian years", () => {
    for (const year of leapYears.ethiopian) {
      it(`Year ${year} is a leap year.`, () => {
        assert.equal(EC.isLeapYear(year), true);
      });
    }

    for (const year of nonLeapYears.ethiopian) {
      it(`Year ${year} is not a leap year.`, () => {
        assert.equal(EC.isLeapYear(year), false);
      });
    }
  });

  describe("Gregorian years", () => {
    for (const year of leapYears.gregorian) {
      it(`Year ${year} is a leap year.`, () => {
        assert.equal(GC.isLeapYear(year), true);
      });
    }

    for (const year of nonLeapYears.gregorian) {
      it(`Year ${year} is not a leap year.`, () => {
        assert.equal(GC.isLeapYear(year), false);
      });
    }
  });
});

// Valid & invalid date test
describe("Valid & Invalid dates", () => {
  const { valid, invalid } = dates;

  describe("Ethiopian dates", () => {
    describe("Valid dates", () => {
      for (const date of valid.ethiopian) {
        it(`${date} should not throw an error`, () => {
          assert.doesNotThrow(() => new EC(date));
        });
      }
    });

    describe("Invalid dates", () => {
      for (const date of invalid.ethiopian) {
        it(`${date} should throw an error`, () => {
          assert.throws(() => new EC(date));
        });
      }
    });
  });

  describe("Gregorian dates", () => {
    describe("Valid dates", () => {
      for (const date of valid.gregorian) {
        it(`${date} should not throw an error`, () => {
          assert.doesNotThrow(() => new GC(date));
        });
      }
    });

    describe("Invalid dates", () => {
      for (const date of invalid.gregorian) {
        it(`${date} should throw an error`, () => {
          assert.throws(() => new GC(date));
        });
      }
    });
  });
});

// Julian day number test
describe("Julian day numbers", () => {
  const { ethiopian, gregorian } = dates.jdnMap;

  describe("Ethiopian dates", () => {
    for (const [jdn, date] of ethiopian) {
      it(`${date.toJDN()} EC should equal ${jdn} JDN`, () => {
        assert.equal(date.toJDN(), jdn);
      });
    }
  });

  describe("Gregorian dates", () => {
    for (const [jdn, date] of gregorian) {
      it(`${date.toJDN()} EC should equal ${jdn} JDN`, () => {
        assert.equal(date.toJDN(), jdn);
      });
    }
  });
});

describe("Calendar conversion", () => {
  const { ethiopian: ethDates, gregorian: gregDates } = dates.conversionMap;

  describe("Ethiopian -> Gregorian", () => {
    ethDates.forEach((date, idx) => {
      const targetDate = gregDates[idx];
      const gregDate = new EC(date).toGregorian().toString();

      it(`${date} EC should equal ${targetDate} GC`, () => {
        assert.deepEqual(gregDate, targetDate);
      });
    });
  });

  describe("Gregorian -> Ethiopian", () => {
    gregDates.forEach((date, idx) => {
      const targetDate = ethDates[idx];
      const ethDate = new GC(date).toEthiopian().toString();

      it(`${date} GC should equal ${targetDate} EC`, () => {
        assert.deepEqual(ethDate, targetDate);
      });
    });
  });
});
