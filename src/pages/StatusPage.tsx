import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StatusTracker } from "../components/StatusTracker";
import { useTelegram } from "../hooks/useTelegram";

export function StatusPage() {
  const { depositAddress } = useParams<{ depositAddress: string }>();
  const navigate = useNavigate();
  const { mainButton, isInTMA } = useTelegram();

  // Show "New Transfer" on MainButton when on status page
  useEffect(() => {
    if (!isInTMA) return;

    const handler = () => navigate("/");
    mainButton.setParams({
      text: "New Transfer",
      is_active: true,
      is_visible: true,
    });
    mainButton.hideProgress();
    mainButton.onClick(handler);

    return () => {
      mainButton.offClick(handler);
      mainButton.hide();
    };
  }, [isInTMA, mainButton, navigate]);

  if (!depositAddress) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--tg-theme-hint-color,#94a3b8)]">
          No deposit address provided
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Transfer Status</h1>
      <StatusTracker depositAddress={depositAddress} />
    </div>
  );
}
