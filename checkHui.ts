const blockarr = [
  "хуй",
  "нахуй",
  "пизда",
  "идинахуй",
  "отъебись",
  "пиздец",
  "ебанат",
  "еблан",
  "ебало",
  "завали",
];

export function checkHui(text: string): boolean {
  return blockarr.some((word) => text.includes(word));
}
