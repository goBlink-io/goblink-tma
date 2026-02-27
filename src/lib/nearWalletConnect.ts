/**
 * NEAR WalletConnect via @near-wallet-selector/wallet-connect
 * Supports Meteor Wallet and any WalletConnect v2 compatible NEAR wallet
 */

import { setupWalletConnect } from "@near-wallet-selector/wallet-connect";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { REOWN_PROJECT_ID } from "./constants";

let selectorPromise: ReturnType<typeof setupWalletSelector> | null = null;
let wcAccountId: string | null = null;

export const connectNearWalletConnect = async (): Promise<string | null> => {
  const projectId = REOWN_PROJECT_ID;
  if (!projectId) throw new Error("VITE_REOWN_PROJECT_ID is not set");

  const selector = await setupWalletSelector({
    network: "mainnet",
    modules: [
      setupWalletConnect({
        projectId,
        metadata: {
          name: "goBlink",
          description: "Cross-Chain Transfers – instant, low-cost, any chain",
          url: typeof window !== "undefined" ? window.location.origin : "https://telegram.goblink.io",
          icons: ["https://goblink.io/icon.png"],
        },
        chainId: "near:mainnet",
        iconUrl: "https://goblink.io/icon.png",
      }),
    ],
  });

  const wallet = await selector.wallet("wallet-connect");
  const accounts = await wallet.signIn({
    contractId: "intents.near",
    methodNames: [] as string[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  wcAccountId = accounts[0]?.accountId ?? null;
  selectorPromise = Promise.resolve(selector);
  return wcAccountId;
};

export const disconnectNearWalletConnect = async (): Promise<void> => {
  try {
    if (selectorPromise) {
      const selector = await selectorPromise;
      const wallet = await selector.wallet("wallet-connect");
      await wallet.signOut();
    }
  } catch {
    // ignore
  } finally {
    wcAccountId = null;
    selectorPromise = null;
  }
};
