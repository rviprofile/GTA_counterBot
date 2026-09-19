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
  "блять",
  "бля",
];

export function checkHui(text: string): boolean {
  return blockarr.some((word) => text.includes(word));
}
