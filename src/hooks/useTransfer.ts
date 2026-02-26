import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { submitTransfer } from "../lib/api";
import { useTransferStore } from "../store/transferStore";
import { useTelegram } from "./useTelegram";

export function useTransfer() {
  const navigate = useNavigate();
  const { haptic } = useTelegram();
  const {
    fromChain,
    toChain,
    fromToken,
    toToken,
    amount,
    destinationAddress,
    quote,
    setDepositAddress,
    setTxStatus,
  } = useTransferStore();

  const canSubmit = Boolean(
    fromChain && toChain && fromToken && toToken && amount && destinationAddress && quote
  );

  const submit = useCallback(async () => {
    if (!fromChain || !toChain || !fromToken || !toToken || !amount || !destinationAddress) {
      return;
    }

    setTxStatus("SIGNING");
    haptic.impactOccurred("medium");

    try {
      setTxStatus("SUBMITTED");

      const result = await submitTransfer({
        fromChain,
        toChain,
        fromToken,
        toToken,
        amount,
        destinationAddress,
        depositAddress: quote?.depositAddress,
      });

      setDepositAddress(result.depositAddress);
      setTxStatus("TRACKING");
      haptic.notificationOccurred("success");
      navigate(`/status/${result.depositAddress}`);
    } catch (err) {
      setTxStatus("FAILED");
      haptic.notificationOccurred("error");
      console.error("Transfer submission failed:", err);
    }
  }, [
    fromChain,
    toChain,
    fromToken,
    toToken,
    amount,
    destinationAddress,
    quote,
    setDepositAddress,
    setTxStatus,
    haptic,
    navigate,
  ]);

  return { submit, canSubmit };
}
