import { Bar } from "react-chartjs-2"
import "chart.js/auto"



const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {

        display: false,


    },
    tooltip: {
      backgroundColor: "#111827", 
      titleColor: "#fff",
      bodyColor: "#d1d5db",
      padding: 10,
      cornerRadius: 6,
    },
  },
  scales: {  
    x: {
      grid: { display: false },
      ticks: {
        color: "#6b7280", 
      },
    },
    y: {
      grid: {
        color: "#e5e7eb", 
      },
      ticks: {
        color: "#6b7280",
      },
    },
  },
}

export default function BarChart({data ,labels}) {
const setdata = {
  labels: labels,
  datasets: [
    
    {

      label: "Tickets Sold",
      
      data: data,
      backgroundColor: ["#BB52E0"  ,"#FF8370" , "#FF49B5"],
      titleColor: "#fff",

      labelColor: "#fff",
      borderRadius: 8,
      barThickness: 30,
    },
  
  ],
}
  return (
      <Bar data={setdata} options={options}  />
  )
}
