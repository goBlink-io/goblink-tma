import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "./providers/Web3Provider";
import { WalletSyncProvider } from "./providers/WalletSyncProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Layout } from "./components/Layout";
import { TransferPage } from "./pages/TransferPage";
import { StatusPage } from "./pages/StatusPage";
import { HistoryPage } from "./pages/HistoryPage";

export function App() {
  return (
    <ErrorBoundary>
      <Web3Provider>
        <WalletSyncProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
              <Route path="/" element={<TransferPage />} />
              <Route
                path="/status/:depositAddress"
                element={<StatusPage />}
              />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </WalletSyncProvider>
    </Web3Provider>
    </ErrorBoundary>
  );
}
