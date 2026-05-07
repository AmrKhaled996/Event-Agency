import { useState } from "react";
import { useTranslation } from "react-i18next";
import JsonBox from "../../../components/UI/AdminDashboard/JsonBox";
import Btn from "../../../components/UI/AdminDashboard/Btn";
import FinanceSummaryPanel from "./FinanceSummaryPanel";
import { ACCENT } from "../../../constants/theme";

export default function ProcessPayoutsPanel() {
  const { t } = useTranslation();
  const [confirm, setConfirm] = useState(false);
  const [res, setRes] = useState(null);

  const handleProcess = () => {
    if (confirm) {
      setRes({
        success: true,
        payouts_processed: 14,
        total_amount: "$18,340",
        processed_at: new Date().toISOString(),
      });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <FinanceSummaryPanel />

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          color: "#9ca3af",
          cursor: "pointer",
          userSelect: "none",
          marginTop: 4,
        }}
      >
        <input
          type="checkbox"
          checked={confirm}
          onChange={(e) => setConfirm(e.target.checked)}
          style={{ width: 14, height: 14, accentColor: ACCENT }}
        />
        {t("confirm.processPayouts")}
      </label>

      <Btn
        label={t("buttons.processPayouts")}
        method="POST"
        onClick={handleProcess}
      />
      <JsonBox data={res} />
    </div>
  );
}
