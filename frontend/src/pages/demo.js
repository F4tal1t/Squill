import { useState } from 'react';
import { TrendingUp, Users, CreditCard, DollarSign } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import MetricCard from '../components/MetricCard';
import LineChart from '../components/LineChart';
import DonutChart from '../components/DonutChart';
import ActivityFeed from '../components/ActivityFeed';
import DataTable from '../components/DataTable';

export default function Demo() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Demo data matching your dashboard image
  const demoData = {
    metrics: {
      total_revenue: 6468.96,
      total_customers: 178,
      total_invoices: 82,
      avg_invoice_amount: 78.89
    },
    monthly_revenue: [12, 19, 15, 25, 22, 30],
    recent_activities: [
      {
        id: 1,
        title: 'Task Updated',
        description: 'Website Updated a Task',
        time: '40 Mins Ago',
        icon: TrendingUp,
        color: 'bg-pink-500'
      },
      {
        id: 2,
        title: 'Deal Added',
        description: 'Pencils Updated a Task',
        time: '1 day ago',
        icon: Users,
        color: 'bg-purple-500'
      }
    ],
    invoices: [
      {
        id: '12388',
        customer: 'Charity does',
        from: 'Russia',
        price: '$2652',
        status: 'Process',
        statusColor: 'bg-pink-500'
      },
      {
        id: '12386',
        customer: 'Charity does',
        from: 'Russia',
        price: '$2652',
        status: 'Open',
        statusColor: 'bg-purple-500'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600">Welcome to Squill Billing Platform!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm">
                <span className="text-sm text-gray-600">10-06-2020 to 10-10-2020</span>
              </div>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="New Products"
              value="178+"
              subtitle="New Products"
              gradient="gradient-purple"
              icon={TrendingUp}
            />
            <MetricCard
              title="Top Products"
              value="20+"
              subtitle="Top Products"
              gradient="gradient-blue"
              icon={Users}
            />
            <MetricCard
              title="Sale Products"
              value="190+"
              subtitle="Sale Products"
              gradient="gradient-pink"
              icon={CreditCard}
            />
            <MetricCard
              title="Total Revenue"
              value="12+"
              subtitle="Total Revenue"
              gradient="gradient-orange"
              icon={DollarSign}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <LineChart 
                title="Dashboard"
                data={demoData.monthly_revenue}
              />
            </div>
            <div>
              <DonutChart title="Analytics" percentage={80} />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityFeed activities={demoData.recent_activities} />
            <DataTable 
              title="Order Status"
              data={demoData.invoices}
            />
          </div>
        </div>
      </div>
    </div>
  );
}