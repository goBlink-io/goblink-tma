import { formatAmount, formatUSD } from "../lib/format";
import type { Quote } from "../lib/api";

interface QuoteDisplayProps {
  quote: Quote | null;
  fromToken: string;
  toToken: string;
  isLoading: boolean;
  error: string | null;
}

export function QuoteDisplay({
  quote,
  fromToken,
  toToken,
  isLoading,
  error,
}: QuoteDisplayProps) {
  if (isLoading) {
    return (
      <div className="bg-white/5 rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
        <div className="h-3 bg-white/10 rounded w-1/2 mb-2" />
        <div className="h-3 bg-white/10 rounded w-2/3" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (!quote) return null;

  return (
    <div className="bg-white/5 rounded-xl p-4 space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-[var(--tg-theme-hint-color,#94a3b8)]">Rate</span>
        <span>
          1 {fromToken} = {formatAmount(quote.rate)} {toToken}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-[var(--tg-theme-hint-color,#94a3b8)]">Fee</span>
        <span>
          {(quote.feeBps / 100).toFixed(2)}% ({formatUSD(quote.feeUsd)})
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-[var(--tg-theme-hint-color,#94a3b8)]">ETA</span>
        <span>~{quote.estimatedMinutes} min</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-[var(--tg-theme-hint-color,#94a3b8)]">You receive</span>
        <span className="font-medium text-green-400">
          {formatAmount(quote.toAmount)} {toToken}
        </span>
      </div>
    </div>
  );
}
