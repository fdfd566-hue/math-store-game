import { supabase } from "./supabase";

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
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(scores.slice(0, 60))
    );
  } catch {
    // تجاهل خطأ التخزين المحلي
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
    const { data, error } = await supabase
      .from("scores")
      .select("*");

    if (!error && Array.isArray(data)) {
      remote = data as Score[];
    } else if (error) {
      console.error("Supabase load error:", error);
    }
  } catch (error) {
    console.error("Supabase connection error:", error);
  }

  const local = readLocal();

  const merged = [...local, ...remote];

  const seen = new Set<string>();

  const unique = merged.filter((score) => {
    const key = `${score.name}-${score.points}-${score.date}-${score.seconds}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });

  return sortScores(unique).slice(0, 40);
};

export const saveScore = async (
  score: Score
): Promise<Score[]> => {
  // حفظ نسخة محلية احتياطية
  const local = readLocal();
  writeLocal([...local, score]);

  // حفظ النتيجة في قاعدة بيانات Supabase
  try {
    const { error } = await supabase
      .from("scores")
      .insert([score]);

    if (error) {
      console.error("Supabase save error:", error);
    }
  } catch (error) {
    console.error("Supabase connection error:", error);
  }

  // تحديث لوحة الشرف
  return loadBoard();
};