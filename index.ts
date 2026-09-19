import { Bot } from "grammy";
import { config } from "dotenv";

import Fastify, { FastifyInstance } from "fastify";
import { startTelegramClient } from "./telegramClient";
import { startScheduler } from "./scheduler";
import "./handlers/welcome"; // регистрирует обработчик добавления бота в группу

// Подгружаем .env
config();

// Инициализируем fastify
const fastify = Fastify({ logger: false });

// Настраиваем сервер для прослушивания
fastify.listen({ port: 3005, host: "0.0.0.0" }, (err: any, address: any) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening on ${address}`);
  console.log(`\x1b[32mСервер запущен на ${address}\x1b[0m`);
});

// Получаем токен бота
const apiKey = process.env.BOT_API_KEY;
if (!apiKey) throw new Error("BOT_API_KEY не указан в .env");

// Создаем и экспортируем бота
export const bot = new Bot(apiKey);

// Основная точка входа
async function main() {
  try {
    // 1. Запуск Telegram Client API
    await startTelegramClient();

    // 2. Запуск Bot API
    await bot.start({
      onStart: () => console.log(`\x1b[32mБот запущен\x1b[0m`),
      drop_pending_updates: true,
      allowed_updates: [],
    });
  } catch (err) {
    console.error("Ошибка запуска:", err);
  }
}

// Запуск всего приложения
main();

// Запуск планировщика ежедневной рассылки
// (не внутри main, т.к. bot.start() блокирует выполнение до остановки бота)
startScheduler();