import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BigButton,
  Plank,
  PriceTag,
  ProductTile,
  StarBurst,
} from "./Chrome";
import {
  ar,
  buildEquation,
  buildOptions,
  buildPrices,
  formatTime,
  GAME_TITLE,
  ITEMS_PER_QUESTION,
  PRICE_MAX,
  PRICE_MIN,
  PRODUCTS,
  QUESTIONS_PER_ROUND,
  type Picked,
  type Prices,
} from "./game";
import type { Score } from "./board";
import { CELEBRATE_IMG, SHOP_IMG } from "./assets";
import {
  playCelebrate,
  playCorrect,
  playDrop,
  playTap,
  playWrong,
} from "./audio";

export type RoundResult = {
  name: string;
  points: number;
  correct: number;
  errors: number;
  seconds: number;
};

const chunk = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const PRODUCT_ROWS = chunk(PRODUCTS, 5);

/* ═════════════════════════ الشاشة الرئيسية ═════════════════════════ */
export const HomeScreen = ({
  onStart,
  onBoard,
}: {
  onStart: () => void;
  onBoard: () => void;
}) => (
  <div className="mx-auto w-[min(94vw,1080px)] px-2 pt-10">
    <div className="relative min-h-[clamp(240px,42vw,460px)] overflow-hidden rounded-[32px] border-[6px] border-white/80 bg-berry-light shadow-[0_28px_60px_-30px_rgba(74,43,77,0.65)]">
      <img
        src={SHOP_IMG}
        alt="متجر الأطفال الملوّن"
        className="h-[clamp(240px,42vw,460px)] w-full object-cover"
        onError={(e) => {
          const el = e.currentTarget as HTMLImageElement;
          el.style.display = "none";
          el.parentElement?.classList.add("plank");
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-center md:p-9">
        <p className="font-display text-[clamp(1.7rem,5.4vw,3.1rem)] leading-tight font-extrabold text-ink">
          مرحباً يا بطلة الجمع! 🌟
        </p>
        <p className="mt-2 font-body text-[clamp(1rem,3.2vw,1.5rem)] font-medium text-berry-dark">
          هيا نتسوق ونحسب المجموع!
        </p>
      </div>
    </div>

    <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
      <BigButton onClick={onStart} tone="berry" className="px-12 py-5">
        ابدئي اللعب 🛍️
      </BigButton>
      <BigButton onClick={onBoard} tone="marigold">
        🏆 بطلات الجمع
      </BigButton>
    </div>

    <div className="mx-auto mt-11 w-full rounded-[26px] border-[3px] border-dashed border-berry/35 bg-sugar/80 px-5 py-6">
      <ul className="flex flex-col items-center gap-4 text-center sm:flex-row sm:gap-0">
        {[
          { g: "🧺", t: "اختاري المنتجات", d: "من رفوف المتجر" },
          { g: "➕", t: "اجمعي الأسعار", d: "وسجّلي المجموع" },
          { g: "⭐", t: "اجمعي النجوم", d: "وأميزي لوحة الشرف" },
        ].map((s, i) => (
          <li
            key={s.t}
            className={`flex-1 px-4 ${i < 2 ? "sm:border-l-[3px] sm:border-dashed sm:border-berry/25" : ""}`}
          >
            <div className="text-4xl">{s.g}</div>
            <p className="mt-2 font-display text-xl font-bold text-ink">
              {s.t}
            </p>
            <p className="font-body text-sm text-ink-soft">{s.d}</p>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

/* ═════════════════════════ اسم الطالبة ═════════════════════════ */
export const NameScreen = ({
  onStart,
  onBack,
}: {
  onStart: (name: string) => void;
  onBack: () => void;
}) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("اكتبي اسمك أولاً يا بطلة 🌷");
      return;
    }
    onStart(trimmed);
  };

  return (
    <div className="mx-auto w-[min(94vw,860px)] px-2 pt-10">
      <div className="rounded-[30px] border-[5px] border-white/80 bg-sugar p-6 shadow-[0_26px_55px_-30px_rgba(74,43,77,0.6)] md:p-10">
        <h2 className="text-center font-display text-[clamp(1.6rem,5vw,2.6rem)] font-extrabold text-ink">
          ما اسم بطلة الجمع؟ 🌷
        </h2>

        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="اكتبي اسمك هنا…"
          aria-label="اسم الطالبة"
          className="mx-auto mt-6 block w-full max-w-md rounded-2xl border-[3px] border-berry/30 bg-cream px-5 py-4 text-center font-display text-2xl font-bold text-ink placeholder:font-body placeholder:text-lg placeholder:font-normal placeholder:text-ink-soft/60 focus:border-mint"
        />
        {error && (
          <p className="mt-3 text-center font-body text-base text-berry-dark">
            {error}
          </p>
        )}

        <div className="mt-8 rounded-2xl border-[3px] border-dashed border-berry/30 bg-cream px-5 py-5">
          <p className="text-center font-display text-xl font-bold text-ink">
            طريقة اللعب 🛍️
          </p>
          <ul className="mt-3 space-y-2 text-center font-body text-lg text-ink-soft">
            <li>🧺 في كل سؤال تختارين {ar(ITEMS_PER_QUESTION)} منتجات</li>
            <li>
              💰 سعر كل منتج من {ar(PRICE_MIN)} إلى {ar(PRICE_MAX)} ريالات
            </li>
            <li>➕ ثم تحسبين المجموع وتختارين الإجابة الصحيحة</li>
          </ul>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <BigButton onClick={submit} tone="mint" className="px-10">
            ابدئي المغامرة ⭐
          </BigButton>
          <BigButton onClick={onBack} tone="ink">
            الرئيسية 🏠
          </BigButton>
        </div>
      </div>
    </div>
  );
};

/* ═════════════════════════ شاشة اللعب ═════════════════════════ */
export const PlayScreen = ({
  name,
  onFinish,
  onQuit,
}: {
  name: string;
  onFinish: (r: RoundResult) => void;
  onQuit: () => void;
}) => {
  const questions = useMemo<Prices[]>(() => {
    const used = new Set<string>();
    return Array.from({ length: QUESTIONS_PER_ROUND }, () => buildPrices(used));
  }, []);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Picked[]>([]);
  const [phase, setPhase] = useState<"pick" | "answer" | "correct" | "wrong">(
    "pick"
  );
  const [chosen, setChosen] = useState<number | null>(null);
  const [wrongPicks, setWrongPicks] = useState<number[]>([]);
  const [sum, setSum] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [tries, setTries] = useState(0);
  const [points, setPoints] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [errors, setErrors] = useState(0);
  const [toast, setToast] = useState("");
  const startedAt = useRef(Date.now());

  const q = questions[index];

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const toggle = (product: (typeof PRODUCTS)[number]) => {
    if (phase !== "pick") return;
    const exists = selected.find((s) => s.product.id === product.id);
    if (exists) {
      playTap();
      setSelected(selected.filter((s) => s.product.id !== product.id));
      return;
    }
    if (selected.length >= ITEMS_PER_QUESTION) {
      setToast("اختاري ثلاثة منتجات فقط 🌷");
      return;
    }
    const price = q[product.id] ?? 1;
    playDrop();
    setSelected([...selected, { product, price }]);
  };

  // سعر المنتج على الرفّ في هذه الجولة
  const shelfPrice = (productId: string) => q[productId] ?? 1;

  const compute = () => {
    if (selected.length !== ITEMS_PER_QUESTION) {
      setToast("اختاري ثلاثة منتجات فقط 🌷");
      return;
    }
    const total = selected.reduce((t, s) => t + s.price, 0);
    setSum(total);
    setOptions(buildOptions(total));
    setChosen(null);
    setWrongPicks([]);
    setPhase("answer");
  };

  const answer = (value: number) => {
    if (phase === "correct" || wrongPicks.includes(value)) return;
    setChosen(value);
    if (value === sum) {
      playCorrect();
      setPoints((p) => p + (tries === 0 ? 10 : 5));
      setCorrectCount((c) => c + 1);
      setPhase("correct");
    } else {
      playWrong();
      setWrongPicks((w) => [...w, value]);
      setTries((t) => t + 1);
      setErrors((e) => e + 1);
      setPhase("wrong");
    }
  };

  const next = () => {
    if (index + 1 >= QUESTIONS_PER_ROUND) {
      onFinish({
        name,
        points,
        correct: correctCount,
        errors,
        seconds: Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)),
      });
      return;
    }
    setIndex((i) => i + 1);
    setSelected([]);
    setPhase("pick");
    setChosen(null);
    setWrongPicks([]);
    setTries(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const equationLine = selected.length
    ? buildEquation(selected.map((s) => s.price))
    : "؟";

  return (
    <div className="pb-2">
      <div className="mx-auto w-[min(94vw,1120px)] px-2 pt-8">
        {/* شريط التقدّم */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-[3px] border-dashed border-berry/30 bg-sugar/80 px-5 py-3">
          <p className="font-display text-lg font-bold text-ink">
            السؤال {ar(index + 1)} من {ar(QUESTIONS_PER_ROUND)}
          </p>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-mint-light px-3 py-1 font-display text-sm font-bold text-mint">
              🧺 {ar(ITEMS_PER_QUESTION)} منتجات
            </span>
            <span className="rounded-full bg-marigold/25 px-3 py-1 font-display text-sm font-bold text-marigold-deep">
              ⭐ {ar(points)} نقطة
            </span>
            <span className="rounded-full bg-berry-light px-3 py-1 font-display text-sm font-bold text-berry-dark">
              ✅ {ar(correctCount)} | ❌ {ar(errors)}
            </span>
          </div>
        </div>

        <h2 className="mt-7 text-center font-display text-[clamp(1.35rem,4.4vw,2.25rem)] font-extrabold text-ink">
          اختاري {ar(ITEMS_PER_QUESTION)} منتجات من الرفوف وضعيها في السلة 🧺
        </h2>

        {/* الرفوف */}
        <div className="mt-8 space-y-9">
          {PRODUCT_ROWS.map((row, rIdx) => (
            <div key={rIdx}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {row.map((product) => {
                  const isSelected = selected.some(
                    (s) => s.product.id === product.id
                  );
                  return (
                    <ProductTile
                      key={product.id}
                      product={product}
                      price={shelfPrice(product.id)}
                      selected={isSelected}
                      disabled={
                        phase !== "pick" ||
                        (!isSelected && selected.length >= ITEMS_PER_QUESTION)
                      }
                      onToggle={() => toggle(product)}
                    />
                  );
                })}
              </div>
              <Plank />
            </div>
          ))}
        </div>
        <p className="mt-6 text-center font-body text-sm text-ink-soft">
          💡 الأسعار مكتوبة على البطاقات الصفراء — اختاري فقط ما تريدان شراءه
        </p>
      </div>

      {/* ————— رفّ الكاشير: السلة والسؤال ————— */}
      <div className="sticky bottom-0 z-40 mt-10">
        <div className="mx-auto w-full max-w-[1180px] px-2">
          <div className="relative overflow-hidden rounded-t-[26px] border-[4px] border-b-0 border-white/70 bg-cream-deep shadow-[0_-22px_50px_-26px_rgba(74,43,77,0.75)]">
            <StarBurst show={phase === "correct"} />
            <div className="plank h-4 w-full" />
            <div className="max-h-[52vh] overflow-y-auto px-4 py-4 md:px-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                {/* السلة */}
                <div className="lg:w-[38%]">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🛒</span>
                    <h3 className="font-display text-xl font-bold text-ink">
                      سلة المشتريات
                    </h3>
                    <span className="rounded-full bg-berry px-2.5 py-0.5 font-display text-sm font-bold text-white">
                      {ar(selected.length)} / {ar(ITEMS_PER_QUESTION)}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <AnimatePresence initial={false}>
                      {selected.map((s) => (
                        <motion.button
                          key={s.product.id}
                          type="button"
                          initial={{ scale: 0.4, opacity: 0, y: 14 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          exit={{ scale: 0.4, opacity: 0, y: 14 }}
                          onClick={() => toggle(s.product)}
                          disabled={phase !== "pick"}
                          className="flex items-center gap-2 rounded-full border-2 border-mint/50 bg-white/85 px-3 py-1.5 font-display text-base font-bold text-ink disabled:cursor-default"
                        >
                          <span className="text-xl">{s.product.emoji}</span>
                          {s.product.name}
                          <PriceTag price={s.price} tone="mint" />
                          {phase === "pick" && (
                            <span className="text-berry">✕</span>
                          )}
                        </motion.button>
                      ))}
                    </AnimatePresence>
                    {selected.length === 0 && (
                      <p className="font-body text-sm text-ink-soft">
                        السلة فارغة… ابدئي باختيار{" "}
                        {ar(ITEMS_PER_QUESTION)} منتجات 🌷
                      </p>
                    )}
                  </div>
                </div>

                {/* السؤال والخيارات */}
                <div className="flex-1">
                  {phase === "pick" ? (
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <p className="font-body text-lg text-ink-soft">
                        بعد الاختيار احسبي المجموع يا بطلة 👇
                      </p>
                      <BigButton
                        onClick={compute}
                        tone="berry"
                        disabled={selected.length !== ITEMS_PER_QUESTION}
                      >
                        احسبي المجموع ➕
                      </BigButton>
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-wrap items-center gap-4">
                        <p className="font-body text-lg text-ink-soft">
                          كم ريالاً دفعتِ؟
                        </p>
                        <p className="rounded-xl bg-white/80 px-4 py-1 font-display text-[clamp(1.5rem,5vw,2.3rem)] font-extrabold tracking-wide text-ink">
                          {equationLine}
                        </p>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {options.map((opt) => {
                          const isCorrect = opt === sum;
                          const isChosen = opt === chosen;
                          const isFailed = wrongPicks.includes(opt);
                          const state =
                            phase === "correct"
                              ? isCorrect
                                ? "border-mint bg-mint text-white"
                                : "border-ink/15 bg-white/70 text-ink/60"
                              : isFailed
                                ? "border-ink/10 bg-white/50 text-ink/40 line-through"
                                : "border-ink/15 bg-white text-ink hover:border-marigold";
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => answer(opt)}
                              disabled={phase === "correct" || isFailed}
                              className={`min-w-[92px] rounded-2xl border-[3px] px-6 py-3 font-display text-[clamp(1.7rem,5vw,2.5rem)] font-extrabold transition active:translate-y-[3px] ${state} ${
                                isChosen && phase === "wrong" ? "wiggle" : ""
                              }`}
                            >
                              {ar(opt)}
                            </button>
                          );
                        })}
                        <div className="ms-auto">
                          {phase === "correct" ? (
                            <BigButton
                              onClick={next}
                              tone="mint"
                              className="px-6 py-3 text-xl"
                            >
                              {index + 1 >= QUESTIONS_PER_ROUND
                                ? "شاهدي النتيجة ✨"
                                : "السؤال التالي ➜"}
                            </BigButton>
                          ) : (
                            <p
                              className={`max-w-[260px] font-display text-lg font-bold ${
                                phase === "wrong"
                                  ? "text-berry-dark"
                                  : "text-mint"
                              }`}
                            >
                              {phase === "wrong"
                                ? tries === 1
                                  ? "حاولي مرة أخرى يا بطلة 🌷"
                                  : "اقتربي من الإجابة الصحيحة! 💕"
                                : "اختاري الإجابة الصحيحة 💗"}
                            </p>
                          )}
                        </div>
                      </div>

                      {phase === "correct" && (
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <span className="star-pop rounded-full bg-mint px-4 py-1.5 font-display text-lg font-bold text-white">
                            أحسنتِ يا بطلة! 🌟
                          </span>
                          <span className="star-pop rounded-full bg-marigold px-4 py-1.5 font-display text-lg font-bold text-ink">
                            إجابة صحيحة! 🎉
                          </span>
                          <span className="font-display text-lg font-bold text-ink">
                            +{ar(tries === 0 ? 10 : 5)} نقطة
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* تنبيه لطيف */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed inset-x-0 bottom-[22vh] z-50 mx-auto w-fit rounded-full bg-ink px-6 py-3 text-center font-display text-lg font-bold text-cream shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto mt-8 w-[min(94vw,1120px)] px-2">
        <button
          onClick={onQuit}
          className="font-body text-sm text-ink-soft underline decoration-dotted underline-offset-4 hover:text-berry-dark"
        >
          إنهاء الجولة والعودة للرئيسية 🏠
        </button>
      </div>
    </div>
  );
};

/* ═════════════════════════ شاشة النتيجة ═════════════════════════ */
export const ResultScreen = ({
  result,
  onReplay,
  onBoard,
  onHome,
}: {
  result: RoundResult;
  onReplay: () => void;
  onBoard: () => void;
  onHome: () => void;
}) => {
  useEffect(() => {
    playCelebrate();
  }, []);

  const rows = [
    { g: "⭐", label: "النقاط", value: ar(result.points) },
    { g: "✅", label: "الإجابات الصحيحة", value: ar(result.correct) },
    { g: "❌", label: "الأخطاء", value: ar(result.errors) },
    { g: "⏱️", label: "الوقت", value: formatTime(result.seconds) },
  ];
  return (
    <div className="mx-auto w-[min(94vw,900px)] px-2 pt-10">
      <div className="relative min-h-[clamp(190px,32vw,330px)] overflow-hidden rounded-[32px] border-[6px] border-white/80 bg-berry-light shadow-[0_28px_60px_-30px_rgba(74,43,77,0.65)]">
        <img
          src={CELEBRATE_IMG}
          alt="سلة مشتريات ملوّنة ونجوم"
          className="h-[clamp(190px,32vw,330px)] w-full object-cover"
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement;
            el.style.display = "none";
            el.parentElement?.classList.add("plank");
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-center">
          <p className="font-display text-[clamp(1.7rem,5.4vw,3rem)] font-extrabold text-ink">
            انتهى التسوق! 🛍️✨
          </p>
          <p className="mt-1 font-display text-[clamp(1.05rem,3.4vw,1.6rem)] font-bold text-berry-dark">
            أحسنتِ يا نجمة الجمع! 🌟
          </p>
        </div>
      </div>

      {/* إيصال النتيجة */}
      <div className="receipt-edge relative mx-auto mt-10 w-full max-w-[560px] bg-sugar px-6 pt-16 pb-14 shadow-[0_22px_50px_-26px_rgba(74,43,77,0.7)]">
        <div className="absolute top-3 left-5 rotate-[-14deg]">
          <span className="star-pop inline-block rounded-full border-[4px] border-mint px-5 py-2 font-display text-2xl font-extrabold text-mint">
            مدفوع ✓
          </span>
        </div>
        <p className="text-center font-display text-xl font-bold text-ink">
          {result.name} 🌷
        </p>
        <p className="mt-1 text-center font-body text-sm text-ink-soft">
          {GAME_TITLE} • {ar(ITEMS_PER_QUESTION)} منتجات في كل سؤال
        </p>
        <div className="dashed-rule mx-auto my-5 w-full" />
        <ul className="space-y-3">
          {rows.map((r) => (
            <li
              key={r.label}
              className="flex items-center justify-between gap-4"
            >
              <span className="flex items-center gap-2 font-body text-lg text-ink-soft">
                <span className="text-xl">{r.g}</span>
                {r.label}
              </span>
              <span className="font-display text-3xl font-extrabold text-ink">
                {r.value}
              </span>
            </li>
          ))}
        </ul>
        <div className="dashed-rule mx-auto my-5 w-full" />
        <p className="text-center font-display text-lg font-bold text-berry-dark">
          {result.errors === 0
            ? "إجابات ممتازة بلا أخطاء! 👑"
            : result.correct >= 8
              ? "أداء رائع يا بطلة! ⭐"
              : "كل محاولة تجعلك أقوى يا نجمة 💗"}
        </p>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <BigButton onClick={onReplay} tone="berry">
          العب مرة أخرى 🔄
        </BigButton>
        <BigButton onClick={onBoard} tone="marigold">
          لوحة الصدارة 🏆
        </BigButton>
        <BigButton onClick={onHome} tone="ink">
          الرئيسية 🏠
        </BigButton>
      </div>
    </div>
  );
};

/* ═════════════════════════ لوحة الصدارة ═════════════════════════ */
export const BoardScreen = ({
  scores,
  loading,
  onHome,
  onPlay,
}: {
  scores: Score[];
  loading: boolean;
  onHome: () => void;
  onPlay: () => void;
}) => {
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div className="mx-auto w-[min(94vw,900px)] px-2 pt-10">
      <div className="rounded-[30px] border-[5px] border-white/80 bg-sugar p-5 shadow-[0_26px_55px_-30px_rgba(74,43,77,0.6)] md:p-8">
        <h2 className="text-center font-display text-[clamp(1.8rem,5.4vw,3rem)] font-extrabold text-ink">
          🏆 بطلات الجمع
        </h2>
        <p className="mt-2 text-center font-body text-base text-ink-soft">
          لوحة الشرف — تُرتّب حسب النقاط ثم الإجابات الصحيحة ثم الأخطاء ثم الوقت
        </p>

        <div className="mt-7 space-y-3">
          {loading && (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-2xl bg-cream-deep"
                />
              ))}
            </div>
          )}

          {!loading && scores.length === 0 && (
            <div className="rounded-2xl border-[3px] border-dashed border-berry/30 px-6 py-12 text-center">
              <p className="text-5xl">🌷</p>
              <p className="mt-3 font-display text-xl font-bold text-ink">
                لا توجد نتائج بعد يا بطلة!
              </p>
              <p className="mt-1 font-body text-base text-ink-soft">
                كوني أولى بطلات الجمع وسجّلي اسمكِ في لوحة الشرف ⭐
              </p>
            </div>
          )}

          {!loading &&
            scores.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.4) }}
                className={`flex flex-wrap items-center gap-4 rounded-2xl border-[3px] px-4 py-4 ${
                  i === 0
                    ? "border-marigold bg-marigold/18"
                    : i === 1
                      ? "border-ink/15 bg-cream"
                      : i === 2
                        ? "border-berry/30 bg-berry-light/50"
                        : "border-ink/10 bg-cream/70"
                }`}
              >
                <span className="w-12 shrink-0 text-center font-display text-3xl font-extrabold text-ink">
                  {medals[i] ?? ar(i + 1)}
                </span>
                <div className="min-w-[130px] flex-1">
                  <p className="font-display text-xl font-bold text-ink">
                    {s.name}
                  </p>
                  <p className="font-body text-xs text-ink-soft">
                    {ar(ITEMS_PER_QUESTION)} منتجات • {formatTime(s.seconds)} •{" "}
                    {ar(s.date)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-mint-light px-3 py-1 font-display text-sm font-bold text-mint">
                    ✅ {ar(s.correct)}
                  </span>
                  <span className="rounded-full bg-berry-light px-3 py-1 font-display text-sm font-bold text-berry-dark">
                    ❌ {ar(s.errors)}
                  </span>
                  <span className="rounded-full bg-marigold px-3 py-1 font-display text-base font-bold text-ink">
                    ⭐ {ar(s.points)} نقطة
                  </span>
                </div>
              </motion.div>
            ))}
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <BigButton onClick={onPlay} tone="berry">
            ابدئي اللعب 🛍️
          </BigButton>
          <BigButton onClick={onHome} tone="ink">
            الرئيسية 🏠
          </BigButton>
        </div>
      </div>
    </div>
  );
};
