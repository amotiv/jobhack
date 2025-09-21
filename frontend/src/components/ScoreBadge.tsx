import { motion } from "framer-motion";
import { Lock } from "lucide-react";

type Props = {
  score?: number | null;
  hint?: number | null;
  locked?: boolean;
  onUnlock?: () => void;
  size?: number;    // px
  stroke?: number;  // px
};

export default function ScoreBadge({
  score,
  hint,
  locked,
  onUnlock,
  size = 48,
  stroke = 5,
}: Props) {
  const pct = clamp(typeof score === "number" ? score : typeof hint === "number" ? hint : 0);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);
  const color = pct >= 80 ? "#16a34a" : pct >= 50 ? "#f59e0b" : "#ef4444";

  const handleClick = (e: React.MouseEvent) => {
    if (locked && onUnlock) {
      e.stopPropagation();
      onUnlock();
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={{ scale: locked ? 0.98 : 1 }}
      className="relative inline-flex items-center justify-center bg-white rounded-full shadow-sm border-2 border-gray-300 hover:bg-white"
      style={{ width: size, height: size }}
      title={locked ? "Upgrade to see exact match %" : `Match ${pct}%`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      {/* Centered text */}
      <span
        className={`relative z-10 text-xs font-semibold leading-none [font-variant-numeric:tabular-nums] text-gray-900 ${
          locked ? "blur-[3px] select-none" : ""
        }`}
      >
        {pct}%
      </span>

      {/* Lock icon */}
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <Lock size={14} className="text-gray-500" />
        </div>
      )}
    </motion.button>
  );
}

function clamp(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}
