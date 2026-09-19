// netlify/functions/daily-reminder.ts
import type { Config } from "@netlify/functions";
import { Bot } from "grammy";
import { loadState } from "../../storage";
import { getDaysLeftText } from "../../daysLeft";

const apiKey = process.env.BOT_API_KEY;
if (!apiKey) throw new Error("BOT_API_KEY не указан");

const bot = new Bot(apiKey);

export default async () => {
  const state = await loadState();
  if (!state.chatId) return new Response("Нет активного чата", { status: 200 });

  const text = getDaysLeftText(state.eventDate);
  await bot.api.sendMessage(state.chatId, text);

  return new Response("OK", { status: 200 });
};

export const config: Config = {
  schedule: "0 4 * * *",
};
