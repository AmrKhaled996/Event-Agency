import JsonBox from "../../../components/UI/AdminDashboard/JsonBox";

export default function ActiveUsersPanel() {
  return (
    <JsonBox
      data={{
        active_now: 1284,
        active_today: 8432,
        active_week: 31200,
        peak_hour: "20:00–21:00",
        top_country: "US",
      }}
    />
  );
}
