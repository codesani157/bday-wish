import { fromZonedTime } from 'date-fns-tz';
import { isLeapYear, getYear } from 'date-fns';

export function calculateNextSendAtUtc(
  birthdateStr: string, // YYYY-MM-DD
  timezone: string,     // IANA timezone
  defaultLocalTime: string = '09:00' // HH:mm
): Date {
  const now = new Date();
  const currentYear = getYear(now);
  
  const [bYear, bMonth, bDay] = birthdateStr.split('-').map(Number);
  
  let targetMonth = bMonth;
  let targetDay = bDay;

  // Leap year handling: if born Feb 29 and current year is NOT leap, use Feb 28
  if (targetMonth === 2 && targetDay === 29 && !isLeapYear(new Date(currentYear, 0, 1))) {
    targetDay = 28;
  }

  const isoString = `${currentYear}-${String(targetMonth).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}T${defaultLocalTime}:00`;
  let targetUtc = fromZonedTime(isoString, timezone);

  // If this time has already passed this year, schedule for next year
  if (targetUtc < now) {
    const nextYear = currentYear + 1;
    let nextTargetDay = bDay;
    if (targetMonth === 2 && nextTargetDay === 29 && !isLeapYear(new Date(nextYear, 0, 1))) {
      nextTargetDay = 28;
    }
    const nextIsoString = `${nextYear}-${String(targetMonth).padStart(2, '0')}-${String(nextTargetDay).padStart(2, '0')}T${defaultLocalTime}:00`;
    targetUtc = fromZonedTime(nextIsoString, timezone);
  }

  return targetUtc;
}
