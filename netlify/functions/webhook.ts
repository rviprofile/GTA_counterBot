// netlify/functions/webhook.ts
import { Bot, webhookCallback } from "grammy";
import type { Config, Context } from "@netlify/functions";
import { loadState, saveState } from "../../storage";

const apiKey = process.env.BOT_API_KEY;
if (!apiKey) throw new Error("BOT_API_KEY не указан");

const bot = new Bot(apiKey);

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

    await ctx.api.sendMessage(chatId, "Привет! Я буду напоминать, сколько дней осталось до события 🎉");
  }
});

export default webhookCallback(bot, "std/http");

export const config: Config = {
  path: "/webhook",
};