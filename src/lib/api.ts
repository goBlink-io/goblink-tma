import axios from "axios";
import { API_URL } from "./constants";

function getInitData(): string {
  try {
    return window.Telegram?.WebApp?.initData ?? "";
  } catch {
    return "";
  }
}

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const initData = getInitData();
  if (initData) {
    config.headers["x-telegram-init-data"] = initData;
  }
  return config;
});

export interface Token {
  id: string;
  symbol: string;
  name: string;
  chain: string;
  decimals: number;
  address?: string;
  logoUrl?: string;
}

export interface QuoteParams {
  fromChain: string;
  toChain: string;
  fromToken: string;
  toToken: string;
  amount: string;
}

export interface Quote {
  fromAmount: string;
  toAmount: string;
  rate: string;
  feeBps: number;
  feeUsd: string;
  estimatedMinutes: number;
  depositAddress: string;
  expiresAt: string;
}

export interface TransferSubmission {
  fromChain: string;
  toChain: string;
  fromToken: string;
  toToken: string;
  amount: string;
  destinationAddress: string;
  txHash?: string;
  depositAddress?: string;
}

export interface TransferStatus {
  status: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED";
  fromChain: string;
  toChain: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  txHash?: string;
  explorerUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  fromChain: string;
  toChain: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  status: string;
  createdAt: string;
  depositAddress: string;
}

export interface Fee {
  chain: string;
  feeBps: number;
}

export interface Balance {
  token: string;
  balance: string;
  usdValue: string;
}

export interface PriceMap {
  [tokenId: string]: number;
}

export async function fetchTokens(): Promise<Token[]> {
  const { data } = await api.get<Token[]>("/api/tokens");
  return data;
}

export async function fetchPrices(): Promise<PriceMap> {
  const { data } = await api.get<PriceMap>("/api/tokens/prices");
  return data;
}

export async function fetchQuote(params: QuoteParams, signal?: AbortSignal): Promise<Quote> {
  const { data } = await api.get<Quote>("/api/quote", { params, signal });
  return data;
}

export async function submitTransfer(
  body: TransferSubmission
): Promise<{ depositAddress: string }> {
  const { data } = await api.post<{ depositAddress: string }>(
    "/api/deposit/submit",
    body
  );
  return data;
}

export async function fetchStatus(
  depositAddress: string
): Promise<TransferStatus> {
  const { data } = await api.get<TransferStatus>(
    `/api/status/${depositAddress}`
  );
  return data;
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const { data } = await api.get<Transaction[]>("/api/transactions");
  return data;
}

export async function fetchBalance(
  chain: string,
  address: string
): Promise<Balance[]> {
  const { data } = await api.get<Balance[]>(
    `/api/balances/${chain}/${address}`
  );
  return data;
}

export async function fetchFees(): Promise<Fee[]> {
  const { data } = await api.get<Fee[]>("/api/fees");
  return data;
}
