// scheduler.ts
import cron from "node-cron";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { bot } from "./index";
import { loadState } from "./storage";

export function startScheduler() {
  // Каждый день в 09:00 по времени сервера (см. пояснение ниже про таймзону)
  cron.schedule("0 9 * * *", async () => {
    const state = loadState();
    if (!state.chatId) return;

    const today = new Date();
    const eventDate = parseISO(state.eventDate);
    const daysLeft = differenceInCalendarDays(eventDate, today);

    let text: string;
    if (daysLeft > 0) {
      text = `До события осталось ${daysLeft} дн.`;
    } else if (daysLeft === 0) {
      text = "Событие сегодня! 🎉";
    } else {
      text = "Событие уже прошло.";
    }

    await bot.api.sendMessage(state.chatId, text);
  }, {
    timezone: "Asia/Yekaterinburg", 
  });
}