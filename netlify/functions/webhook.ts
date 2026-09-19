// netlify/functions/webhook.ts
import { Bot, webhookCallback } from "grammy";
import type { Config } from "@netlify/functions";
import { loadState, saveState } from "../../storage";
import { getDaysLeftText } from "../../daysLeft";
import { checkRules } from "../../messageRules";
import { checkHui } from "../../checkHui";

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

bot.on("message:text", async (ctx) => {
  const text = ctx.message.text;

  // 1. Проверка упоминания бота
  const botUsername = ctx.me.username;
  const mentioned = ctx
    .entities("mention")
    .some(
      (entity) => entity.text.toLowerCase() === `@${botUsername.toLowerCase()}`,
    );

  if (mentioned) {
    if (checkHui(text)) {
      await ctx.replyWithAnimation(
        "https://grandcountdown.netlify.app/tiha.mp4",
      );
      return;
    }

    const state = await loadState();
    const reply = getDaysLeftText(state.eventDate);
    await ctx.reply(reply, { parse_mode: "HTML" });
    return; // если это было упоминание, дальше правила не проверяем
  }

  // 2. Проверка остальных правил (например, "Итого: N кк")
  const ruleReply = checkRules(text);
  if (ruleReply) {
    await ctx.reply(ruleReply, { parse_mode: "HTML" });
  }
});

export default webhookCallback(bot, "std/http");

export const config: Config = {
  path: "/webhook",
};
