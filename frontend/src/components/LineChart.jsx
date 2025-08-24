import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function LineChart({ data, title }) {
  const chartData = {
    labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'],
    datasets: [
      {
        label: 'REVENUE',
        data: data || [12, 19, 15, 25, 22, 30],
        borderColor: '#150DF7',
        backgroundColor: 'rgba(21, 13, 247, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#150DF7',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 3,
      },
      {
        label: 'CUSTOMERS',
        data: [8, 12, 18, 15, 20, 25],
        borderColor: '#4d47f8',
        backgroundColor: 'rgba(77, 71, 248, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#4d47f8',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 3,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#150DF7',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#150DF7',
        borderWidth: 2,
        cornerRadius: 0,
        displayColors: false,
        titleFont: {
          family: 'Courier New',
          size: 12,
        },
        bodyFont: {
          family: 'Courier New',
          size: 11,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#666',
          font: {
            family: 'Courier New',
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: '#e5e5e5',
          lineWidth: 1,
        },
        ticks: {
          color: '#666',
          font: {
            family: 'Courier New',
            size: 11,
          },
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        backgroundColor: '#150DF7',
        borderColor: '#fff',
        borderWidth: 2,
      },
      line: {
        borderWidth: 3,
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div className="block-card p-6 block-fade grid-pattern">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-mono font-bold text-gray-900 uppercase tracking-wider">{title || 'REVENUE OVERVIEW'}</h3>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-1 font-bold">CURRENT MONTH EARNINGS</p>
        </div>
        <div className="flex space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary mr-2 border border-gray-300"></div>
            <span className="font-mono text-gray-600 uppercase font-bold">REVENUE</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-400 mr-2 border border-gray-300"></div>
            <span className="font-mono text-gray-600 uppercase font-bold">CUSTOMERS</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 mb-6">
        <Line data={chartData} options={options} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-4 border-t-3 border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-gray-900">$6,468.96</div>
          <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-1 font-bold">MONTH EARNINGS</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-gray-900">82</div>
          <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-1 font-bold">MONTH SALES</div>
        </div>
      </div>
    </div>
  );
}