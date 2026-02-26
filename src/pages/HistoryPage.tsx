import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTransactions, type Transaction } from "../lib/api";
import { formatAmount } from "../lib/format";
import { CHAIN_LABELS, CHAIN_EMOJIS, type ChainId } from "../lib/constants";
import { useTelegram } from "../hooks/useTelegram";
import { Loader } from "lucide-react";

export function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { mainButton, isInTMA, haptic } = useTelegram();

  useEffect(() => {
    fetchTransactions()
      .then(setTransactions)
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Failed to load history"
        );
      })
      .finally(() => setLoading(false));
  }, []);

  // MainButton: "New Transfer" on history page
  useEffect(() => {
    if (!isInTMA) return;

    const handler = () => navigate("/");
    mainButton.setParams({
      text: "New Transfer",
      is_active: true,
      is_visible: true,
    });
    mainButton.hideProgress();
    mainButton.onClick(handler);

    return () => {
      mainButton.offClick(handler);
      mainButton.hide();
    };
  }, [isInTMA, mainButton, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size={32} className="animate-spin text-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--tg-theme-hint-color,#94a3b8)]">
          No transactions yet
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">History</h1>
      <div className="space-y-2">
        {transactions.map((tx) => {
          const fromLabel =
            CHAIN_LABELS[tx.fromChain as ChainId] ?? tx.fromChain;
          const toLabel = CHAIN_LABELS[tx.toChain as ChainId] ?? tx.toChain;
          const fromEmoji = CHAIN_EMOJIS[tx.fromChain as ChainId] ?? "";
          const toEmoji = CHAIN_EMOJIS[tx.toChain as ChainId] ?? "";
          const time = new Date(tx.createdAt).toLocaleDateString();

          return (
            <button
              key={tx.id}
              onClick={() => {
                navigate(`/status/${tx.depositAddress}`);
                haptic.selectionChanged();
              }}
              className="w-full bg-white/5 rounded-xl p-3 text-left active:scale-[0.98] transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">
                  {fromEmoji} {fromLabel} &rarr; {toEmoji} {toLabel}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    tx.status === "SUCCESS"
                      ? "bg-green-500/20 text-green-400"
                      : tx.status === "FAILED"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {tx.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--tg-theme-hint-color,#94a3b8)]">
                <span>
                  {formatAmount(tx.fromAmount)} {tx.fromToken} &rarr;{" "}
                  {formatAmount(tx.toAmount)} {tx.toToken}
                </span>
                <span>{time}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
