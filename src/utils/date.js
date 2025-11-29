// utils/dates.js
const MONTHS = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11
  };
  
  export function parseFlexibleDate(raw, { preferStartOfPeriod = true } = {}) {
    if (!raw && raw !== 0) return null;
    if (raw === true) return new Date(9999, 11, 31); // guard: current:true
    const s = String(raw).trim();
    if (!s) return null;
  
    // treat common "Present"/"Present " etc.
    if (/^(present|current|ongoing)$/i.test(s)) {
      return new Date(9999, 11, 31); // treat as far future
    }
  
    // ISO date parse attempt
    const iso = Date.parse(s);
    if (!isNaN(iso)) return new Date(iso);
  
    // Year only: "2023"
    const yearOnly = s.match(/^(\d{4})$/);
    if (yearOnly) {
      const y = parseInt(yearOnly[1], 10);
      return preferStartOfPeriod ? new Date(y, 0, 1) : new Date(y, 11, 31);
    }
  
    // Month Year: "January 2022" or "Jan 2022"
    const mY = s.match(/^([A-Za-z]+)\s+(\d{4})$/);
    if (mY) {
      const monthName = mY[1].toLowerCase();
      const year = parseInt(mY[2], 10);
      const monthIndex = MONTHS[monthName];
      if (monthIndex !== undefined) {
        return preferStartOfPeriod ? new Date(year, monthIndex, 1) : new Date(year, monthIndex + 1, 0);
      }
    }
  
    // Fallback: try parsing "MMM YYYY - MMM YYYY" YYYY etc.
    // Try to extract any 4-digit year and build a date using Jan 1
    const yearMatch = s.match(/(\d{4})/);
    if (yearMatch) {
      const y = parseInt(yearMatch[1], 10);
      return new Date(y, 0, 1);
    }
  
    return null;
  }

export function dateForSorting(item) {
  // try ISO fields first, fall back to display strings, then `current` flag
  // Common model possibilities:
  // item.startDateISO (preferred), item.startDate (display string like "January 2022")
  // item.endDateISO, item.endDate, item.current (boolean)

  const start = item.startDateISO ?? item.startDate ?? null;
  const end = item.endDateISO ?? item.endDate ?? null;

  // We'll sort primarily by start (newer start first).
  // When start missing, fallback to end.

  const parsedStart = parseFlexibleDate(start, { preferStartOfPeriod: true });
  const parsedEnd = parseFlexibleDate(end, { preferStartOfPeriod: false });

  // If current true, treat end as far future (already handled by parseFlexibleDate if you pass 'current' as string)
  // Return the primary date to use in sorting.

  return parsedStart || parsedEnd || new Date(0); // earliest fallback
}
  