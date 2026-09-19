// storage.ts
import { getStore } from "@netlify/blobs";

interface State {
  chatId: number | null;
  eventDate: string;
}

const STORE_NAME = "bot-state";
const KEY = "state";

export async function loadState(): Promise<State> {
  const store = getStore(STORE_NAME);
  const data = await store.get(KEY, { type: "json" });
  return (data as State) ?? { chatId: null, eventDate: "2026-12-31" };
}

export async function saveState(state: State): Promise<void> {
  const store = getStore(STORE_NAME);
  await store.setJSON(KEY, state);
}