// storage.ts
import fs from "fs";
import path from "path";

const STORAGE_PATH = path.join(__dirname, "../data/state.json");

interface State {
  chatId: number | null;
  eventDate: string; // ISO-строка, например "2026-12-31"
}

const defaultState: State = { chatId: null, eventDate: "2026-11-19" };

export function loadState(): State {
  if (!fs.existsSync(STORAGE_PATH)) {
    fs.mkdirSync(path.dirname(STORAGE_PATH), { recursive: true });
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(defaultState, null, 2));
  }
  return JSON.parse(fs.readFileSync(STORAGE_PATH, "utf-8"));
}

export function saveState(state: State) {
  fs.writeFileSync(STORAGE_PATH, JSON.stringify(state, null, 2));
}