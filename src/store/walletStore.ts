import { create } from "zustand";

export type ChainType =
  | "evm"
  | "solana"
  | "sui"
  | "near"
  | "bitcoin"
  | "aptos"
  | "starknet"
  | "ton"
  | "tron";

interface ConnectedWallet {
  chain: ChainType;
  address: string;
}

interface WalletState {
  connectedWallets: ConnectedWallet[];
  isModalOpen: boolean;

  setWallet: (chain: ChainType, address: string | null) => void;
  openModal: () => void;
  closeModal: () => void;

  getAddressForChain: (chain: ChainType) => string | null;
  isChainConnected: (chain: ChainType) => boolean;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  connectedWallets: [],
  isModalOpen: false,

  setWallet: (chain, address) =>
    set((state) => {
      const filtered = state.connectedWallets.filter((w) => w.chain !== chain);
      if (address) {
        return { connectedWallets: [...filtered, { chain, address }] };
      }
      return { connectedWallets: filtered };
    }),

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  getAddressForChain: (chain) => {
    const w = get().connectedWallets.find((w) => w.chain === chain);
    return w?.address ?? null;
  },

  isChainConnected: (chain) => {
    return get().connectedWallets.some((w) => w.chain === chain);
  },
}));
