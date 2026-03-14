import type { ChainId } from "./constants";

const EVM_ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;
const SOLANA_ADDRESS_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const SUI_ADDRESS_RE = /^0x[a-fA-F0-9]{64}$/;
const NEAR_ADDRESS_RE = /^[a-z0-9._-]+\.near$|^[a-fA-F0-9]{64}$/;
const APTOS_ADDRESS_RE = /^0x[a-fA-F0-9]{1,64}$/;
const STARKNET_ADDRESS_RE = /^0x[a-fA-F0-9]{1,64}$/;
const TRON_ADDRESS_RE = /^T[1-9A-HJ-NP-Za-km-z]{33}$/;

const EVM_CHAINS: ChainId[] = [
  "eth",
  "arbitrum",
  "base",
  "bnb",
  "optimism",
  "polygon",
];

export function validateAddress(chain: ChainId, address: string): boolean {
  if (!address || !address.trim()) return false;

  const trimmed = address.trim();

  if (EVM_CHAINS.includes(chain)) {
    return EVM_ADDRESS_RE.test(trimmed);
  }

  switch (chain) {
    case "solana":
      return SOLANA_ADDRESS_RE.test(trimmed);
    case "sui":
      return SUI_ADDRESS_RE.test(trimmed);
    case "near":
      return NEAR_ADDRESS_RE.test(trimmed);
    case "aptos":
      return APTOS_ADDRESS_RE.test(trimmed);
    case "starknet":
      return STARKNET_ADDRESS_RE.test(trimmed);
    case "tron":
      return TRON_ADDRESS_RE.test(trimmed);
    default:
      return false;
  }
}

export function getAddressPlaceholder(chain: ChainId): string {
  if (EVM_CHAINS.includes(chain)) return "0x...";

  switch (chain) {
    case "solana":
      return "Solana address...";
    case "sui":
      return "0x (64 hex chars)...";
    case "near":
      return "account.near";
    case "aptos":
      return "0x...";
    case "starknet":
      return "0x...";
    case "tron":
      return "T...";
    default:
      return "Address...";
  }
}
