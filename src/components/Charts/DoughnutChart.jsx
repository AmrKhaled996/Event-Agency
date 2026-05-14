import {Chart as ChartJS} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';


const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#374151", 
        font: { size: 12 ,weight: 'bold' },
      },
    },
    tooltip: { 
      backgroundColor: "#111827", 
      titleColor: "#fff",
      bodyColor: "#d1d5db",
    },
  },
};
export default function DoughnutChart({ data, labels }) {
  const setdata = {
    labels: labels || ["Active", "Canceled", "Upcoming"],
    datasets: [
      {
        label: "Count",
        data: data,
        backgroundColor: [
          "rgba(26, 197, 4, 0.756)",
          "rgba(197, 4, 4, 0.756)",
          "rgba(10, 4, 197, 0.756)",
          "rgba(255, 159, 64, 0.756)",
          "rgba(153, 102, 255, 0.756)",
        ],
        borderColor: [
          "rgba(26, 197, 4, 1)",
          "rgba(197, 4, 4, 1)",
          "rgba(10, 4, 197, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };




  return (
    <Doughnut data={setdata } options={options} />
  );
}