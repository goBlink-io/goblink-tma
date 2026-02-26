import { clsx } from "clsx";
import { ACTIVE_CHAIN_IDS, CHAIN_LABELS, CHAIN_EMOJIS, type ChainId } from "../lib/constants";

interface ChainSelectorProps {
  label: string;
  selected: ChainId | null;
  onSelect: (chain: ChainId) => void;
}

export function ChainSelector({ label, selected, onSelect }: ChainSelectorProps) {
  return (
    <div>
      <p className="text-xs font-medium text-[var(--tg-theme-hint-color,#94a3b8)] mb-2 uppercase tracking-wide">
        {label}
      </p>
      <div className="grid grid-cols-4 gap-2">
        {ACTIVE_CHAIN_IDS.map((chain) => (
          <button
            key={chain}
            onClick={() => onSelect(chain)}
            className={clsx(
              "flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-medium transition-all active:scale-95",
              selected === chain
                ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg"
                : "bg-white/5 text-[var(--tg-theme-text-color,#f8fafc)] hover:bg-white/10"
            )}
          >
            <span className="text-lg">{CHAIN_EMOJIS[chain]}</span>
            <span className="truncate w-full text-center">{CHAIN_LABELS[chain]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
