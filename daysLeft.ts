// daysLeft.ts
import { differenceInCalendarDays, parseISO } from "date-fns";

export function getDaysLeftText(eventDate: string): string {
  const today = new Date();
  const date = parseISO(eventDate);
  const daysLeft = differenceInCalendarDays(date, today);

  if (daysLeft > 0) {
    return buildCountdownMessage(daysLeft);
  } else if (daysLeft === 0) {
    return "🎉🍾🥂 <b>СЕГОДНЯ ТОТ САМЫЙ ДЕНЬ!</b> 🥂🍾🎉\n\nВремя пришло. Погнали!";
  } else {
    return "✅ Событие уже прошло. Ждём следующего повода 🙂";
  }
}

function buildCountdownMessage(daysLeft: number): string {
  const word = pluralizeRu(daysLeft, "день", "дня", "дней");
  const vibe = getVibe(daysLeft);

  return (
    `${vibe.emoji} <b>${vibe.title}</b>\n\n` +
    `⏳ Осталось: <b>${daysLeft} ${word}</b>\n\n` +
    `<i>${vibe.subtitle}</i>`
  );
}

function getVibe(daysLeft: number): {
  emoji: string;
  title: string;
  subtitle: string;
} {
  if (daysLeft <= 3) {
    return {
      emoji: "🚨",
      title: "СОВСЕМ СКОРО!",
      subtitle: "Финальный отсчёт пошёл, приготовьтесь 🔥",
    };
  }
  if (daysLeft <= 7) {
    return {
      emoji: "⚡",
      title: "Неделя до события",
      subtitle: "Время начинать готовиться серьёзно",
    };
  }
  if (daysLeft <= 30) {
    return {
      emoji: "📅",
      title: "Уже меньше месяца",
      subtitle: "Ждать осталось не так уж и долго",
    };
  }
  return {
    emoji: "🕰",
    title: "Отсчёт продолжается",
    subtitle: getRandomPhrase(waitingPhrases),
  };
}

function pluralizeRu(count: number, one: string, few: string, many: string) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
function getRandomPhrase(phrases: string[]): string {
  const index = Math.floor(Math.random() * phrases.length);
  return phrases[index];
}

const waitingPhrases: string[] = [
  `Пока просто держимся`,
  `В целом осталось не много`,
  `Главное не сдаваться`,
  `Ещё чуть-чуть и всё получится. Ну как чуть-чуть...`,
  `Продолжаем в том же духе`,
  `Совсем скоро финиш`,
  `Держим курс дальше`,
  `Терпение — и всё будет`,
  `Потихоньку двигаемся к цели`,
  `...`,
];
