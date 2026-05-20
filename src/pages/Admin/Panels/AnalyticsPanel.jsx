import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../../utils/currencyFormatter";

import JsonBox from "../../../components/UI/AdminDashboard/JsonBox";
import FieldInput from "../../../components/UI/AdminDashboard/FieldInput";


/**
 * AnalyticsPanel
 *
 * Props:
 *   type – "tickets" | "revenue"
 */
export default function AnalyticsPanel({ type }) {
  const { t } = useTranslation();
  const [id, setId] = useState("");
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (!id.trim()) { setRes(null); return; }
    const timer = setTimeout(() =>
      setRes(
        type === "tickets"
          ? { event_id: id, tickets_sold: 342, capacity: 500, fill_rate: "68.4%" }
          : { event_id: id, revenue: formatCurrency(12840), top_tier: `VIP (${formatCurrency(180)})` }
      ), 400);
    return () => clearTimeout(timer);
  }, [id, type]);

  return (
    <>
      <FieldInput
        label={t("fields.eventId")}
        placeholder={t("fields.eventIdPlaceholder")}
        value={id}
        onChange={e => setId(e.target.value)}
      />
      <JsonBox data={res} />
    </>
  );
}
