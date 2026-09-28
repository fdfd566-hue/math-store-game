/* حفظ النتائج: مرآة محلية + إرسال إلى قاعدة بيانات خارجية عند توفرها.

   لإضافة قاعدة بيانات حقيقية (PostgreSQL / Supabase / أي REST API)
   يكفي ضبط قيمة NEXT_PUBLIC_RESULTS_API على مسار الـ API، مثل:
   /api/results
   وسيتم إرسال كل نتيجة بـ POST، وجلب لوحة الصدارة بـ GET من نفس المسار.
   الشكل المتوقع للاستجابة: مصفوفة من النتائج كما في نوع Score.
*/

export type Score = {
  id: string;
  name: string;
  points: number;
  correct: number;
  errors: number;
  seconds: number;
  level: string;
  date: string;
};

const STORAGE_KEY = "najmat-aljam-board-v1";
// استبدلي هذا المسار بمسار الـ API الخاص بقاعدة البيانات عند النشر
const API_URL = "/api/results";

const seed: Score[] = [
  {
    id: "seed-1",
    name: "سارة",
    points: 95,
    correct: 10,
    errors: 0,
    seconds: 132,
    level: "متجر نجمة الجمع ⭐",
    date: "2026-01-12",
  },
  {
    id: "seed-2",
    name: "نورة",
    points: 88,
    correct: 9,
    errors: 1,
    seconds: 148,
    level: "متجر نجمة الجمع ⭐",
    date: "2026-01-12",
  },
  {
    id: "seed-3",
    name: "ريم",
    points: 82,
    correct: 9,
    errors: 1,
    seconds: 171,
    level: "متجر نجمة الجمع ⭐",
    date: "2026-01-11",
  },
  {
    id: "seed-4",
    name: "جواهر",
    points: 76,
    correct: 8,
    errors: 2,
    seconds: 163,
    level: "متجر نجمة الجمع ⭐",
    date: "2026-01-10",
  },
  {
    id: "seed-5",
    name: "لين",
    points: 70,
    correct: 8,
    errors: 3,
    seconds: 190,
    level: "متجر نجمة الجمع ⭐",
    date: "2026-01-10",
  },
];

const readLocal = (): Score[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Score[]) : [];
  } catch {
    return [];
  }
};

const writeLocal = (scores: Score[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores.slice(0, 60)));
  } catch {
    /* تجاهل */
  }
};

export const sortScores = (scores: Score[]): Score[] =>
  [...scores].sort(
    (a, b) =>
      b.points - a.points ||
      b.correct - a.correct ||
      a.errors - b.errors ||
      a.seconds - b.seconds
  );

export const loadBoard = async (): Promise<Score[]> => {
  let remote: Score[] = [];
  try {
    const res = await fetch(API_URL, { headers: { Accept: "application/json" } });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.results;
      if (Array.isArray(list)) remote = list as Score[];
    }
  } catch {
    /* لا يوجد خادم بعد — نكتفي بالحفظ المحلي */
  }
  const merged = [...seed, ...readLocal(), ...remote];
  const seen = new Set<string>();
  const unique = merged.filter((s) => {
    const key = `${s.name}-${s.points}-${s.date}-${s.seconds}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return sortScores(unique).slice(0, 40);
};

export const saveScore = async (score: Score): Promise<Score[]> => {
  const local = readLocal();
  writeLocal([...local, score]);
  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(score),
    });
  } catch {
    /* لا يوجد خادم بعد */
  }
  return loadBoard();
};
