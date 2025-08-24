import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonutChart({ title, percentage = 80 }) {
  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [
          '#150DF7',
          '#f5f5f5',
        ],
        borderWidth: 0,
        cutout: '75%',
      },
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
        enabled: false,
      },
    },
    animation: {
      animateRotate: true,
      duration: 1000,
    },
  };

  return (
    <div className="block-card p-6 block-fade grid-pattern">
      <h3 className="text-lg font-mono font-bold text-gray-900 uppercase tracking-wider mb-6">{title || 'ANALYTICS'}</h3>
      
      <div className="relative h-48 flex items-center justify-center mb-6">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-gray-900">{percentage}%</div>
            <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-1 font-bold">TRANSACTIONS</div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center space-x-6 pt-4 border-t-3 border-gray-200">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-primary mr-2 border border-gray-300"></div>
          <span className="text-xs font-mono text-gray-600 uppercase font-bold">SALE</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-400 mr-2 border border-gray-300"></div>
          <span className="text-xs font-mono text-gray-600 uppercase font-bold">DISTRIBUTE</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-300 mr-2 border border-gray-300"></div>
          <span className="text-xs font-mono text-gray-600 uppercase font-bold">RETURN</span>
        </div>
      </div>
    </div>
  );
}