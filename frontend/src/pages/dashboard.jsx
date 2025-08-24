import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Users, CreditCard, DollarSign } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import MetricCard from '../components/MetricCard';
import LineChart from '../components/LineChart';
import DonutChart from '../components/DonutChart';
import ActivityFeed from '../components/ActivityFeed';
import DataTable from '../components/DataTable';

export default function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch analytics data
  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch('/api/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Use dummy data if API fails
      setAnalytics({
        metrics: {
          total_revenue: 6468.96,
          total_customers: 178,
          total_invoices: 82,
          avg_invoice_amount: 78.89
        },
        monthly_revenue: {
          '2024-01': 1200,
          '2024-02': 1900,
          '2024-03': 1500,
          '2024-04': 2500,
          '2024-05': 2200,
          '2024-06': 3000
        },
        usage_by_type: {
          api_call: 15420,
          storage_gb: 245,
          transaction: 892
        },
        recent_activities: [
          {
            id: 1,
            type: 'invoice',
            title: 'Invoice Generated',
            description: 'Invoice #INV-202401-cust001 created',
            time: '2 hours ago'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user}!</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm">
                  <Calendar size={16} className="text-gray-400" />
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
                value={`$${analytics?.metrics?.total_revenue?.toFixed(2) || '6,468.96'}`}
                subtitle="Total Revenue"
                gradient="gradient-orange"
                icon={DollarSign}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <LineChart 
                  title="Revenue Overview"
                  data={Object.values(analytics?.monthly_revenue || {})}
                />
              </div>
              <div>
                <DonutChart title="Analytics" percentage={80} />
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityFeed activities={analytics?.recent_activities} />
              <DataTable 
                title="Recent Invoices"
                data={analytics?.invoices?.map(inv => ({
                  id: inv.invoice_id,
                  customer: inv.customer_name,
                  from: 'Platform',
                  price: `$${inv.total_amount}`,
                  status: inv.status,
                  statusColor: inv.status === 'generated' ? 'bg-green-500' : 'bg-purple-500'
                }))}
              />
            </div>
          </div>
        );

      case 'customers':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
            <DataTable 
              title="All Customers"
              data={analytics?.customers?.map(customer => ({
                id: customer.customer_id,
                customer: customer.name,
                from: customer.email,
                price: customer.pricing_tier,
                status: 'Active',
                statusColor: 'bg-green-500'
              }))}
            />
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Billing</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Total Revenue"
                value={`$${analytics?.metrics?.total_revenue?.toFixed(2) || '0'}`}
                subtitle="This Month"
                gradient="gradient-purple"
                icon={DollarSign}
              />
              <MetricCard
                title="Total Invoices"
                value={analytics?.metrics?.total_invoices || '0'}
                subtitle="Generated"
                gradient="gradient-blue"
                icon={CreditCard}
              />
              <MetricCard
                title="Average Invoice"
                value={`$${analytics?.metrics?.avg_invoice_amount?.toFixed(2) || '0'}`}
                subtitle="Per Invoice"
                gradient="gradient-pink"
                icon={TrendingUp}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Coming Soon</h2>
              <p className="text-gray-600">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} section is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 p-6 overflow-auto">
        {renderDashboardContent()}
      </div>
    </div>
  );
};

