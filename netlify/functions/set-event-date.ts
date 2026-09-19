// netlify/functions/set-event-date.ts
import type { Config } from "@netlify/functions";
import { loadState, saveState } from "../../storage";

export default async (req: Request) => {
  const url = new URL(req.url);
  const eventDate = url.searchParams.get("date"); // например ?date=2026-11-19

  if (!eventDate) {
    return new Response("Укажи ?date=YYYY-MM-DD", { status: 400 });
  }

  const state = await loadState();
  state.eventDate = eventDate;
  await saveState(state);

  return new Response(`Дата обновлена: ${eventDate}`, { status: 200 });
};

export const config: Config = {
  path: "/set-event-date",
};