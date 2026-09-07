type DateStr = `${number}-${number}-${number}`;
type DateObj = {
  year: number;
  month: number;
  day: number;
};

class CalendarError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class BaseCalendar {
  year: number;
  month: number;
  day: number;

  constructor(date: DateStr | DateObj | Date) {
    if (date instanceof Date) {
      this.year = date.getFullYear();
      this.month = date.getMonth() + 1;
      this.day = date.getDate();
    } else {
      if (typeof date === "string") {
        date = this._parseDateString(date);
      }
      this.year = date.year;
      this.month = date.month;
      this.day = date.day;
    }

    // WARNING: Negative years may fail
    if (this.year < 1) {
      console.warn("Proeleptic (negative) years are not supported currently!");
    }
  }

  _parseDateString(str: string): DateObj {
    const pattern = new RegExp(`^\\d+-\\d+-\\d+$`);

    if (!str.match(pattern))
      throw new CalendarError(
        `${str} doesn't seem to be a valid date string! \n` +
          `Date String should be of a form year-month-day.`,
      );

    const [year, month, day] = str.split("-").map((item) => Number(item));

    return { year, month, day };
  }

  static _today() {
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
  }

  toString() {
    const month = this.month.toString().padStart(2, "0");
    const day = this.day.toString().padStart(2, "0");
    return `${this.year}-${month}-${day}`;
  }
}

class EthiopianCalendar extends BaseCalendar {
  static type = "ethiopian" as const;
  static jdnOffset = 1_724_221 as const;

  constructor(date: DateStr | DateObj | Date) {
    super(date);

    // Validate input
    if (!this.isValid)
      throw new CalendarError(`The date ${this.toString()} is invalid!`);
  }

  static isLeapYear(year: number) {
    return year % 4 === 0;
  }
  get isLeapYear() {
    return EthiopianCalendar.isLeapYear(this.year);
  }

  get isValid() {
    if (this.day < 1 || this.day > 30) return false;
    if (this.month < 1 || this.month > 13) return false;

    if (this.month === 13) {
      if (this.isLeapYear) return this.day <= 6;
      return this.day <= 5;
    }

    return true;
  }

  toJDN() {
    const leapDays = Math.floor((this.year - 1) / 4);
    const daysInYear = 30 * (this.month - 1) + (this.day - 1);

    return (
      EthiopianCalendar.jdnOffset +
      365 * (this.year - 1) +
      leapDays +
      daysInYear
    );
  }

  toGregorian() {
    return GregorianCalendar.fromJDN(this.toJDN());
  }

  static today() {
    const gregorian = new GregorianCalendar(BaseCalendar._today());
    return EthiopianCalendar.fromJDN(gregorian.toJDN());
  }

  static epoch() {
    return new EthiopianCalendar("1-1-1");
  }

  static fromJDN(jdn: number) {
    const ethDays = jdn - EthiopianCalendar.jdnOffset;

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

    return new EthiopianCalendar({ year, month, day });
  }
}

class GregorianCalendar extends BaseCalendar {
  static type = "gregorian" as const;
  static jdnOffset = 1_721_426 as const;

  constructor(date: DateStr | DateObj | Date) {
    super(date);

    // Validate input
    if (!this.isValid)
      throw new CalendarError(`The date ${this.toString()} is invalid!`);
  }

  static isLeapYear(year: number) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  }

  get isLeapYear() {
    return GregorianCalendar.isLeapYear(this.year);
  }

  get isValid(): boolean {
    if (this.month < 1 || this.month > 12) return false;
    const feb = this.isLeapYear ? 29 : 28;
    const daysInMonth = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    return this.day <= daysInMonth[this.month - 1];
  }

  toJDN() {
    const a = Math.floor((14 - this.month) / 12);
    const y = this.year + 4800 - a;
    const m = this.month + 12 * a - 3;

    return (
      this.day +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400) -
      32045
    );
  }

  toEthiopian() {
    return EthiopianCalendar.fromJDN(this.toJDN());
  }

  static today() {
    return new GregorianCalendar(BaseCalendar._today());
  }

  static epoch() {
    return new GregorianCalendar("1-1-1");
  }

  static fromJDN(jdn: number): {
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

    return new GregorianCalendar({ year, month, day });
  }
}

export { EthiopianCalendar, GregorianCalendar };
