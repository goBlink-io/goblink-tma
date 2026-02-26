import { useState, useEffect, useCallback } from "react";
import { useTransferStore } from "../store/transferStore";
import { useWalletStore, type ChainType } from "../store/walletStore";
import { useQuote } from "../hooks/useQuote";
import { useTransfer } from "../hooks/useTransfer";
import { useTelegram } from "../hooks/useTelegram";
import { ChainSelector } from "../components/ChainSelector";
import { TokenSelector } from "../components/TokenSelector";
import { AmountInput } from "../components/AmountInput";
import { QuoteDisplay } from "../components/QuoteDisplay";
import { WalletConnect } from "../components/WalletConnect";
import { validateAddress, getAddressPlaceholder } from "../lib/validators";
import { fetchTokens, type Token } from "../lib/api";
import { truncateAddress } from "../lib/format";
import type { ChainId } from "../lib/constants";

const CHAIN_TO_WALLET_TYPE: Record<string, ChainType> = {
  eth: "evm",
  arbitrum: "evm",
  base: "evm",
  bnb: "evm",
  optimism: "evm",
  polygon: "evm",
  solana: "solana",
  sui: "sui",
  near: "near",
  aptos: "aptos",
  starknet: "starknet",
  tron: "tron",
};

export function TransferPage() {
  const {
    fromChain,
    toChain,
    fromToken,
    toToken,
    amount,
    destinationAddress,
    txStatus,
    setFromChain,
    setToChain,
    setFromToken,
    setToToken,
    setAmount,
    setDestinationAddress,
  } = useTransferStore();

  const { getAddressForChain, openModal } = useWalletStore();

  const { quote, isLoading: quoteLoading, error: quoteError } = useQuote();
  const { submit, canSubmit } = useTransfer();
  const { mainButton, isInTMA, haptic } = useTelegram();

  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromTokenOpen, setFromTokenOpen] = useState(false);
  const [toTokenOpen, setToTokenOpen] = useState(false);

  useEffect(() => {
    fetchTokens()
      .then(setTokens)
      .catch((err) => console.error("Failed to fetch tokens:", err));
  }, []);

  const selectedFromToken = tokens.find((t) => t.id === fromToken);
  const selectedToToken = tokens.find((t) => t.id === toToken);

  // Get wallet address for the from chain
  const fromWalletType = fromChain ? CHAIN_TO_WALLET_TYPE[fromChain] : undefined;
  const fromWalletAddress = fromWalletType
    ? getAddressForChain(fromWalletType)
    : null;

  // Auto-fill destination address from wallet
  const toWalletType = toChain ? CHAIN_TO_WALLET_TYPE[toChain] : undefined;
  const toWalletAddress = toWalletType
    ? getAddressForChain(toWalletType)
    : null;

  useEffect(() => {
    if (toWalletAddress && !destinationAddress) {
      setDestinationAddress(toWalletAddress);
    }
  }, [toWalletAddress, destinationAddress, setDestinationAddress]);

  const addressValid =
    toChain && destinationAddress
      ? validateAddress(toChain, destinationAddress)
      : false;

  // MainButton logic
  const handleMainButtonClick = useCallback(() => {
    if (txStatus === "QUOTED" && canSubmit && addressValid) {
      submit();
    }
  }, [txStatus, canSubmit, addressValid, submit]);

  useEffect(() => {
    if (!isInTMA) return;

    if (quoteLoading) {
      mainButton.setParams({
        text: "Getting Quote...",
        is_active: false,
        is_visible: true,
      });
      mainButton.showProgress(true);
    } else if (txStatus === "SIGNING" || txStatus === "SUBMITTED") {
      mainButton.setParams({
        text: "Sending...",
        is_active: false,
        is_visible: true,
      });
      mainButton.showProgress(true);
    } else if (txStatus === "QUOTED" && canSubmit && addressValid) {
      mainButton.hideProgress();
      mainButton.setParams({
        text: "Confirm & Send",
        is_active: true,
        is_visible: true,
      });
      mainButton.onClick(handleMainButtonClick);
    } else if (fromChain && toChain && fromToken && toToken && amount) {
      mainButton.hideProgress();
      mainButton.setParams({
        text: "Get Quote",
        is_active: false,
        is_visible: true,
      });
    } else {
      mainButton.hide();
    }

    return () => {
      mainButton.offClick(handleMainButtonClick);
    };
  }, [
    isInTMA,
    mainButton,
    quoteLoading,
    txStatus,
    canSubmit,
    addressValid,
    fromChain,
    toChain,
    fromToken,
    toToken,
    amount,
    handleMainButtonClick,
  ]);

  return (
    <div className="space-y-4">
      {/* From Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-[var(--tg-theme-hint-color,#94a3b8)] uppercase tracking-wide">
            You Send
          </p>
          {fromChain && (
            <div className="text-xs">
              {fromWalletAddress ? (
                <span className="flex items-center gap-1 text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="font-mono">
                    {truncateAddress(fromWalletAddress)}
                  </span>
                </span>
              ) : (
                <button
                  onClick={() => {
                    openModal();
                    haptic.selectionChanged();
                  }}
                  className="text-blue-400 font-medium"
                >
                  Connect wallet
                </button>
              )}
            </div>
          )}
        </div>
        <ChainSelector
          label=""
          selected={fromChain}
          onSelect={(c: ChainId) => {
            setFromChain(c);
            haptic.selectionChanged();
          }}
        />
      </div>

      {fromChain && (
        <div>
          <button
            onClick={() => setFromTokenOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl text-left active:scale-[0.98] transition-all"
          >
            {selectedFromToken ? (
              <>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                  {selectedFromToken.symbol.slice(0, 2)}
                </div>
                <span className="font-medium">{selectedFromToken.symbol}</span>
              </>
            ) : (
              <span className="text-[var(--tg-theme-hint-color,#94a3b8)]">
                Select token...
              </span>
            )}
          </button>
        </div>
      )}

      {fromToken && (
        <AmountInput
          amount={amount}
          onAmountChange={setAmount}
          tokenSymbol={selectedFromToken?.symbol ?? ""}
        />
      )}

      {/* Swap direction button */}
      {fromChain && amount && (
        <div className="flex justify-center -my-1 relative z-10">
          <button
            onClick={() => {
              const tempChain = fromChain;
              const tempToken = fromToken;
              if (toChain) setFromChain(toChain);
              if (tempChain) setToChain(tempChain);
              setFromToken(toToken);
              setToToken(tempToken);
              haptic.impactOccurred("light");
            }}
            className="w-9 h-9 rounded-full bg-[var(--tg-theme-secondary-bg-color,#1e293b)] border-2 border-white/10 flex items-center justify-center active:scale-90 active:rotate-180 transition-all"
          >
            <svg
              className="h-4 w-4 text-[var(--tg-theme-hint-color,#94a3b8)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </button>
        </div>
      )}

      {/* To Section */}
      {amount && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-[var(--tg-theme-hint-color,#94a3b8)] uppercase tracking-wide">
              You Receive
            </p>
            {toChain && toWalletAddress && (
              <span className="flex items-center gap-1 text-xs text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="font-mono">
                  {truncateAddress(toWalletAddress)}
                </span>
              </span>
            )}
          </div>
          <ChainSelector
            label=""
            selected={toChain}
            onSelect={(c: ChainId) => {
              setToChain(c);
              haptic.selectionChanged();
            }}
          />
        </div>
      )}

      {toChain && (
        <div>
          <button
            onClick={() => setToTokenOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl text-left active:scale-[0.98] transition-all"
          >
            {selectedToToken ? (
              <>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                  {selectedToToken.symbol.slice(0, 2)}
                </div>
                <span className="font-medium">{selectedToToken.symbol}</span>
              </>
            ) : (
              <span className="text-[var(--tg-theme-hint-color,#94a3b8)]">
                Select token...
              </span>
            )}
          </button>
        </div>
      )}

      {toChain && toToken && (
        <div>
          <p className="text-xs font-medium text-[var(--tg-theme-hint-color,#94a3b8)] mb-2 uppercase tracking-wide">
            Destination Address
          </p>
          <input
            type="text"
            placeholder={getAddressPlaceholder(toChain)}
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
            className={`w-full px-4 py-3 bg-white/5 rounded-xl text-sm font-mono outline-none focus:ring-1 text-[var(--tg-theme-text-color,#f8fafc)] placeholder:text-[var(--tg-theme-hint-color,#64748b)] ${
              destinationAddress && !addressValid
                ? "ring-1 ring-red-500/50 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
          />
          {destinationAddress && !addressValid && (
            <p className="text-xs text-red-400 mt-1 ml-1">
              Invalid address for this chain
            </p>
          )}
          {toWalletAddress && destinationAddress === toWalletAddress && (
            <p className="text-xs text-[var(--tg-theme-hint-color,#94a3b8)] mt-1 ml-1">
              Sending to your connected wallet
            </p>
          )}
        </div>
      )}

      <QuoteDisplay
        quote={quote}
        fromToken={selectedFromToken?.symbol ?? fromToken}
        toToken={selectedToToken?.symbol ?? toToken}
        isLoading={quoteLoading}
        error={quoteError}
      />

      {fromChain && (
        <WalletConnect
          chain={fromChain}
          depositAddress={quote?.depositAddress}
        />
      )}

      {/* Non-TMA fallback button */}
      {!isInTMA && canSubmit && addressValid && txStatus === "QUOTED" && (
        <button
          onClick={submit}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl font-medium text-white active:scale-[0.98] transition-all"
        >
          Confirm & Send
        </button>
      )}

      <TokenSelector
        tokens={tokens}
        selectedToken={fromToken}
        onSelect={setFromToken}
        isOpen={fromTokenOpen}
        onClose={() => setFromTokenOpen(false)}
        chain={fromChain}
      />

      <TokenSelector
        tokens={tokens}
        selectedToken={toToken}
        onSelect={setToToken}
        isOpen={toTokenOpen}
        onClose={() => setToTokenOpen(false)}
        chain={toChain}
      />
    </div>
  );
}
