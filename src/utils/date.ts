// src/utils/date.ts
type MonthKey = keyof typeof MONTHS;

const MONTHS = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  jan: 0, feb: 1, mar: 2, apr: 3, jun: 5, jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11
};

export function parseFlexibleDate(raw: any, { preferStartOfPeriod = true } = {}): Date | null {
  if (raw === null || raw === undefined || raw === '') return null;
  if (raw === true) return new Date(9999, 11, 31);
  const s = String(raw).trim();
  if (!s) return null;

  if (/^(present|current|ongoing)$/i.test(s)) {
    return new Date(9999, 11, 31);
  }

  const iso = Date.parse(s);
  if (!isNaN(iso)) return new Date(iso);

  const yearOnly = s.match(/^(\d{4})$/);
  if (yearOnly) {
    const y = parseInt(yearOnly[1], 10);
    return preferStartOfPeriod ? new Date(y, 0, 1) : new Date(y, 11, 31);
  }

  const mY = s.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (mY) {
    const monthName = mY[1].toLowerCase() as MonthKey;
    const year = parseInt(mY[2], 10);
    const monthIndex = MONTHS[monthName];
    if (monthIndex !== undefined) {
      return preferStartOfPeriod ? new Date(year, monthIndex, 1) : new Date(year, monthIndex + 1, 0);
    }
  }

  const yearMatch = s.match(/(\d{4})/);
  if (yearMatch) {
    const y = parseInt(yearMatch[1], 10);
    return new Date(y, 0, 1);
  }

  return null;
}

/**
 * dateForSorting (updated)
 * - Prefer end date (or Present/current) as the primary sort key.
 * - If no end date, use start date.
 * - Works with:
 *    - startDateISO / endDateISO
 *    - startDate / endDate (display strings)
 *    - date: "Jan 2022 - Present"
 *    - current: true
 */
export function dateForSorting(item: any): Date {
  if (!item) return new Date(0);

  // common fields
  const startISO = item.startDateISO ?? item.start ?? item.start_date ?? item.startDate ?? null;
  const endISO = item.endDateISO ?? item.end ?? item.end_date ?? item.endDate ?? null;

  // If explicit end ISO exists, prioritize it (prefer end-of-period)
  if (endISO) {
    const dEnd = parseFlexibleDate(endISO, { preferStartOfPeriod: false });
    if (dEnd) return dEnd;
  }

  // If item has `date` like "Jan 2022 - Present", prefer the right-hand (end) first
  if (item.date && typeof item.date === 'string') {
    const parts = item.date.split(/[-–—]/).map((p: string) => p.trim()).filter(Boolean);

    // Try right side (end) first
    if (parts.length >= 2) {
      const endCandidate = parts[1];
      const parsedEnd = parseFlexibleDate(endCandidate, { preferStartOfPeriod: false });
      if (parsedEnd) return parsedEnd;
    }

    // Fallback: try left side (start)
    if (parts.length >= 1) {
      const startCandidate = parts[0];
      const parsedStart = parseFlexibleDate(startCandidate, { preferStartOfPeriod: true });
      if (parsedStart) return parsedStart;
    }
  }

  // If explicit start ISO exists and no end, use start
  if (startISO) {
    const dStart = parseFlexibleDate(startISO, { preferStartOfPeriod: true });
    if (dStart) return dStart;
  }

  // If item has startDate / endDate display strings, try them (end first)
  if (item.endDate) {
    const d = parseFlexibleDate(item.endDate, { preferStartOfPeriod: false });
    if (d) return d;
  }
  if (item.startDate) {
    const d = parseFlexibleDate(item.startDate, { preferStartOfPeriod: true });
    if (d) return d;
  }

  // current true => treat as present
  if (item.current === true) return new Date(9999, 11, 31);

  // As a fallback, try issueDate or year-like fields
  if (item.issueDate) {
    const d = parseFlexibleDate(item.issueDate, { preferStartOfPeriod: false });
    if (d) return d;
  }

  // Title-year fallback
  if (typeof item.title === 'string') {
    const yearMatch = item.title.match(/(\d{4})/);
    if (yearMatch) return new Date(parseInt(yearMatch[1], 10), 0, 1);
  }

  return new Date(0);
}
