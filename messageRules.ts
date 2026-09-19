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
        return getRandomPhrase(highIntakePhrases);
      }
      if (kk !== null && kk > 2500) {
        return getRandomPhrase(Over2500phrases);
      }
      if (kk !== null && kk < 1500) {
        return getRandomPhrase(Under1800phrases);
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

const Over2500phrases: string[] = [
  `Кто-то сегодня вкусно покушал 😏`,
  `Кажется, сегодня был знатный пир 😏`,
  `Ого, неплохо так подкрепились сегодня 😏`,
  `Сегодня явно не обошлось без вкусняшек 😏`,
  `Похоже, аппетит сегодня был что надо 😏`,
  `Кто-то сегодня знатно наелся 😏`,
  `Судя по всему, сегодня было вкусно 😏`,
  `Кажется, сегодня был день без ограничений 😏`,
  `Ого, сегодня явно не постились 😏`,
  `Кто-то сегодня себя побаловал 😏`,
];

const Under1800phrases: string[] = [
  `Мне кажется, даже я больше ем 😄`,
  `Ничего себе, целый листик салата осилили 😄`,
  `Ого, прямо пир на весь мир... 😄`,
  `Похоже, кто-то решил стать невидимкой 😄`,
  `Так и до просветления недалеко, с таким-то рационом 😄`,
  `Воробей и то плотнее покушал 😄`,
  `Сегодня явно готовились к зимней спячке заранее 😄`,
  `Может, хватит уже так себя жалеть — поешьте нормально 😄`,
  `Ещё немного, и можно будет питаться воздухом 😄`,
  `Судя по всему, диета "ничего не есть" в самом разгаре 😄`,
];

const highIntakePhrases: string[] = [
  `Вот это мужские порции 🫨`,
  `Ничего себе 🫨`,
  `Кажется, здесь наелись за всю неделю сразу 🫨`,
  `Ого, холодильник теперь можно продавать пустым 🫨`,
  `Это был обед или марафон 🫨`,
  `Судя по масштабам, готовились к зиме 🫨`,
  `Кто-то сегодня решил побить рекорд 🫨`,
  `Это уже не порция, а целый банкет 🫨`,
  `Похоже, сегодня объявили день без границ 🫨`,
  `Вот это разгон после диеты 🫨`,
];

function getRandomPhrase(phrases: string[]): string {
  const index = Math.floor(Math.random() * phrases.length);
  return phrases[index];
}
