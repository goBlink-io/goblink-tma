import { useEffect, useState, useRef } from "react";
import { CheckCircle, XCircle, Loader, Clock } from "lucide-react";
import { fetchStatus, type TransferStatus } from "../lib/api";
import { formatAmount } from "../lib/format";
import { CHAIN_LABELS, type ChainId } from "../lib/constants";

interface StatusTrackerProps {
  depositAddress: string;
}

const STATUS_ICONS = {
  PENDING: Clock,
  PROCESSING: Loader,
  SUCCESS: CheckCircle,
  FAILED: XCircle,
};

const STATUS_COLORS = {
  PENDING: "text-yellow-400",
  PROCESSING: "text-blue-400",
  SUCCESS: "text-green-400",
  FAILED: "text-red-400",
};

export function StatusTracker({ depositAddress }: StatusTrackerProps) {
  const [status, setStatus] = useState<TransferStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let mounted = true;

    const poll = async () => {
      try {
        const result = await fetchStatus(depositAddress);
        if (mounted) {
          setStatus(result);
          if (result.status === "SUCCESS" || result.status === "FAILED") {
            if (intervalRef.current) clearInterval(intervalRef.current);
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch status");
        }
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 5000);

    return () => {
      mounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [depositAddress]);

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
        <XCircle size={40} className="text-red-400 mx-auto mb-3" />
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="flex justify-center py-12">
        <Loader size={32} className="animate-spin text-blue-400" />
      </div>
    );
  }

  const Icon = STATUS_ICONS[status.status];
  const colorClass = STATUS_COLORS[status.status];
  const isAnimated = status.status === "PROCESSING";

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 py-6">
        <Icon
          size={48}
          className={`${colorClass} ${isAnimated ? "animate-spin" : ""}`}
        />
        <h2 className={`text-lg font-bold ${colorClass}`}>
          {status.status}
        </h2>
      </div>

      <div className="bg-white/5 rounded-xl p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--tg-theme-hint-color,#94a3b8)]">From</span>
          <span>
            {formatAmount(status.fromAmount)} {status.fromToken} on{" "}
            {CHAIN_LABELS[status.fromChain as ChainId] ?? status.fromChain}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--tg-theme-hint-color,#94a3b8)]">To</span>
          <span>
            {formatAmount(status.toAmount)} {status.toToken} on{" "}
            {CHAIN_LABELS[status.toChain as ChainId] ?? status.toChain}
          </span>
        </div>
        {status.txHash && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--tg-theme-hint-color,#94a3b8)]">Tx Hash</span>
            <span className="font-mono text-xs">
              {status.txHash.slice(0, 8)}...{status.txHash.slice(-6)}
            </span>
          </div>
        )}
        {status.explorerUrl && (
          <a
            href={status.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm text-blue-400 hover:underline mt-2"
          >
            View on Explorer
          </a>
        )}
      </div>

      {/* Progress steps */}
      <div className="flex items-center justify-between px-4">
        {(["PENDING", "PROCESSING", "SUCCESS"] as const).map((step, i) => {
          const steps = ["PENDING", "PROCESSING", "SUCCESS"];
          const currentIdx = steps.indexOf(status.status);
          const stepIdx = i;
          const isComplete = stepIdx < currentIdx || status.status === "SUCCESS";
          const isCurrent = stepIdx === currentIdx;

          return (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isComplete
                    ? "bg-green-400"
                    : isCurrent
                      ? "bg-blue-400 animate-pulse"
                      : "bg-white/20"
                }`}
              />
              {i < 2 && (
                <div
                  className={`w-16 h-0.5 ${
                    isComplete ? "bg-green-400" : "bg-white/20"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
