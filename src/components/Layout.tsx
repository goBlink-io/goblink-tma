import { useEffect, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTelegram } from "../hooks/useTelegram";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { backButton, isInTMA, themeParams } = useTelegram();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  // BackButton integration with React Router
  useEffect(() => {
    if (!isInTMA) return;

    if (isHome) {
      backButton.hide();
    } else {
      backButton.show();
      const handler = () => navigate(-1);
      backButton.onClick(handler);
      return () => backButton.offClick(handler);
    }
  }, [isHome, backButton, navigate, isInTMA]);

  // Sync theme params to CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    if (themeParams.bg_color)
      root.style.setProperty("--tg-theme-bg-color", themeParams.bg_color);
    if (themeParams.text_color)
      root.style.setProperty("--tg-theme-text-color", themeParams.text_color);
    if (themeParams.hint_color)
      root.style.setProperty("--tg-theme-hint-color", themeParams.hint_color);
    if (themeParams.button_color)
      root.style.setProperty(
        "--tg-theme-button-color",
        themeParams.button_color
      );
    if (themeParams.button_text_color)
      root.style.setProperty(
        "--tg-theme-button-text-color",
        themeParams.button_text_color
      );
    if (themeParams.secondary_bg_color)
      root.style.setProperty(
        "--tg-theme-secondary-bg-color",
        themeParams.secondary_bg_color
      );
  }, [themeParams]);

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color,#0f172a)] text-[var(--tg-theme-text-color,#f8fafc)]">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-[var(--tg-theme-bg-color,#0f172a)] border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            gB
          </span>
          <span className="text-sm font-semibold">goBlink</span>
        </div>

        {/* Nav tabs */}
        <nav className="flex items-center gap-1">
          <button
            onClick={() => navigate("/")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isHome
                ? "bg-gradient-to-r from-blue-600/20 to-violet-600/20 text-blue-400"
                : "text-[var(--tg-theme-hint-color,#94a3b8)]"
            }`}
          >
            Transfer
          </button>
          <button
            onClick={() => navigate("/history")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              location.pathname === "/history"
                ? "bg-gradient-to-r from-blue-600/20 to-violet-600/20 text-blue-400"
                : "text-[var(--tg-theme-hint-color,#94a3b8)]"
            }`}
          >
            History
          </button>
        </nav>
      </header>

      <main className="px-4 pb-24 pt-3">{children}</main>
    </div>
  );
}
