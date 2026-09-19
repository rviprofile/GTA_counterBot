// netlify/functions/webhook.ts
import { Bot, webhookCallback } from "grammy";
import type { Config } from "@netlify/functions";
import { loadState, saveState } from "../../storage";
import { getDaysLeftText } from "../../daysLeft";

const apiKey = process.env.BOT_API_KEY;
if (!apiKey) throw new Error("BOT_API_KEY не указан");

const bot = new Bot(apiKey);

// Приветствие при добавлении в группу
bot.on("my_chat_member", async (ctx) => {
  const newStatus = ctx.myChatMember.new_chat_member.status;
  const oldStatus = ctx.myChatMember.old_chat_member.status;

  if (
    (oldStatus === "left" || oldStatus === "kicked") &&
    (newStatus === "member" || newStatus === "administrator")
  ) {
    const chatId = ctx.chat.id;
    const state = await loadState();
    state.chatId = chatId;
    await saveState(state);

    await ctx.api.sendMessage(
      chatId,
      "Привет! Я буду напоминать, через сколько дней Вова сможет выпить 🍸",
    );
  }
});

// Ответ на упоминание бота в группе
bot.on("message:text", async (ctx) => {
  const text = ctx.message.text;
  const botUsername = ctx.me.username;
  const mentioned = ctx
    .entities("mention")
    .some(
      (entity) => entity.text.toLowerCase() === `@${botUsername.toLowerCase()}`,
    );

  const kk = Number(
    text.slice(text.indexOf("Итого:"), text.indexOf("кк")).trim(),
  );

  if (mentioned && !kk) {
    const state = await loadState();
    const reply = getDaysLeftText(state.eventDate);

    await ctx.reply(reply, { parse_mode: "HTML" });
  }

  if (text.includes("Итого:")) {
    if (kk && kk > 2500) {
      const reply = `${kk}? Кто-то сегодня вкусно покушал 😏`;

      await ctx.reply(reply, { parse_mode: "HTML" });
    }
  }
});

export default webhookCallback(bot, "std/http");

export const config: Config = {
  path: "/webhook",
};
