import type { CSSProperties, ReactNode } from "react";
import { motion } from "framer-motion";
import type { Product } from "./game";
import { ar } from "./game";

/* ————————————————————————— المظلة المخططة ————————————————————————— */
export const Awning = () => (
  <div className="relative select-none" aria-hidden="true">
    <div className="awning h-9 w-full shadow-[0_6px_0_rgba(178,58,91,0.18)]" />
    <div
      className="h-6 w-full"
      style={{
        backgroundImage:
          "radial-gradient(circle 12px at 12px 0, transparent 0 12px, #FFF4E4 13px)",
        backgroundSize: "24px 24px",
        backgroundRepeat: "repeat-x",
      }}
    />
    <div className="h-1 w-full" />
  </div>
);

/* ————————————————————————— الشعار المعلّق ————————————————————————— */
export const ShopSign = ({ title }: { title: string }) => (
  <div className="relative z-10 mx-auto -mt-2 w-[min(92vw,720px)] px-4">
    <div className="relative">
      <div className="absolute -top-6 right-16 h-8 w-[3px] rounded bg-ink/25" />
      <div className="absolute -top-6 left-16 h-8 w-[3px] rounded bg-ink/25" />
      <div className="rounded-[28px] border-4 border-white/70 bg-sugar px-6 py-5 text-center shadow-[0_14px_0_-4px_rgba(178,58,91,0.22),0_26px_50px_-24px_rgba(74,43,77,0.55)]">
        <h1 className="font-display text-[clamp(2.1rem,7vw,4.6rem)] leading-[1.15] font-extrabold text-ink">
          {title}
        </h1>
        <div className="mx-auto mt-3 h-[6px] w-40 rounded-full bg-marigold" />
      </div>
    </div>
  </div>
);

/* ————————————————————————— الرأس ————————————————————————— */
export const Header = ({
  muted,
  onToggleMute,
}: {
  muted: boolean;
  onToggleMute: () => void;
}) => (
  <header className="relative">
    <div className="flex items-center justify-between gap-3 px-4 pt-4">
      <p className="flex-1 text-center font-body text-[clamp(0.85rem,2.6vw,1.05rem)] font-medium tracking-[0.12em] text-berry-dark">
        أهلاً بكم طالباتي الجميلات 🌷💗
      </p>
      <button
        onClick={onToggleMute}
        aria-label={muted ? "تشغيل الصوت" : "كتم الصوت"}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-ink/10 bg-sugar text-xl shadow-[0_4px_0_rgba(74,43,77,0.12)] transition active:translate-y-[2px] active:shadow-none"
      >
        {muted ? "🔇" : "🔊"}
      </button>
    </div>
    <div className="mt-3">
      <Awning />
    </div>
    <ShopSign title="متجر نجمة الجمع ⭐🛍️" />
  </header>
);

/* ————————————————————————— الذيل ————————————————————————— */
export const Footer = () => (
  <footer className="mt-14">
    <div className="mx-auto mb-5 flex w-[min(92vw,720px)] items-center gap-3 px-2">
      <span className="h-[2px] flex-1 rounded-full bg-ink/12" />
      <span className="text-lg">🌸</span>
      <span className="h-[2px] flex-1 rounded-full bg-ink/12" />
    </div>
    <div className="relative bg-ink py-5 text-center">
      <div className="absolute inset-x-0 top-0 h-[6px] bg-marigold" />
      <p className="font-display text-lg font-semibold text-cream md:text-xl">
        إعداد وتصميم: فداء التميمي ✨
      </p>
      <p className="mt-1 font-body text-xs tracking-[0.22em] text-cream/60">
        لعبة الجمع للصف الثاني الابتدائي
      </p>
    </div>
  </footer>
);

/* ————————————————————————— انفجار النجوم ————————————————————————— */
export const StarBurst = ({ show }: { show: boolean }) => {
  if (!show) return null;
  const particles = Array.from({ length: 14 }).map((_, i) => {
    const angle = (i / 14) * Math.PI * 2;
    const dist = 90 + (i % 4) * 42;
    return {
      tx: `${Math.cos(angle) * dist}px`,
      ty: `${Math.sin(angle) * dist - 30}px`,
      glyph: ["⭐", "✨", "🌟", "💫"][i % 4],
      delay: (i % 5) * 0.05,
      size: 18 + (i % 3) * 8,
    };
  });
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-visible">
      {particles.map((p, i) => (
        <span
          key={i}
          className="burst-particle absolute left-1/2 top-1/2"
          style={
            {
              "--tx": p.tx,
              "--ty": p.ty,
              animationDelay: `${p.delay}s`,
              fontSize: `${p.size}px`,
            } as CSSProperties
          }
        >
          {p.glyph}
        </span>
      ))}
    </div>
  );
};

/* ————————————————————————— بطاقة السعر ————————————————————————— */
export const PriceTag = ({
  price,
  tone = "marigold",
}: {
  price: number;
  tone?: "marigold" | "mint" | "berry";
}) => {
  const skin =
    tone === "mint"
      ? "bg-mint text-white shadow-[0_4px_0_#1e8a75]"
      : tone === "berry"
        ? "bg-berry text-white shadow-[0_4px_0_#b23a5b]"
        : "bg-marigold text-ink shadow-[0_4px_0_#e08c12]";
  return (
    <span
      className={`inline-flex items-baseline gap-1 rounded-full px-3 py-1 font-display font-bold ${skin}`}
    >
      <span className="text-xl leading-none">{ar(price)}</span>
      <span className="text-[0.62rem] leading-none opacity-80">ريال</span>
    </span>
  );
};

/* ————————————————————————— رفّ الخشب ————————————————————————— */
export const Plank = () => (
  <div
    aria-hidden="true"
    className="plank relative mt-3 h-4 w-full rounded-full shadow-[0_8px_16px_-8px_rgba(74,43,77,0.55)]"
  >
    <div
      className="absolute inset-0 rounded-full opacity-45"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.16) 0 3px, transparent 3px 26px), repeating-linear-gradient(0deg, rgba(120,70,32,0.22) 0 1px, transparent 1px 5px)",
      }}
    />
    <div className="absolute inset-x-2 top-[3px] h-[3px] rounded-full bg-white/25" />
  </div>
);

/* ————————————————————————— منتج على الرف ————————————————————————— */
export const ProductTile = ({
  product,
  price,
  selected,
  disabled,
  onToggle,
}: {
  product: Product;
  price: number;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}) => (
  <motion.button
    type="button"
    onClick={onToggle}
    disabled={disabled}
    animate={{ scale: selected ? 1.06 : 1, y: selected ? -6 : 0 }}
    whileTap={{ scale: 0.94 }}
    transition={{ type: "spring", stiffness: 320, damping: 18 }}
    aria-pressed={selected}
    className={`relative flex w-full flex-col items-center gap-1.5 rounded-2xl border-[3px] px-2 pt-3 pb-2 transition-colors ${
      selected
        ? "border-mint bg-mint-light shadow-[0_10px_0_-2px_rgba(47,183,155,0.35)]"
        : "border-ink/10 bg-sugar shadow-[0_8px_0_-2px_rgba(74,43,77,0.12)]"
    } ${disabled && !selected ? "opacity-45 grayscale-[0.35]" : "hover:border-berry/40"}`}
  >
    {selected && (
      <span className="star-pop absolute -top-3 -left-2 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-mint text-lg text-white shadow-md">
        ✓
      </span>
    )}
    <span className="text-[2.6rem] leading-none">{product.emoji}</span>
    <span className="font-display text-base font-bold text-ink">
      {product.name}
    </span>
    <PriceTag price={price} tone={selected ? "mint" : "marigold"} />
  </motion.button>
);

/* ————————————————————————— زر كبير ————————————————————————— */
export const BigButton = ({
  children,
  onClick,
  tone = "berry",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: "berry" | "mint" | "marigold" | "ink";
  disabled?: boolean;
  className?: string;
}) => {
  const skin =
    tone === "mint"
      ? "bg-mint text-white shadow-[0_7px_0_#1e8a75]"
      : tone === "marigold"
        ? "bg-marigold text-ink shadow-[0_7px_0_#e08c12]"
        : tone === "ink"
          ? "bg-ink text-cream shadow-[0_7px_0_#2c1730]"
          : "bg-berry text-white shadow-[0_7px_0_#b23a5b]";
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { y: 5, scale: 0.98 }}
      className={`rounded-2xl px-7 py-4 font-display text-[clamp(1.15rem,3.6vw,1.65rem)] font-bold transition disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none ${skin} ${className}`}
    >
      {children}
    </motion.button>
  );
};
