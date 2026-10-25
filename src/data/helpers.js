export function minutesAgo(minutes) {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutes);
  return date.toISOString();
}

export function minutesFromNow(minutes) {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

export function hoursFromNow(hours) {
  return minutesFromNow(Math.round(hours * 60));
}

export function daysAgo(days, hour = 16, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export function daysFromNow(days, hour = 12, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

/**
 * Sample pickup windows should always land inside plausible service hours.
 * If a relative window would start before 7:00 or end after 22:30, it is
 * pushed to 09:00 the next morning (and shortened if it still overruns).
 */
export function pickupWindow(startOffsetMinutes, durationMinutes) {
  let start = new Date(Date.now() + startOffsetMinutes * 60000);
  let end = new Date(start.getTime() + durationMinutes * 60000);

  const hourOf = (date) => date.getHours() + date.getMinutes() / 60;
  const startHour = hourOf(start);
  const endHour = hourOf(end);

  if (startHour < 7 || endHour > 22.5) {
    const next = new Date();
    next.setDate(next.getDate() + 1);
    next.setHours(9, 0, 0, 0);

    start = next;
    end = new Date(next.getTime() + durationMinutes * 60000);

    if (hourOf(end) > 21.5) {
      end = new Date(next);
      end.setHours(21, 30, 0, 0);
    }
  }

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}
