import { useEffect, useCallback } from "react";
import { useAccount, useDisconnect } from "wagmi";
import {
  useAppKitAccount,
  useDisconnect as useAppKitDisconnect,
} from "@reown/appkit/react";
import {
  useCurrentAccount as useSuiAccount,
  useDisconnectWallet as useSuiDisconnect,
} from "@mysten/dapp-kit";
import { useWallet as useAptosWallet } from "@aptos-labs/wallet-adapter-react";
import {
  useAccount as useStarknetAccount,
  useDisconnect as useStarknetDisconnect,
} from "@starknet-react/core";
import { useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";
import { useWallet as useTronWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import { useWalletStore, type ChainType } from "../store/walletStore";
import {
  initNearConnector,
  getNearAccount,
  disconnectNearWallet,
} from "../lib/nearConnector";

/**
 * Syncs all wallet SDK states into the central Zustand walletStore.
 * Must be rendered inside Web3Provider.
 */
export function useWalletSync() {
  const setWallet = useWalletStore((s) => s.setWallet);

  // AppKit (EVM + Solana + Bitcoin)
  const {
    address: appKitAddress,
    isConnected: appKitConnected,
    caipAddress,
  } = useAppKitAccount();
  const { disconnect: appKitDisconnect } = useAppKitDisconnect();
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();

  // Sui
  const suiAccount = useSuiAccount();
  const { mutate: suiDisconnect } = useSuiDisconnect();

  // Aptos
  const {
    account: aptosAccount,
    connected: aptosConnected,
    disconnect: aptosDisconnect,
  } = useAptosWallet();

  // Starknet
  const { address: starknetAddr, isConnected: starknetConnected } =
    useStarknetAccount();
  const { disconnect: starknetDisconnect } = useStarknetDisconnect();

  // TON
  const [tonConnectUI] = useTonConnectUI();
  const tonAddr = useTonAddress();

  // Tron
  const {
    address: tronAddr,
    connected: tronConnected,
    disconnect: tronDisconnect,
  } = useTronWallet();

  // Derive AppKit chain type
  const appKitChain = (() => {
    if (!caipAddress) return null;
    if (caipAddress.startsWith("eip155:")) return "evm" as ChainType;
    if (caipAddress.startsWith("solana:")) return "solana" as ChainType;
    if (caipAddress.startsWith("bip122:")) return "bitcoin" as ChainType;
    return null;
  })();

  // Sync EVM
  useEffect(() => {
    const addr =
      (appKitChain === "evm" && appKitAddress) ||
      (wagmiConnected && wagmiAddress) ||
      null;
    setWallet("evm", addr ?? null);
  }, [appKitChain, appKitAddress, wagmiConnected, wagmiAddress, setWallet]);

  // Sync Solana
  useEffect(() => {
    const addr =
      appKitChain === "solana" && appKitAddress ? appKitAddress : null;
    setWallet("solana", addr);
  }, [appKitChain, appKitAddress, setWallet]);

  // Sync Bitcoin
  useEffect(() => {
    const addr =
      appKitChain === "bitcoin" && appKitAddress ? appKitAddress : null;
    setWallet("bitcoin", addr);
  }, [appKitChain, appKitAddress, setWallet]);

  // Sync Sui
  useEffect(() => {
    setWallet("sui", suiAccount?.address ?? null);
  }, [suiAccount?.address, setWallet]);

  // Sync Aptos
  useEffect(() => {
    setWallet(
      "aptos",
      aptosConnected ? aptosAccount?.address?.toString() ?? null : null
    );
  }, [aptosConnected, aptosAccount?.address, setWallet]);

  // Sync Starknet
  useEffect(() => {
    setWallet("starknet", starknetConnected ? starknetAddr ?? null : null);
  }, [starknetConnected, starknetAddr, setWallet]);

  // Sync TON
  useEffect(() => {
    setWallet("ton", tonAddr || null);
  }, [tonAddr, setWallet]);

  // Sync Tron
  useEffect(() => {
    setWallet("tron", tronConnected ? tronAddr ?? null : null);
  }, [tronConnected, tronAddr, setWallet]);

  // NEAR init + sync
  useEffect(() => {
    const connector = initNearConnector();
    if (!connector) return;

    const checkConnection = async () => {
      try {
        const account = await getNearAccount();
        if (account) setWallet("near", account);
      } catch (e) {
        console.error("[NEAR] check failed:", e);
      }
    };

    const timer = setTimeout(checkConnection, 500);

    const onSignIn = async () => {
      const account = await getNearAccount().catch(() => null);
      if (account) setWallet("near", account);
    };
    const onSignOut = () => setWallet("near", null);

    connector.on("wallet:signIn", onSignIn);
    connector.on("wallet:signOut", onSignOut);
    return () => {
      clearTimeout(timer);
      connector.off("wallet:signIn", onSignIn);
      connector.off("wallet:signOut", onSignOut);
    };
  }, [setWallet]);

  // Disconnect per chain
  const disconnectChain = useCallback(
    async (chain: ChainType) => {
      try {
        switch (chain) {
          case "evm":
          case "solana":
          case "bitcoin":
            if (appKitConnected) await appKitDisconnect();
            if (wagmiConnected) wagmiDisconnect();
            break;
          case "sui":
            suiDisconnect();
            break;
          case "near":
            await disconnectNearWallet();
            setWallet("near", null);
            break;
          case "aptos":
            await aptosDisconnect();
            break;
          case "starknet":
            starknetDisconnect();
            break;
          case "ton":
            await tonConnectUI.disconnect();
            break;
          case "tron":
            await tronDisconnect();
            break;
        }
      } catch (e) {
        console.error(`Failed to disconnect ${chain}:`, e);
      }
    },
    [
      appKitConnected,
      appKitDisconnect,
      wagmiConnected,
      wagmiDisconnect,
      suiDisconnect,
      aptosDisconnect,
      starknetDisconnect,
      tonConnectUI,
      tronDisconnect,
      setWallet,
    ]
  );

  return { disconnectChain };
}
