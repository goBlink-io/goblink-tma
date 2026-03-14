import { useEffect, useRef, useCallback, useState } from "react";
import { fetchQuote, type Quote } from "../lib/api";
import { useTransferStore } from "../store/transferStore";

interface UseQuoteReturn {
  quote: Quote | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useQuote(): UseQuoteReturn {
  const { fromChain, toChain, fromToken, toToken, amount, setQuote, setTxStatus } =
    useTransferStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quote, setLocalQuote] = useState<Quote | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const doFetch = useCallback(async () => {
    if (!fromChain || !toChain || !fromToken || !toToken || !amount) {
      setLocalQuote(null);
      setQuote(null);
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setLocalQuote(null);
      setQuote(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);
    setTxStatus("QUOTING");

    try {
      const result = await fetchQuote({
        fromChain,
        toChain,
        fromToken,
        toToken,
        amount,
      }, controller.signal);
      if (!controller.signal.aborted) {
        setLocalQuote(result);
        setQuote(result);
        setTxStatus("QUOTED");
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch quote";
        setError(message);
        setLocalQuote(null);
        setQuote(null);
        setTxStatus("IDLE");
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [fromChain, toChain, fromToken, toToken, amount, setQuote, setTxStatus]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(doFetch, 500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      abortRef.current?.abort();
    };
  }, [doFetch]);

  return { quote, isLoading, error, refetch: doFetch };
}
