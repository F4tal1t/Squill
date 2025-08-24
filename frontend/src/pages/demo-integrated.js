import { useState, useEffect } from 'react';
import { TrendingUp, Users, CreditCard, DollarSign, Activity, Database } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import MetricCard from '../components/MetricCard';
import LineChart from '../components/LineChart';
import DonutChart from '../components/DonutChart';
import ActivityFeed from '../components/ActivityFeed';
import DataTable from '../components/DataTable';

export default function DemoIntegrated() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://a953zu5bnc.execute-api.us-east-1.amazonaws.com/dev/analytics');
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
        return;
      }
      throw new Error('API not available');
    } catch (error) {
      console.log('Using demo data - API not available:', error.message);
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
            title: 'INVOICE GENERATED',
            description: 'INVOICE #INV-202401-CUST001 CREATED',
            time: '2 HOURS AGO',
            icon: CreditCard
          },
          {
            id: 2,
            title: 'CUSTOMER ADDED',
            description: 'NEW CUSTOMER CUST-005 REGISTERED',
            time: '4 HOURS AGO',
            icon: Users
          },
          {
            id: 3,
            title: 'USAGE SPIKE',
            description: 'API CALLS INCREASED BY 25%',
            time: '6 HOURS AGO',
            icon: Activity
          }
        ],
        customers: [
          { customer_id: 'cust-001', name: 'RESTAURANT ABC', email: 'owner@restaurantabc.com', pricing_tier: 'BASIC' },
          { customer_id: 'cust-002', name: 'TECH STARTUP XYZ', email: 'billing@techxyz.com', pricing_tier: 'PRO' },
          { customer_id: 'cust-003', name: 'E-COMMERCE STORE', email: 'admin@estore.com', pricing_tier: 'ENTERPRISE' },
          { customer_id: 'cust-004', name: 'FOOD DELIVERY APP', email: 'ops@foodapp.com', pricing_tier: 'PRO' },
          { customer_id: 'cust-005', name: 'IOT PLATFORM', email: 'billing@iotplatform.com', pricing_tier: 'BASIC' }
        ],
        invoices: [
          { invoice_id: 'INV-001', customer_name: 'RESTAURANT ABC', total_amount: 156.78, status: 'GENERATED' },
          { invoice_id: 'INV-002', customer_name: 'TECH STARTUP XYZ', total_amount: 289.45, status: 'SENT' },
          { invoice_id: 'INV-003', customer_name: 'E-COMMERCE STORE', total_amount: 445.23, status: 'PAID' },
          { invoice_id: 'INV-004', customer_name: 'FOOD DELIVERY APP', total_amount: 178.90, status: 'PAID' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center grid-pattern">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent loading-block mx-auto mb-4"></div>
          <p className="font-mono text-gray-600 uppercase tracking-wider font-bold">LOADING DASHBOARD...</p>
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
            <div className="flex items-center justify-between block-fade">
              <div>
                <h1 className="text-3xl font-mono font-bold text-gray-900 uppercase tracking-wider">DASHBOARD</h1>
                <p className="text-sm font-mono text-gray-600 uppercase tracking-wider mt-1 font-bold">SQUILL BILLING PLATFORM OVERVIEW</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 block-card px-4 py-2">
                  <span className="text-xs font-mono text-gray-600 uppercase tracking-wider font-bold">REAL-TIME DATA</span>
                  <div className="w-2 h-2 bg-primary animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="TOTAL CUSTOMERS"
                value={analytics?.metrics?.total_customers?.toString() || '178'}
                subtitle="ACTIVE USERS"
                icon={Users}
                delay={0.1}
              />
              <MetricCard
                title="API CALLS"
                value={analytics?.usage_by_type?.api_call?.toLocaleString() || '15,420'}
                subtitle="THIS MONTH"
                icon={Activity}
                delay={0.2}
              />
              <MetricCard
                title="TOTAL INVOICES"
                value={analytics?.metrics?.total_invoices?.toString() || '82'}
                subtitle="GENERATED"
                icon={CreditCard}
                delay={0.3}
              />
              <MetricCard
                title="TOTAL REVENUE"
                value={`$${analytics?.metrics?.total_revenue?.toFixed(2) || '6,468.96'}`}
                subtitle="PLATFORM EARNINGS"
                icon={DollarSign}
                delay={0.4}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 block-fade stagger-1">
                <LineChart 
                  title="REVENUE ANALYTICS"
                  data={Object.values(analytics?.monthly_revenue || {})}
                />
              </div>
              <div className="block-fade stagger-2">
                <DonutChart title="USAGE DISTRIBUTION" percentage={85} />
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="block-fade stagger-3">
                <ActivityFeed activities={analytics?.recent_activities} />
              </div>
              <div className="block-fade stagger-4">
                <DataTable 
                  title="RECENT INVOICES"
                  data={analytics?.invoices?.map(inv => ({
                    id: inv.invoice_id,
                    customer: inv.customer_name,
                    from: 'PLATFORM',
                    price: `$${inv.total_amount}`,
                    status: inv.status,
                    statusColor: inv.status === 'PAID' ? 'bg-primary' : 'bg-blue-400'
                  }))}
                />
              </div>
            </div>
          </div>
        );

      case 'customers':
        return (
          <div className="space-y-6">
            <div className="block-fade">
              <h1 className="text-3xl font-mono font-bold text-gray-900 uppercase tracking-wider mb-2">CUSTOMERS</h1>
              <p className="text-sm font-mono text-gray-600 uppercase tracking-wider font-bold">MANAGE PLATFORM USERS</p>
            </div>
            <div className="block-fade stagger-1">
              <DataTable 
                title="ALL CUSTOMERS"
                data={analytics?.customers?.map(customer => ({
                  id: customer.customer_id,
                  customer: customer.name,
                  from: customer.email,
                  price: customer.pricing_tier,
                  status: 'ACTIVE',
                  statusColor: 'bg-primary'
                }))}
              />
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="block-fade">
              <h1 className="text-3xl font-mono font-bold text-gray-900 uppercase tracking-wider mb-2">ANALYTICS</h1>
              <p className="text-sm font-mono text-gray-600 uppercase tracking-wider font-bold">PLATFORM PERFORMANCE METRICS</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="API CALLS"
                value={analytics?.usage_by_type?.api_call?.toLocaleString() || '15,420'}
                subtitle="TOTAL REQUESTS"
                icon={Activity}
                delay={0.1}
              />
              <MetricCard
                title="STORAGE USAGE"
                value={`${analytics?.usage_by_type?.storage_gb || 245}GB`}
                subtitle="DATA STORED"
                icon={Database}
                delay={0.2}
              />
              <MetricCard
                title="TRANSACTIONS"
                value={analytics?.usage_by_type?.transaction?.toLocaleString() || '892'}
                subtitle="PROCESSED"
                icon={CreditCard}
                delay={0.3}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="block-fade stagger-1">
                <LineChart title="USAGE TRENDS" />
              </div>
              <div className="block-fade stagger-2">
                <DonutChart title="RESOURCE DISTRIBUTION" percentage={75} />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 block-fade">
            <div className="text-center block-card p-8">
              <h2 className="text-xl font-mono font-bold text-gray-800 mb-2 uppercase tracking-wider">COMING SOON</h2>
              <p className="font-mono text-gray-600 uppercase tracking-wider font-bold">{activeTab.toUpperCase()} SECTION UNDER DEVELOPMENT</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex grid-pattern">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 p-6 overflow-auto">
        {renderDashboardContent()}
      </div>
    </div>
  );
}