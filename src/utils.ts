export type SimpleDate = { year: number; month: number; day: number };

export function isEthLeapYear(year: number) {
  return year % 4 === 0;
}

export function isGregLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function isValidEthDate(date: SimpleDate): boolean {
  const { year, month, day } = date;

  if (day < 1 || day > 30) return false;
  if (month < 1 || month > 13) return false;

  if (month === 13) {
    if (isEthLeapYear(year)) return day <= 6;
    return day <= 5;
  }

  return true;
}

export function isValidGregDate(date: SimpleDate): boolean {
  const { year, month, day } = date;

  if (month < 1 || month > 12) return false;
  const feb = isGregLeapYear(year) ? 29 : 28;
  const daysInMonth = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return day <= daysInMonth[month - 1];
}

export function dateStr(date: SimpleDate, separator: string = "-") {
  const { year, month, day } = date;
  return `${year}${separator}${month}${separator}${day}`;
}
