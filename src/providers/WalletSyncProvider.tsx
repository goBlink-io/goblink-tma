import { type ReactNode } from "react";
import { useWalletSync } from "../hooks/useWalletSync";
import { ConnectWalletModal } from "../components/ConnectWalletModal";

function WalletSyncInner({ children }: { children: ReactNode }) {
  useWalletSync();
  return (
    <>
      {children}
      <ConnectWalletModal />
    </>
  );
}

export function WalletSyncProvider({ children }: { children: ReactNode }) {
  return <WalletSyncInner>{children}</WalletSyncInner>;
}
