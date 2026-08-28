import {
  dateStr,
  type SimpleDate,
  isValidEthDate,
  isValidGregDate,
  isEthLeapYear,
  isGregLeapYear,
} from "./utils.js";

const ETH_JDN_OFFSET = 1724221;

function ethToJDN(date: SimpleDate): number {
  const { year, month, day } = date;

  if (!isValidEthDate(date))
    throw new Error(`The date ${dateStr(date)} is invalid!`);

  const leapDays = Math.floor((year - 1) / 4);
  const daysInYear = 30 * (month - 1) + (day - 1);

  return ETH_JDN_OFFSET + 365 * (year - 1) + leapDays + daysInYear;
}

function jdnToEth(jdn: number): SimpleDate {
  const ethDays = jdn - ETH_JDN_OFFSET;

  const cycles = Math.floor(ethDays / 1461);
  const daysRemaining = ethDays % 1461;

  let yearsInCycle = Math.floor(daysRemaining / 365);
  let daysInYear = daysRemaining % 365;

  if (daysRemaining === 1460) {
    yearsInCycle = 3;
    daysInYear = 365;
  }

  const year = cycles * 4 + yearsInCycle + 1;
  const month = Math.floor(daysInYear / 30) + 1;
  const day = (daysInYear % 30) + 1;

  return { year, month, day };
}

function gregToJDN(date: SimpleDate): number {
  const { year, month, day } = date;

  if (!isValidGregDate(date))
    throw new Error(`The date ${dateStr(date)} is invalid!`);

  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

function jdnToGreg(jdn: number): {
  year: number;
  month: number;
  day: number;
} {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);

  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);

  const m = Math.floor((5 * e + 2) / 153);

  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);

  return { year, month, day };
}

function gregToEth(date: SimpleDate): SimpleDate {
  if (!isValidGregDate(date))
    throw new Error(`The date ${dateStr(date)} is invalid!`);

  return jdnToEth(gregToJDN(date));
}

function ethToGreg(date: SimpleDate): SimpleDate {
  if (!isValidEthDate(date))
    throw new Error(`The date ${dateStr(date)} is invalid!`);

  return jdnToGreg(ethToJDN(date));
}

export {
  type SimpleDate,
  ETH_JDN_OFFSET,
  dateStr,
  ethToJDN,
  jdnToEth,
  ethToGreg,
  gregToJDN,
  jdnToGreg,
  gregToEth,
  isValidEthDate,
  isValidGregDate,
  isEthLeapYear,
  isGregLeapYear,
};
