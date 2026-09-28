/* منطق لعبة متجر نجمة الجمع — الجمع فقط */

/** تحويل الأرقام الإنجليزية إلى الأرقام الهندية العربية */
export const ar = (v: number | string): string =>
  String(v).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);

export type Product = { id: string; emoji: string; name: string };

export const PRODUCTS: Product[] = [
  { id: "apple", emoji: "🍎", name: "تفاحة" },
  { id: "orange", emoji: "🍊", name: "برتقالة" },
  { id: "juice", emoji: "🧃", name: "عصير" },
  { id: "cookie", emoji: "🍪", name: "بسكويت" },
  { id: "donut", emoji: "🍩", name: "دونات" },
  { id: "cupcake", emoji: "🧁", name: "كب كيك" },
  { id: "doll", emoji: "🧸", name: "دمية" },
  { id: "balloon", emoji: "🎈", name: "بالون" },
  { id: "gift", emoji: "🎁", name: "هدية" },
  { id: "book", emoji: "📚", name: "كتاب" },
  { id: "flower", emoji: "🌸", name: "زهرة" },
  { id: "pencil", emoji: "✏️", name: "قلم" },
  { id: "bag", emoji: "👜", name: "حقيبة" },
  { id: "berry", emoji: "🍓", name: "فراولة" },
  { id: "candy", emoji: "🍭", name: "حلوى" },
];

/* قواعد اللعبة: ثلاثة منتجات في كل سؤال، وسعر كل منتج من ١ إلى ٩ */
export const ITEMS_PER_QUESTION = 3;
export const PRICE_MIN = 1;
export const PRICE_MAX = 9;

export const GAME_TITLE = "متجر نجمة الجمع ⭐";

/** أسعار المنتجات في الجولة — كل سعر عدد صحيح من ١ إلى ٩ */
export type Prices = Record<string, number>;

export type Picked = { product: Product; price: number };

export const QUESTIONS_PER_ROUND = 10;

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/** يبني جدول أسعار الجولة: سعر كل منتج بين ١ و ٩ */
export function buildPrices(used: Set<string>): Prices {
  let prices: Prices = {};
  for (let attempt = 0; attempt < 30; attempt++) {
    prices = {};
    for (const p of PRODUCTS)
      prices[p.id] = rand(PRICE_MIN, PRICE_MAX);
    const key = Object.values(prices)
      .sort((a, b) => a - b)
      .join("-");
    if (!used.has(key)) {
      used.add(key);
      break;
    }
  }
  return prices;
}

/** خيارات الإجابة: إجابة صحيحة واحدة فقط، وخيارات قريبة منها */
export function buildOptions(sum: number): number[] {
  const offsets = shuffle([-3, -2, -1, 1, 2, 3]);
  const wrong: number[] = [];
  for (const off of offsets) {
    const cand = sum + off;
    if (cand > 0 && cand !== sum && !wrong.includes(cand)) wrong.push(cand);
    if (wrong.length === 2) break;
  }
  let guard = 1;
  while (wrong.length < 2) {
    const cand = sum + guard;
    if (cand > 0 && !wrong.includes(cand)) wrong.push(cand);
    guard += 1;
  }
  return shuffle([sum, ...wrong]);
}

/** المعادلة بصيغة الأرقام الهندية: ٦ + ٣ + ٢ = ؟ */
export const buildEquation = (prices: number[]): string =>
  prices.map((v) => ar(v)).join(" + ") + " = ؟";

export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${ar(m)}:${ar(String(s).padStart(2, "0"))}`;
};
