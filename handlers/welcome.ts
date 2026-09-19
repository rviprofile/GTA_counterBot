// handlers/welcome.ts
import { bot } from "../index";
import { loadState, saveState } from "../storage";

bot.on("my_chat_member", async (ctx) => {
  const newStatus = ctx.myChatMember.new_chat_member.status;
  const oldStatus = ctx.myChatMember.old_chat_member.status;

  // Бота только что добавили в группу
  if (
    (oldStatus === "left" || oldStatus === "kicked") &&
    (newStatus === "member" || newStatus === "administrator")
  ) {
    const chatId = ctx.chat.id;
    const state = loadState();
    state.chatId = chatId;
    saveState(state);

    await ctx.api.sendMessage(chatId, "Привет! Я буду напоминать, сколько дней осталось до события 🎉");
  }
});