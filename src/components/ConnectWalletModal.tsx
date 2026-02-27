import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAppKit } from "@reown/appkit/react";
import { ConnectButton as SuiConnectButton } from "@mysten/dapp-kit";
import { connectNearWallet } from "../lib/nearConnector";
import { connectNearWalletConnect } from "../lib/nearWalletConnect";
import { useWallet as useAptosWallet } from "@aptos-labs/wallet-adapter-react";
import { useConnect as useStarknetConnect } from "@starknet-react/core";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useWallet as useTronWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import { useWalletStore, type ChainType } from "../store/walletStore";
import { useWalletSync } from "../hooks/useWalletSync";
import { useTelegram } from "../hooks/useTelegram";
import { REOWN_PROJECT_ID } from "../lib/constants";

interface ChainOption {
  id: ChainType;
  name: string;
  description: string;
  emoji: string;
}

const CHAINS: ChainOption[] = [
  { id: "evm", name: "EVM Chains", description: "Ethereum, Base, Arbitrum +", emoji: "E" },
  { id: "solana", name: "Solana", description: "Fast & low-cost", emoji: "S" },
  { id: "bitcoin", name: "Bitcoin", description: "Digital gold", emoji: "B" },
  { id: "sui", name: "Sui", description: "Next-gen blockchain", emoji: "S" },
  { id: "near", name: "NEAR", description: "Simple & scalable", emoji: "N" },
  { id: "aptos", name: "Aptos", description: "Safe Layer 1", emoji: "A" },
  { id: "starknet", name: "Starknet", description: "ZK-rollup", emoji: "S" },
  { id: "ton", name: "TON", description: "The Open Network", emoji: "T" },
  { id: "tron", name: "Tron", description: "Decentralized internet", emoji: "T" },
];

// Address validation helpers
function validateAddress(chain: ChainType, addr: string): boolean {
  const s = addr.trim();
  if (!s) return false;
  switch (chain) {
    case "sui":
    case "aptos":
      return /^0x[0-9a-fA-F]{63,64}$/.test(s);
    case "near":
      // Named accounts (alice.near) or hex implicit accounts
      return (
        /^[a-z0-9_-]+(\.[a-z0-9_-]+)*$/.test(s) ||
        /^[0-9a-fA-F]{64}$/.test(s)
      );
    case "starknet":
      return /^0x[0-9a-fA-F]{1,64}$/.test(s);
    case "tron":
      return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(s);
    default:
      return s.length > 5;
  }
}

function formatAddress(address: string) {
  if (address.length <= 13) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Manual address entry — used in TMA where injected wallets don't exist
function ManualAddressEntry({
  chain,
  onSave,
  onCancel,
}: {
  chain: ChainType;
  onSave: (address: string) => void;
  onCancel: () => void;
}) {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const placeholders: Partial<Record<ChainType, string>> = {
    sui: "0x...",
    near: "alice.near or implicit account",
    aptos: "0x...",
    starknet: "0x...",
    tron: "T...",
  };

  const handleSave = () => {
    const trimmed = address.trim();
    if (!validateAddress(chain, trimmed)) {
      setError("Invalid address format");
      return;
    }
    onSave(trimmed);
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <p className="text-sm text-[var(--tg-theme-hint-color,#94a3b8)] mb-1">
          Enter your {CHAINS.find((c) => c.id === chain)?.name} wallet address
        </p>
        <p className="text-xs text-[var(--tg-theme-hint-color,#64748b)]">
          No signing required — address only, for deposit generation.
        </p>
      </div>
      <input
        type="text"
        value={address}
        onChange={(e) => {
          setAddress(e.target.value);
          setError("");
        }}
        placeholder={placeholders[chain] ?? "Enter address..."}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-mono focus:outline-none focus:border-blue-500 text-white placeholder-white/30"
        autoFocus
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
      />
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl bg-white/5 text-sm font-medium active:scale-[0.98] transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl text-sm font-medium text-white active:scale-[0.98] transition-all"
        >
          Save Address
        </button>
      </div>
    </div>
  );
}

export function ConnectWalletModal() {
  const { isModalOpen, closeModal, isChainConnected, getAddressForChain, setWallet } =
    useWalletStore();
  const { disconnectChain } = useWalletSync();
  const { haptic, isInTMA } = useTelegram();
  const { open: openAppKit } = useAppKit();
  const { connect: aptosConnect, wallets: aptosWallets } = useAptosWallet();
  const { connect: starknetConnect, connectors: starknetConnectors } =
    useStarknetConnect();
  const [tonConnectUI] = useTonConnectUI();
  const {
    select: tronSelect,
    wallets: tronWallets,
    connect: tronConnect,
  } = useTronWallet();

  const [selectedChain, setSelectedChain] = useState<ChainType | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);

  // starknetConnectors from useConnect includes all registered connectors
  // (InjectedConnector for ArgentX/Braavos + ArgentMobileConnector for WC)
  // Chains with WalletConnect support in TMA
  // - starknet: ArgentMobileConnector (WC via Argent Mobile)
  // - near: @near-wallet-selector/wallet-connect (Meteor Wallet)
  // - tron: WalletConnectAdapter via @tronweb3/tronwallet-adapter-walletconnect
  // - sui: NO native WC in @mysten/dapp-kit for TMA (documented)
  // - aptos: NO WC adapter available (documented)
  const wcSupportedChains: ChainType[] = ["starknet", "near", "tron"];

  // Chains that only support manual entry (no WalletConnect SDK available)
  const manualOnlyChains: ChainType[] = ["sui", "near", "aptos", "starknet", "tron"];

  // Auto-close on Sui connect (browser mode only, SDK-based)
  const suiConnected = isChainConnected("sui");
  useEffect(() => {
    if (suiConnected && selectedChain === "sui" && !isInTMA) {
      setTimeout(() => {
        closeModal();
        setSelectedChain(null);
      }, 400);
    }
  }, [suiConnected, selectedChain, closeModal, isInTMA]);

  useEffect(() => {
    if (!isModalOpen) {
      setSelectedChain(null);
      setShowManualEntry(false);
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const [wcConnecting, setWcConnecting] = useState(false);
  const [wcError, setWcError] = useState<string | null>(null);

  const handleManualSave = (chain: ChainType, address: string) => {
    setWallet(chain, address);
    haptic.notificationOccurred("success");
    setShowManualEntry(false);
    closeModal();
    setSelectedChain(null);
  };

  /**
   * WalletConnect handler for TMA mode.
   * Opens the chain's mobile wallet via WalletConnect deep link / modal.
   */
  const handleWalletConnect = async (chain: ChainType) => {
    setWcConnecting(true);
    setWcError(null);
    haptic.selectionChanged();
    try {
      switch (chain) {
        case "starknet": {
          // Use the ArgentMobileConnector — uses WalletConnect v2
          // starknetConnectors comes from useConnect (includes all StarknetConfig connectors)
          const argentMobileConnector = starknetConnectors.find(
            (c) => c.id === "argentMobile" || c.id === "argent-mobile"
          );
          if (argentMobileConnector) {
            starknetConnect({ connector: argentMobileConnector });
            closeModal();
          } else {
            setWcError("Argent Mobile connector not found. Try manually.");
          }
          break;
        }
        case "near": {
          const accountId = await connectNearWalletConnect();
          if (accountId) {
            setWallet("near", accountId);
            haptic.notificationOccurred("success");
            closeModal();
          } else {
            setWcError("NEAR WalletConnect cancelled or failed.");
          }
          break;
        }
        case "tron": {
          // Dynamically import WalletConnectAdapter to avoid CJS issues
          const { WalletConnectAdapter } = await import(
            "@tronweb3/tronwallet-adapter-walletconnect"
          );
          const wcAdapter = new WalletConnectAdapter({
            network: "Mainnet",
            options: {
              relayUrl: "wss://relay.walletconnect.com",
              projectId: REOWN_PROJECT_ID,
              metadata: {
                name: "goBlink",
                description: "Cross-Chain Transfers",
                url: window.location.origin,
                icons: ["https://goblink.io/icon.png"],
              },
            },
          });
          await wcAdapter.connect();
          const address = wcAdapter.address;
          if (address) {
            setWallet("tron", address);
            haptic.notificationOccurred("success");
            closeModal();
          } else {
            setWcError("TRON WalletConnect cancelled or failed.");
          }
          break;
        }
        default:
          setWcError("WalletConnect not supported for this chain.");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`WalletConnect ${chain} failed:`, e);
      setWcError(`Connection failed: ${msg.slice(0, 80)}`);
    } finally {
      setWcConnecting(false);
    }
  };

  const handleConnect = async (chain: ChainType) => {
    haptic.selectionChanged();

    // In TMA mode: manualOnlyChains show WC/manual UI (handled via renderChainConnect)
    // This check is no longer needed — renderChainConnect handles TMA flow
    if (isInTMA && manualOnlyChains.includes(chain)) {
      // Do nothing here — renderChainConnect renders the TMA-specific UI
      return;
    }

    try {
      switch (chain) {
        case "evm":
        case "solana":
        case "bitcoin":
          openAppKit();
          closeModal();
          break;
        case "near":
          await connectNearWallet();
          closeModal();
          break;
        case "aptos":
          if (aptosWallets?.length)
            await aptosConnect(
              (aptosWallets[0] as { name?: string }).name ??
                (aptosWallets[0] as unknown as string)
            );
          closeModal();
          break;
        case "starknet":
          if (starknetConnectors[0])
            starknetConnect({ connector: starknetConnectors[0] });
          closeModal();
          break;
        case "ton":
          await tonConnectUI.openModal();
          closeModal();
          break;
        case "tron":
          if (tronWallets?.length) {
            tronSelect(tronWallets[0].adapter.name);
            await tronConnect();
          }
          closeModal();
          break;
        // sui handled via its own button in browser mode
      }
    } catch (e) {
      console.error(`Connect ${chain} failed:`, e);
    }
  };

  const renderChainConnect = () => {
    if (!selectedChain) return null;

    // Manual entry shown in TMA or when user clicked "Enter manually"
    if (showManualEntry && manualOnlyChains.includes(selectedChain)) {
      return (
        <ManualAddressEntry
          chain={selectedChain}
          onSave={(addr) => handleManualSave(selectedChain, addr)}
          onCancel={() => setShowManualEntry(false)}
        />
      );
    }

    // TMA mode: show WalletConnect (primary) + manual entry (secondary)
    if (isInTMA && manualOnlyChains.includes(selectedChain)) {
      const supportsWC = wcSupportedChains.includes(selectedChain);
      const chainName = CHAINS.find((c) => c.id === selectedChain)?.name ?? selectedChain;

      return (
        <div className="space-y-4 p-4">
          <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3">
            <p className="text-xs text-blue-400 font-medium">
              📱 Telegram WebApp Mode
            </p>
            <p className="text-xs text-[var(--tg-theme-hint-color,#94a3b8)] mt-1">
              {supportsWC
                ? "Connect your mobile wallet via WalletConnect, or enter address manually."
                : "Browser extensions aren't available in Telegram. Enter your address manually — no signing required."}
            </p>
          </div>

          {/* WalletConnect — primary option when supported */}
          {supportsWC && (
            <button
              onClick={() => handleWalletConnect(selectedChain)}
              disabled={wcConnecting}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl font-medium text-white active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {wcConnecting ? (
                <>
                  <span className="animate-spin text-sm">⏳</span>
                  Connecting…
                </>
              ) : (
                <>
                  <span>🔗</span>
                  Connect via WalletConnect
                </>
              )}
            </button>
          )}

          {/* WC error */}
          {wcError && (
            <p className="text-xs text-red-400 text-center">{wcError}</p>
          )}

          {/* Sui / Aptos: no WC available — explain why */}
          {!supportsWC && (selectedChain === "sui" || selectedChain === "aptos") && (
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <p className="text-xs text-[var(--tg-theme-hint-color,#94a3b8)]">
                <span className="font-medium text-white/70">Note:</span>{" "}
                {selectedChain === "sui"
                  ? "Sui WalletConnect requires the Sui dApp Kit modal which isn't optimized for Telegram WebView. Use address entry below."
                  : "Aptos WalletConnect support is not yet available in this environment. Use address entry below."}
              </p>
            </div>
          )}

          {/* Manual entry — always available as fallback */}
          <button
            onClick={() => setShowManualEntry(true)}
            className={`w-full py-3 rounded-xl font-medium active:scale-[0.98] transition-all ${
              supportsWC
                ? "bg-white/5 text-[var(--tg-theme-hint-color,#94a3b8)] text-sm border border-white/10"
                : "bg-gradient-to-r from-blue-600 to-violet-600 text-white"
            }`}
          >
            {supportsWC ? "Or enter address manually" : `Enter ${chainName} Address Manually`}
          </button>
        </div>
      );
    }

    // Browser mode: existing SDK-based flows
    if (selectedChain === "sui") {
      return (
        <div className="space-y-4 p-4">
          <p className="text-sm text-[var(--tg-theme-hint-color,#94a3b8)]">
            Connect your Sui wallet
          </p>
          <div className="flex justify-center">
            <SuiConnectButton />
          </div>
          <button
            onClick={() => setShowManualEntry(true)}
            className="w-full py-2 text-xs text-[var(--tg-theme-hint-color,#94a3b8)] active:text-white transition-colors"
          >
            or enter address manually
          </button>
        </div>
      );
    }

    if (selectedChain === "starknet") {
      return (
        <div className="space-y-3 p-4">
          <p className="text-sm text-[var(--tg-theme-hint-color,#94a3b8)]">
            Connect your Starknet wallet
          </p>
          {starknetConnectors.map((connector, i) => (
            <button
              key={i}
              onClick={() => {
                starknetConnect({ connector });
                closeModal();
              }}
              className="w-full py-3 px-4 rounded-xl bg-white/5 active:scale-[0.98] transition-all flex items-center gap-3"
            >
              <span className="text-xl">{i === 0 ? "A" : "B"}</span>
              <span className="font-semibold">
                {i === 0 ? "Argent X" : "Braavos"}
              </span>
            </button>
          ))}
          <button
            onClick={() => setShowManualEntry(true)}
            className="w-full py-2 text-xs text-[var(--tg-theme-hint-color,#94a3b8)] active:text-white transition-colors"
          >
            or enter address manually
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-3 p-4">
        <p className="text-sm text-[var(--tg-theme-hint-color,#94a3b8)]">
          {CHAINS.find((c) => c.id === selectedChain)?.description}
        </p>
        <button
          onClick={() => handleConnect(selectedChain)}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl font-medium text-white active:scale-[0.98] transition-all"
        >
          Connect Wallet
        </button>
        {(selectedChain === "evm" ||
          selectedChain === "solana" ||
          selectedChain === "bitcoin") && (
          <p className="text-xs text-[var(--tg-theme-hint-color,#94a3b8)] text-center">
            Powered by Reown AppKit
          </p>
        )}
        {manualOnlyChains.includes(selectedChain) && (
          <button
            onClick={() => setShowManualEntry(true)}
            className="w-full py-2 text-xs text-[var(--tg-theme-hint-color,#94a3b8)] active:text-white transition-colors"
          >
            or enter address manually
          </button>
        )}
      </div>
    );
  };

  const handleBackPress = () => {
    if (showManualEntry) {
      setShowManualEntry(false);
    } else if (selectedChain) {
      setSelectedChain(null);
    } else {
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="flex-1 bg-black/50" onClick={closeModal} />
      <div className="bg-[var(--tg-theme-secondary-bg-color,#1e293b)] rounded-t-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div>
            <h2 className="text-base font-bold">
              {selectedChain
                ? showManualEntry
                  ? "Enter Address"
                  : "Connect Wallet"
                : "Select Chain"}
            </h2>
            <p className="text-xs text-[var(--tg-theme-hint-color,#94a3b8)]">
              {selectedChain
                ? CHAINS.find((c) => c.id === selectedChain)?.description
                : "Choose a blockchain to connect"}
            </p>
          </div>
          <button
            onClick={handleBackPress}
            className="p-2 rounded-lg active:bg-white/10 transition-colors"
          >
            {selectedChain ? (
              <span className="text-[var(--tg-theme-hint-color,#94a3b8)]">
                Back
              </span>
            ) : (
              <X size={18} className="text-[var(--tg-theme-hint-color,#94a3b8)]" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 pb-safe">
          {!selectedChain ? (
            <div className="p-3 space-y-1">
              {CHAINS.map((chain) => {
                const connected = isChainConnected(chain.id);
                const address = getAddressForChain(chain.id);

                return (
                  <div
                    key={chain.id}
                    className={`p-3 rounded-xl transition-all ${
                      connected
                        ? "bg-green-500/10 border border-green-500/20"
                        : "bg-white/5 active:bg-white/10"
                    }`}
                    {...(!connected
                      ? {
                          onClick: () => {
                            setSelectedChain(chain.id);
                            haptic.selectionChanged();
                          },
                          role: "button",
                        }
                      : {})}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
                          {chain.emoji}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">
                            {chain.name}
                          </div>
                          {connected && address ? (
                            <div className="text-xs text-green-400 font-medium font-mono">
                              {formatAddress(address)}
                            </div>
                          ) : (
                            <div className="text-xs text-[var(--tg-theme-hint-color,#94a3b8)]">
                              {chain.description}
                            </div>
                          )}
                        </div>
                      </div>
                      {connected ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // For manually-entered addresses, clear from store directly
                            if (isInTMA && manualOnlyChains.includes(chain.id)) {
                              setWallet(chain.id, null);
                            } else {
                              disconnectChain(chain.id);
                            }
                            haptic.impactOccurred("light");
                          }}
                          className="px-2.5 py-1 text-xs rounded-lg bg-red-500/20 text-red-400 active:bg-red-500/30 transition-colors font-medium"
                        >
                          Disconnect
                        </button>
                      ) : (
                        <span className="text-[var(--tg-theme-hint-color,#94a3b8)] text-sm">
                          Connect
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            renderChainConnect()
          )}
        </div>

        <div className="px-4 py-3 border-t border-white/10">
          <p className="text-xs text-[var(--tg-theme-hint-color,#94a3b8)] text-center">
            Multiple chains can be connected simultaneously
          </p>
        </div>
      </div>
    </div>
  );
}
