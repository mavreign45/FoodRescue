const dayFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

const numberFormat = new Intl.NumberFormat("en-US");

export function formatNumber(value) {
  return numberFormat.format(value ?? 0);
}

export function formatDay(value) {
  if (!value) return "";
  return dayFormat.format(new Date(value));
}

export function formatDate(value) {
  if (!value) return "";
  return dateFormat.format(new Date(value));
}

export function formatTime(value) {
  if (!value) return "";
  return timeFormat.format(new Date(value));
}

export function formatDateTime(value) {
  if (!value) return "";
  return `${dayFormat.format(new Date(value))} · ${timeFormat.format(new Date(value))}`;
}

export function isSameDay(a, b) {
  const first = new Date(a);
  const second = new Date(b);
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

/**
 * Readable pickup window, e.g. "Today, 4:30 – 6:30 PM".
 * Uses the browser's local timezone.
 */
export function formatPickupWindow(start, end) {
  if (!start || !end) return "";
  const startDate = new Date(start);
  const endDate = new Date(end);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  let dayLabel = formatDay(startDate);
  if (isSameDay(startDate, today)) dayLabel = "Today";
  else if (isSameDay(startDate, tomorrow)) dayLabel = "Tomorrow";

  return `${dayLabel}, ${formatTime(startDate)} – ${formatTime(endDate)}`;
}

export function getDeadlineMeta(end) {
  if (!end) {
    return { label: "No deadline", urgency: "normal", minutesLeft: null };
  }

  const minutesLeft = Math.round((new Date(end).getTime() - Date.now()) / 60000);

  if (minutesLeft <= 0) {
    return { label: "Pickup closed", urgency: "past", minutesLeft };
  }

  const hoursLeft = Math.floor(minutesLeft / 60);
  const remainder = minutesLeft % 60;
  let label;

  if (minutesLeft < 60) {
    label = `${minutesLeft} min left`;
  } else if (hoursLeft < 24) {
    label = `${hoursLeft}h${remainder ? ` ${remainder}m` : ""} left`;
  } else {
    const days = Math.floor(hoursLeft / 24);
    label = `${days} day${days === 1 ? "" : "s"} left`;
  }

  let urgency = "normal";
  if (minutesLeft <= 120) urgency = "urgent";
  else if (minutesLeft <= 360) urgency = "soon";

  return { label, urgency, minutesLeft };
}

export function formatRelativeTime(value) {
  if (!value) return "";
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));

  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return formatDate(value);
}

export function toLocalDateTimeInput(value) {
  const date = value ? new Date(value) : new Date();
  const pad = (part) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function addHours(value, hours) {
  const date = new Date(value);
  date.setHours(date.getHours() + hours);
  return date;
}

export function portionLabel(count) {
  return `${formatNumber(count)} portion${Number(count) === 1 ? "" : "s"}`;
}

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
