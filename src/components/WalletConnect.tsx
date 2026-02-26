import { truncateAddress } from "../lib/format";
import { useWalletStore, type ChainType } from "../store/walletStore";
import type { ChainId } from "../lib/constants";
import { useTelegram } from "../hooks/useTelegram";

interface WalletConnectProps {
  chain: ChainId | null;
  depositAddress?: string;
}

const CHAIN_TO_TYPE: Record<string, ChainType> = {
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

export function WalletConnect({ chain, depositAddress }: WalletConnectProps) {
  const { openModal, getAddressForChain } = useWalletStore();
  const { haptic } = useTelegram();

  if (!chain) return null;

  const chainType = CHAIN_TO_TYPE[chain];
  const walletAddress = chainType ? getAddressForChain(chainType) : null;

  // Show deposit address fallback
  if (depositAddress && !walletAddress) {
    return (
      <div className="bg-white/5 rounded-xl p-4">
        <p className="text-xs font-medium text-[var(--tg-theme-hint-color,#94a3b8)] mb-2 uppercase tracking-wide">
          Deposit Address
        </p>
        <p className="text-sm font-mono break-all mb-2">{depositAddress}</p>
        <p className="text-xs text-[var(--tg-theme-hint-color,#94a3b8)]">
          Send funds to this address to complete the transfer
        </p>
        <button
          onClick={() => {
            navigator.clipboard.writeText(depositAddress);
            haptic.notificationOccurred("success");
          }}
          className="mt-2 w-full py-2 bg-white/10 rounded-lg text-sm font-medium active:scale-[0.98] transition-all"
        >
          Copy Address
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/5 rounded-xl p-4">
      <p className="text-xs font-medium text-[var(--tg-theme-hint-color,#94a3b8)] mb-2 uppercase tracking-wide">
        Sending Wallet
      </p>
      {walletAddress ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-sm font-mono">
              {truncateAddress(walletAddress)}
            </span>
          </div>
          <button
            onClick={() => {
              openModal();
              haptic.selectionChanged();
            }}
            className="text-xs text-blue-400 font-medium"
          >
            Switch
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            openModal();
            haptic.selectionChanged();
          }}
          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg text-sm font-medium text-white active:scale-[0.98] transition-all"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}

// Re-export for usage clarity
export { truncateAddress };
