import { NearConnector } from "@hot-labs/near-connect";

let nearConnector: NearConnector | null = null;

export const initNearConnector = (): NearConnector | null => {
  if (typeof window === "undefined") return null;

  if (!nearConnector) {
    nearConnector = new NearConnector({
      networkId: "mainnet",
      network: "mainnet",
      logger: {
        log: console.log,
        error: console.error,
      },
    } as ConstructorParameters<typeof NearConnector>[0]);
  }

  return nearConnector;
};

export const getNearConnector = (): NearConnector | null => {
  if (!nearConnector) return initNearConnector();
  return nearConnector;
};

export const connectNearWallet = async (): Promise<string | null> => {
  const connector = getNearConnector();
  if (!connector) throw new Error("NEAR connector not initialized");

  const wallet = await connector.connect();
  const accounts = await (
    wallet as unknown as { getAccounts?: () => Promise<Array<{ accountId?: string } | string>> }
  ).getAccounts?.();

  if (accounts && accounts.length > 0) {
    const first = accounts[0];
    const accountId = typeof first === "string" ? first : first.accountId;
    return accountId ?? null;
  }
  return null;
};

export const disconnectNearWallet = async (): Promise<void> => {
  const connector = getNearConnector();
  if (!connector) return;
  await connector.disconnect();
};

export const getNearAccount = async (): Promise<string | null> => {
  const connector = getNearConnector();
  if (!connector) return null;

  try {
    const wallet = await connector.wallet().catch(() => null);
    if (!wallet) return null;

    const accounts = await (
      wallet as unknown as { getAccounts?: () => Promise<Array<{ accountId?: string } | string>> }
    ).getAccounts?.();

    if (accounts && accounts.length > 0) {
      const first = accounts[0];
      const accountId = typeof first === "string" ? first : first.accountId;
      return accountId ?? null;
    }
    return null;
  } catch {
    return null;
  }
};
