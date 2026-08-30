type Separator = "-" | "/";
type SimpleDate = { year: number; month: number; day: number };

function isEthLeapYear(year: number) {
  return year % 4 === 0;
}

function isGregLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function isValidEthDate(date: SimpleDate): boolean {
  const { year, month, day } = date;

  if (day < 1 || day > 30) return false;
  if (month < 1 || month > 13) return false;

  if (month === 13) {
    if (isEthLeapYear(year)) return day <= 6;
    return day <= 5;
  }

  return true;
}

function isValidGregDate(date: SimpleDate): boolean {
  const { year, month, day } = date;

  if (month < 1 || month > 12) return false;
  const feb = isGregLeapYear(year) ? 29 : 28;
  const daysInMonth = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return day <= daysInMonth[month - 1];
}

function toDateString(date: SimpleDate, separator: Separator = "-") {
  const { year, month, day } = date;
  return `${year}${separator}${month}${separator}${day}`;
}

function toDateObject(
  dateString: string,
  separator: Separator = "-",
): SimpleDate {
  const pattern = new RegExp(`^\d+${separator}\d+${separator}\d+$`);

  if (!dateString.match(pattern))
    throw new Error(
      `${dateString} doesn't seem to be a valid date string! \n` +
        `Date String should year-month-day or year/month/day.`,
    );

  const [year, month, day] = dateString
    .split(separator)
    .map((item) => Number(item));

  return { year, month, day };
}

export {
  type SimpleDate,
  type Separator,
  toDateObject,
  toDateString,
  isEthLeapYear,
  isGregLeapYear,
  isValidEthDate,
  isValidGregDate,
};
