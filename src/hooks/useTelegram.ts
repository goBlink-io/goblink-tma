import { useEffect, useMemo } from "react";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface ThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
  header_bg_color?: string;
  accent_text_color?: string;
  section_bg_color?: string;
  section_header_text_color?: string;
  subtitle_text_color?: string;
  destructive_text_color?: string;
}

interface HapticFeedback {
  impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
  notificationOccurred: (type: "error" | "success" | "warning") => void;
  selectionChanged: () => void;
}

interface MainButton {
  text: string;
  color: string;
  textColor: string;
  isVisible: boolean;
  isActive: boolean;
  isProgressVisible: boolean;
  setText: (text: string) => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
  show: () => void;
  hide: () => void;
  enable: () => void;
  disable: () => void;
  showProgress: (leaveActive?: boolean) => void;
  hideProgress: () => void;
  setParams: (params: {
    text?: string;
    color?: string;
    text_color?: string;
    is_active?: boolean;
    is_visible?: boolean;
  }) => void;
}

interface BackButton {
  isVisible: boolean;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
  show: () => void;
  hide: () => void;
}

interface WebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    query_id?: string;
    auth_date?: number;
    hash?: string;
  };
  colorScheme: "light" | "dark";
  themeParams: ThemeParams;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  HapticFeedback: HapticFeedback;
  MainButton: MainButton;
  BackButton: BackButton;
  ready: () => void;
  expand: () => void;
  close: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: WebApp;
    };
  }
}

function isTMA(): boolean {
  return Boolean(window.Telegram?.WebApp?.initData);
}

const noopHaptic: HapticFeedback = {
  impactOccurred: () => {},
  notificationOccurred: () => {},
  selectionChanged: () => {},
};

const noopMainButton: MainButton = {
  text: "",
  color: "",
  textColor: "",
  isVisible: false,
  isActive: false,
  isProgressVisible: false,
  setText: () => {},
  onClick: () => {},
  offClick: () => {},
  show: () => {},
  hide: () => {},
  enable: () => {},
  disable: () => {},
  showProgress: () => {},
  hideProgress: () => {},
  setParams: () => {},
};

const noopBackButton: BackButton = {
  isVisible: false,
  onClick: () => {},
  offClick: () => {},
  show: () => {},
  hide: () => {},
};

export function useTelegram() {
  const webApp = window.Telegram?.WebApp;
  const isInTMA = isTMA();

  useEffect(() => {
    if (webApp) {
      webApp.ready();
      webApp.expand();
    }
  }, [webApp]);

  const user = useMemo(() => webApp?.initDataUnsafe?.user ?? null, [webApp]);
  const colorScheme = webApp?.colorScheme ?? "dark";
  const themeParams = webApp?.themeParams ?? {};
  const initData = webApp?.initData ?? "";
  const haptic = webApp?.HapticFeedback ?? noopHaptic;
  const mainButton = webApp?.MainButton ?? noopMainButton;
  const backButton = webApp?.BackButton ?? noopBackButton;

  return {
    isInTMA,
    user,
    colorScheme,
    themeParams,
    initData,
    haptic,
    mainButton,
    backButton,
    webApp,
  };
}
