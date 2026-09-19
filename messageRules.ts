// messageRules.ts
interface Rule {
  test: (text: string) => string | null; // возвращает текст ответа или null
}

// Извлекает число из фразы вида "Итого: 2600 кк" (учитывает пробелы, запятую как разделитель)
function parseItogoKk(text: string): number | null {
  const match = text.match(/итого:?\s*([\d\s]+(?:[.,]\d+)?)\s*кк/i);
  if (!match) return null;

  const raw = match[1].replace(/\s/g, "").replace(",", ".");
  const num = Number(raw);
  return Number.isNaN(num) ? null : num;
}

export const rules: Rule[] = [
  {
    test: (text) => {
      const kk = parseItogoKk(text);
      if (kk !== null && kk > 3000) {
        return `Вот это мужские порции 🫨`;
      }
      if (kk !== null && kk > 2500) {
        return `Кто-то сегодня вкусно покушал 😏`;
      }
      if (kk !== null && kk < 1500) {
        return `Уж мог бы и не есть вообще 😄`;
      }
      return null;
    },
  },
];

export function checkRules(text: string): string | null {
  for (const rule of rules) {
    const result = rule.test(text);
    if (result) return result;
  }
  return null;
}
