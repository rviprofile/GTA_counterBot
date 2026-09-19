// daysLeft.ts
import { differenceInCalendarDays, parseISO } from "date-fns";

export function getDaysLeftText(eventDate: string): string {
  const today = new Date();
  const date = parseISO(eventDate);
  const daysLeft = differenceInCalendarDays(date, today);

  if (daysLeft > 0) {
    return `Осталось ${daysLeft} дн`;
  } else if (daysLeft === 0) {
    return "Событие сегодня! 🍷🍾🍺🥂";
  } else {
    return "Событие уже прошло";
  }
}
