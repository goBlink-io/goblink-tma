import { create } from "zustand";
import type { ChainId } from "../lib/constants";
import type { Quote } from "../lib/api";

export type TxStatus =
  | "IDLE"
  | "QUOTING"
  | "QUOTED"
  | "SIGNING"
  | "SUBMITTED"
  | "TRACKING"
  | "SUCCESS"
  | "FAILED";

interface TransferState {
  fromChain: ChainId | null;
  toChain: ChainId | null;
  fromToken: string;
  toToken: string;
  amount: string;
  destinationAddress: string;
  quote: Quote | null;
  depositAddress: string;
  txStatus: TxStatus;

  setFromChain: (chain: ChainId) => void;
  setToChain: (chain: ChainId) => void;
  setFromToken: (token: string) => void;
  setToToken: (token: string) => void;
  setAmount: (amount: string) => void;
  setDestinationAddress: (address: string) => void;
  setQuote: (quote: Quote | null) => void;
  setDepositAddress: (address: string) => void;
  setTxStatus: (status: TxStatus) => void;
  reset: () => void;
}

const initialState = {
  fromChain: null as ChainId | null,
  toChain: null as ChainId | null,
  fromToken: "",
  toToken: "",
  amount: "",
  destinationAddress: "",
  quote: null as Quote | null,
  depositAddress: "",
  txStatus: "IDLE" as TxStatus,
};

export const useTransferStore = create<TransferState>((set) => ({
  ...initialState,

  setFromChain: (chain) =>
    set({ fromChain: chain, fromToken: "", quote: null, txStatus: "IDLE" }),
  setToChain: (chain) =>
    set({ toChain: chain, toToken: "", quote: null, txStatus: "IDLE" }),
  setFromToken: (token) => set({ fromToken: token, quote: null, txStatus: "IDLE" }),
  setToToken: (token) => set({ toToken: token, quote: null, txStatus: "IDLE" }),
  setAmount: (amount) => set({ amount, quote: null, txStatus: "IDLE" }),
  setDestinationAddress: (address) => set({ destinationAddress: address }),
  setQuote: (quote) => set({ quote }),
  setDepositAddress: (address) => set({ depositAddress: address }),
  setTxStatus: (status) => set({ txStatus: status }),
  reset: () => set(initialState),
}));
