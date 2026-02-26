import { clsx } from "clsx";

interface AmountInputProps {
  amount: string;
  onAmountChange: (amount: string) => void;
  tokenSymbol: string;
  usdValue?: string;
}

const PRESETS = ["25", "50", "100", "250"];

export function AmountInput({
  amount,
  onAmountChange,
  tokenSymbol,
  usdValue,
}: AmountInputProps) {
  return (
    <div>
      <p className="text-xs font-medium text-[var(--tg-theme-hint-color,#94a3b8)] mb-2 uppercase tracking-wide">
        Amount
      </p>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(e) => {
            const val = e.target.value;
            if (/^[0-9]*\.?[0-9]*$/.test(val)) {
              onAmountChange(val);
            }
          }}
          className="w-full px-4 py-3 pr-20 bg-white/5 rounded-xl text-lg font-medium outline-none focus:ring-1 focus:ring-blue-500 text-[var(--tg-theme-text-color,#f8fafc)] placeholder:text-[var(--tg-theme-hint-color,#64748b)]"
        />
        {tokenSymbol && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--tg-theme-hint-color,#94a3b8)]">
            {tokenSymbol}
          </span>
        )}
      </div>
      {usdValue && (
        <p className="text-xs text-[var(--tg-theme-hint-color,#94a3b8)] mt-1 ml-1">
          ~{usdValue}
        </p>
      )}
      <div className="flex gap-2 mt-2">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => onAmountChange(preset)}
            className={clsx(
              "flex-1 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95",
              amount === preset
                ? "bg-blue-600/30 text-blue-400 border border-blue-500/30"
                : "bg-white/5 text-[var(--tg-theme-hint-color,#94a3b8)] hover:bg-white/10"
            )}
          >
            ${preset}
          </button>
        ))}
      </div>
    </div>
  );
}
