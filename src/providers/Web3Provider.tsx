import { type ReactNode } from "react";

// Wagmi & Reown AppKit for EVM + Solana
import { WagmiProvider } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  bsc,
  gnosis,
  avalanche,
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { SolanaAdapter } from "@reown/appkit-adapter-solana";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import type { Chain } from "viem";

// Sui
import {
  SuiClientProvider,
  WalletProvider as SuiWalletProvider,
} from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";

// Aptos
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

// Starknet
import {
  StarknetConfig,
  publicProvider,
  InjectedConnector,
} from "@starknet-react/core";
import { mainnet as starknetMainnet } from "@starknet-react/chains";
import { ArgentMobileConnector } from "starknetkit/argentMobile";
import { constants as starknetConstants } from "starknet";

// TON
import { TonConnectUIProvider } from "@tonconnect/ui-react";

// Tron
import { WalletProvider as TronWalletProvider } from "@tronweb3/tronwallet-adapter-react-hooks";
import { TronLinkAdapter } from "@tronweb3/tronwallet-adapters";

import { REOWN_PROJECT_ID } from "../lib/constants";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
    },
  },
});

const projectId = REOWN_PROJECT_ID;

if (!projectId) {
  console.warn("⚠️ VITE_REOWN_PROJECT_ID is not set — EVM/Solana wallets disabled");
}

const metadata = {
  name: "goBlink",
  description: "Cross-Chain Transfers -- instant, low-cost, any chain",
  url: typeof window !== "undefined" ? window.location.origin : "https://telegram.goblink.io",
  icons: ["https://goblink.io/icon.png"],
};

// Custom EVM chain definitions (matching web app)
const berachain = {
  id: 80094,
  name: "Berachain",
  nativeCurrency: { name: "BERA", symbol: "BERA", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.berachain.com"] },
    public: { http: ["https://rpc.berachain.com"] },
  },
  blockExplorers: {
    default: { name: "Berascan", url: "https://berascan.com" },
  },
} as const satisfies Chain;

const monad = {
  id: 143,
  name: "Monad",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.monad.xyz"] },
    public: { http: ["https://rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: { name: "Monad Explorer", url: "https://explorer.monad.xyz" },
  },
} as const satisfies Chain;

const evmChains = [
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  bsc,
  avalanche,
  gnosis,
  berachain,
  monad,
];

const wagmiAdapter = new WagmiAdapter({ networks: evmChains, projectId });
const solanaWeb3JsAdapter = new SolanaAdapter({ wallets: [] });

// Initialize AppKit once at module level
if (projectId) {
  createAppKit({
    adapters: [wagmiAdapter, solanaWeb3JsAdapter],
    networks: [
      mainnet,
      polygon,
      optimism,
      arbitrum,
      base,
      bsc,
      berachain,
      monad,
      solana,
      solanaTestnet,
      solanaDevnet,
    ] as Parameters<typeof createAppKit>[0]["networks"],
    projectId,
    metadata,
    features: {
      analytics: false,
      email: false,
      socials: [],
    },
    themeMode: "dark",
    enableWalletConnect: true,
    enableInjected: true,
    enableCoinbase: true,
  });
}

// Sui networks
const suiNetworks = {
  mainnet: {
    url: "https://fullnode.mainnet.sui.io:443",
    network: "mainnet" as const,
  },
  testnet: {
    url: "https://fullnode.testnet.sui.io:443",
    network: "testnet" as const,
  },
};

// Starknet connectors
// ArgentMobileConnector uses WalletConnect under the hood — works in TMA
const starknetConnectors = [
  new InjectedConnector({ options: { id: "argentX" } }),
  new InjectedConnector({ options: { id: "braavos" } }),
  ArgentMobileConnector.init({
    options: {
      projectId: projectId || "",
      chainId: starknetConstants.NetworkName.SN_MAIN,
      dappName: "goBlink",
      description: "Cross-Chain Transfers",
      url: typeof window !== "undefined" ? window.location.origin : "https://telegram.goblink.io",
      icons: ["https://goblink.io/icon.png"],
    },
  }),
];

// Tron adapters — WalletConnect added for TMA support
// @tronweb3/tronwallet-adapter-walletconnect is installed but its CJS build
// has a missing ./adapter.js in the cjs directory. Using dynamic import for safety.
let tronAdapters: InstanceType<typeof TronLinkAdapter>[] = [new TronLinkAdapter()];
// WalletConnectAdapter is loaded lazily in the modal flow for TMA

// TON manifest
const tonManifestUrl =
  typeof window !== "undefined"
    ? `${window.location.origin}/tonconnect-manifest.json`
    : "https://telegram.goblink.io/tonconnect-manifest.json";

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={suiNetworks} defaultNetwork="mainnet">
          <SuiWalletProvider>
            <AptosWalletAdapterProvider autoConnect={false}>
              <StarknetConfig
                chains={[starknetMainnet]}
                provider={publicProvider()}
                connectors={starknetConnectors as Parameters<typeof StarknetConfig>[0]["connectors"]}
              >
                <TonConnectUIProvider manifestUrl={tonManifestUrl}>
                  <TronWalletProvider
                    adapters={tronAdapters}
                    autoConnect={false}
                  >
                    {children}
                  </TronWalletProvider>
                </TonConnectUIProvider>
              </StarknetConfig>
            </AptosWalletAdapterProvider>
          </SuiWalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
