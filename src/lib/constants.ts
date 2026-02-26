export const ACTIVE_CHAIN_IDS = [
  "aptos",
  "arbitrum",
  "base",
  "bnb",
  "eth",
  "near",
  "optimism",
  "polygon",
  "solana",
  "starknet",
  "sui",
  "tron",
] as const;

export type ChainId = (typeof ACTIVE_CHAIN_IDS)[number];

export const CHAIN_LABELS: Record<ChainId, string> = {
  aptos: "Aptos",
  arbitrum: "Arbitrum",
  base: "Base",
  bnb: "BNB Chain",
  eth: "Ethereum",
  near: "NEAR",
  optimism: "Optimism",
  polygon: "Polygon",
  solana: "Solana",
  starknet: "Starknet",
  sui: "Sui",
  tron: "TRON",
};

export const CHAIN_EMOJIS: Record<ChainId, string> = {
  aptos: "🅰️",
  arbitrum: "🔵",
  base: "🔷",
  bnb: "🟡",
  eth: "⟠",
  near: "🌐",
  optimism: "🔴",
  polygon: "🟣",
  solana: "☀️",
  starknet: "⚡",
  sui: "💧",
  tron: "💎",
};

export const API_URL =
  import.meta.env.VITE_API_URL || "https://goblink.io";

export const BOT_USERNAME =
  import.meta.env.VITE_BOT_USERNAME || "goBlinkBot";

export const REOWN_PROJECT_ID =
  import.meta.env.VITE_REOWN_PROJECT_ID || "";
