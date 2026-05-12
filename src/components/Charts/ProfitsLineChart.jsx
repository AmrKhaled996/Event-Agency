import{Chart as ChartJS} from'chart.js/auto';
import { point } from 'leaflet';
import { Weight } from 'lucide-react';

import{Line} from'react-chartjs-2';

const data={
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'Profits',
            data: [1200, 1900, 3000, 2500, 3200, 4000, 4500, 4800, 5000, 5500, 6000, 7000],
            backgroundColor: 'rgba(16, 156, 250, 0.3)',
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: 'rgba(16, 126, 280, 1)',
            fill: true,
            lineTension: 0.1,
            tension: 0.4,
            borderWidth: 3,
            borderColor: 'rgba(16, 126, 280, 1)',

        },
    ],
};
const options={
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: "#374151", 
                font: { size: 16 ,weight: 'bold'},
            },
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
            ticks: {
                color: "#374151", 
                font: { size: 12 },
            },
            grid: {
                color: "#374151", 
            },
        },
        y: {
            ticks: {
                color: "#374151", 
                font: { size: 12 },
            },
            grid: {
                color: "#374151", 
            },
        },
    },
};
    export default function ProfitsLineChart() {
        return(<>
            <Line data={data} options={options} /></>);
    }