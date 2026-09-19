require("dotenv").config();

const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");
const fs = require("fs");

const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH;
const sessionFilePath = "./session.txt";

let stringSession = "";
if (fs.existsSync(sessionFilePath)) {
  stringSession = fs.readFileSync(sessionFilePath, "utf-8");
}

export const client = new TelegramClient(
  new StringSession(stringSession),
  apiId,
  apiHash,
  { connectionRetries: 5 }
);

export async function startTelegramClient() {
  await client.start({
    phoneNumber: async () => await input.text("Введите ваш номер телефона: "),
    password: async () => await input.text("Введите ваш пароль: "),
    phoneCode: async () =>
      await input.text("Введите код, отправленный на ваш номер: "),
    onError: (err: any) => console.log(err),
  });

  const savedSession = client.session.save();
  fs.writeFileSync(sessionFilePath, savedSession);
  console.log(`\x1b[32mTelegram клиент запущен\x1b[0m`);
}

async function ensureConnected() {
  if (!client.connected) {
    console.log("Клиент не подключен. Подключаем...");
    await client.connect();
    console.log(`\x1b[32mTelegram клиент подключен\x1b[0m`);
  }
}