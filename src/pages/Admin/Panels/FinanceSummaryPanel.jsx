import JsonBox from "../../../components/UI/AdminDashboard/JsonBox";

export default function FinanceSummaryPanel() {
  return (
    <JsonBox
      data={{
        total_revenue: "$284,920",
        pending_payouts: "$18,340",
        processed_payouts: "$266,580",
        organizers_due: 14,
        last_payout: "2025-04-28",
      }}
    />
  );
}
