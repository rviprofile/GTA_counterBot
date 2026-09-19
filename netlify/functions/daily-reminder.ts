// netlify/functions/daily-reminder.ts
import type { Config } from "@netlify/functions";
import { Bot } from "grammy";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { loadState } from "../../storage";

const apiKey = process.env.BOT_API_KEY;
if (!apiKey) throw new Error("BOT_API_KEY не указан");

const bot = new Bot(apiKey);

export default async () => {
  const state = await loadState();
  if (!state.chatId) return new Response("Нет активного чата", { status: 200 });

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
  return new Response("OK", { status: 200 });
};

// Расписание в формате cron. Пример: каждый день в 04:00 UTC (09:00 Екб, UTC+5)
export const config: Config = {
  schedule: "0 4 * * *",
};