import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Users, 
  CreditCard, 
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Database,
  Monitor,
  Server,
  Zap,
  Cloud,
  Plus,
  Download,
  Eye
} from 'lucide-react';
import { 
  BrutalCard, 
  BrutalButton, 
  BrutalMetric, 
  BrutalChart, 
  BrutalList,
  BrutalContainer 
} from './ui/brutal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import InvoiceGenerator from './InvoiceGenerator';
import Sidebar from './Sidebar';
import ApiService from '../services/api';

const BrutalDashboard = ({ onLogout }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch real data from backend
      try {
        const analyticsResponse = await ApiService.getAnalytics();
        console.log('Real analytics data:', analyticsResponse);
        
        // Use real data if available, otherwise fall back to demo data
        setData({
          analytics: analyticsResponse.data || generateDemoAnalytics(),
          customers: analyticsResponse.data?.customers || generateDemoCustomers(),
          invoices: analyticsResponse.data?.invoices || generateDemoInvoices(),
          recent_activities: generateRecentActivities()
        });
      } catch (error) {
        console.log('Backend not available, using demo data:', error);
        // Use enhanced demo data that simulates real backend responses
        setData({
          analytics: generateDemoAnalytics(),
          customers: generateDemoCustomers(),
          invoices: generateDemoInvoices(),
          recent_activities: generateRecentActivities()
        });
      }
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate realistic demo data
  const generateDemoAnalytics = () => ({
    total_revenue: 127850,
    monthly_revenue: [
      { month: 'JAN', revenue: 85000, customers: 45, invoices: 120 },
      { month: 'FEB', revenue: 92000, customers: 52, invoices: 135 },
      { month: 'MAR', revenue: 88000, customers: 48, invoices: 128 },
      { month: 'APR', revenue: 105000, customers: 61, invoices: 142 },
      { month: 'MAY', revenue: 118000, customers: 68, invoices: 156 },
      { month: 'JUN', revenue: 127850, customers: 74, invoices: 168 },
    ],
    aws_services: [
      { name: 'API GATEWAY', cost: 1245, usage: '2.5M REQUESTS', status: 'online', utilization: 78 },
      { name: 'LAMBDA', cost: 2180, usage: '850K INVOCATIONS', status: 'online', utilization: 65 },
      { name: 'DYNAMODB', cost: 895, usage: '125GB STORAGE', status: 'online', utilization: 45 },
      { name: 'S3', cost: 445, usage: '500GB STORAGE', status: 'online', utilization: 32 },
      { name: 'CLOUDWATCH', cost: 125, usage: '10M METRICS', status: 'online', utilization: 55 },
      { name: 'SES', cost: 85, usage: '25K EMAILS', status: 'online', utilization: 28 }
    ],
    usage_breakdown: [
      { name: 'API CALLS', value: 45, color: '#20B2AA' },
      { name: 'STORAGE', value: 25, color: '#16A34A' },
      { name: 'COMPUTE', value: 20, color: '#F59E0B' },
      { name: 'NETWORK', value: 10, color: '#EF4444' }
    ]
  });

  const generateDemoCustomers = () => [
    { customer_id: 'cust_001', name: 'TECHFLOW ENTERPRISES', pricing_tier: 'ENTERPRISE', status: 'ACTIVE', revenue: 15500, last_invoice: '2024-01-15', growth: '+23%' },
    { customer_id: 'cust_002', name: 'CLOUDSTORE DYNAMICS', pricing_tier: 'PRO', status: 'ACTIVE', revenue: 8200, last_invoice: '2024-01-14', growth: '+18%' },
    { customer_id: 'cust_003', name: 'FINTECH SOLUTIONS', pricing_tier: 'BASIC', status: 'PENDING', revenue: 2990, last_invoice: '2024-01-13', growth: '+5%' },
    { customer_id: 'cust_004', name: 'DATASTREAM SYSTEMS', pricing_tier: 'PRO', status: 'ACTIVE', revenue: 12899, last_invoice: '2024-01-12', growth: '+31%' },
    { customer_id: 'cust_005', name: 'APIFORGE NETWORKS', pricing_tier: 'ENTERPRISE', status: 'ACTIVE', revenue: 23200, last_invoice: '2024-01-11', growth: '+42%' },
    { customer_id: 'cust_006', name: 'MICROSERVICE LABS', pricing_tier: 'PRO', status: 'ACTIVE', revenue: 6750, last_invoice: '2024-01-10', growth: '+12%' }
  ];

  const generateDemoInvoices = () => [
    { invoice_id: 'INV-2024-001', customer_name: 'TECHFLOW ENTERPRISES', total_amount: 15500, status: 'PAID', date: '2024-01-15', due_date: '2024-02-14', aws_cost: 12400 },
    { invoice_id: 'INV-2024-002', customer_name: 'CLOUDSTORE DYNAMICS', total_amount: 8200, status: 'PENDING', date: '2024-01-14', due_date: '2024-02-13', aws_cost: 6560 },
    { invoice_id: 'INV-2024-003', customer_name: 'DATASTREAM SYSTEMS', total_amount: 12899, status: 'PAID', date: '2024-01-13', due_date: '2024-02-12', aws_cost: 10319 },
    { invoice_id: 'INV-2024-004', customer_name: 'APIFORGE NETWORKS', total_amount: 23200, status: 'PAID', date: '2024-01-12', due_date: '2024-02-11', aws_cost: 18560 },
    { invoice_id: 'INV-2024-005', customer_name: 'MICROSERVICE LABS', total_amount: 6750, status: 'OVERDUE', date: '2024-01-10', due_date: '2024-02-09', aws_cost: 5400 }
  ];

  const generateRecentActivities = () => [
    { id: 1, type: 'PAYMENT', description: 'PAYMENT RECEIVED: $23,200 FROM APIFORGE NETWORKS', time: '3 MIN AGO', amount: 23200 },
    { id: 2, type: 'INVOICE', description: 'INVOICE GENERATED: INV-2024-006 FOR TECHFLOW ENTERPRISES', time: '18 MIN AGO', amount: 15500 },
    { id: 3, type: 'CUSTOMER', description: 'NEW CUSTOMER ONBOARDED: BLOCKCHAIN DYNAMICS', time: '1 HOUR AGO', amount: 0 },
    { id: 4, type: 'SYSTEM', description: 'AUTOMATED BILLING CYCLE COMPLETED: 168 INVOICES PROCESSED', time: '2 HOURS AGO', amount: 0 },
    { id: 5, type: 'ALERT', description: 'HIGH USAGE DETECTED: DATASTREAM SYSTEMS (125% OF LIMIT)', time: '3 HOURS AGO', amount: 0 },
    { id: 6, type: 'PAYMENT', description: 'PAYMENT RECEIVED: $12,899 FROM DATASTREAM SYSTEMS', time: '4 HOURS AGO', amount: 12899 }
  ];

  if (loading) {
    return (
      <BrutalContainer>
        <div className="min-h-screen flex items-center justify-center">
          <BrutalCard color="primary" className="p-8 text-center">
            <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4" />
            <p className="font-brutal text-xl">LOADING DASHBOARD...</p>
            <p className="font-mono-brutal text-sm mt-2">FETCHING REAL-TIME DATA</p>
          </BrutalCard>
        </div>
      </BrutalContainer>
    );
  }

  const analytics = data?.analytics || {};
  const totalRevenue = analytics.total_revenue || 0;
  const totalCustomers = data?.customers?.length || 0;
  const totalInvoices = data?.invoices?.length || 0;
  const paidInvoices = data?.invoices?.filter(inv => inv.status === 'PAID').length || 0;
  const totalAwsCost = analytics.aws_services?.reduce((sum, service) => sum + service.cost, 0) || 0;

  return (
    <BrutalContainer>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar onLogout={onLogout} />
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="px-4 py-3 border-b-4 border-primary bg-brutal-black">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-brutal text-3xl text-brutal-white mb-1">
                  DASHBOARD OVERVIEW
                </h1>
                <p className="font-mono-brutal text-brutal-gray text-sm">
                  AWS BILLING PLATFORM • REAL-TIME ANALYTICS
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="font-mono-brutal text-sm text-brutal-white">
                  LAST UPDATE: {lastUpdated.toLocaleTimeString()}
                </div>
                <BrutalButton 
                  onClick={fetchDashboardData}
                  variant="secondary"
                  size="sm"
                  className="p-3"
                >
                  <RefreshCw className="h-4 w-4" />
                </BrutalButton>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-4">
            {/* Fixed Bento Grid Layout - No Overlapping */}
            <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              
              {/* Row 1 */}
              {/* Large Revenue Card */}
              <div className="lg:col-span-2 xl:col-span-3">
                <BrutalCard color="primary" className="p-6 h-64">
                  <div className="h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-mono-brutal text-sm mb-2 opacity-80">
                          TOTAL REVENUE
                        </p>
                        <p className="font-brutal text-4xl mb-2">
                          ${totalRevenue.toLocaleString()}
                        </p>
                        <div className="flex items-center space-x-2">
                          <div className="px-2 py-1 bg-success border-2 border-brutal-black">
                            <TrendingUp className="h-3 w-3 mr-1 inline" />
                            <span className="font-mono-brutal text-xs">+18.5%</span>
                          </div>
                          <div className="px-2 py-1 bg-brutal-black border-2 border-brutal-black text-brutal-white">
                            <span className="font-mono-brutal text-xs">VS LAST MONTH</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-brutal-black border-2 border-brutal-black">
                        <DollarSign className="h-8 w-8 text-brutal-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.monthly_revenue?.slice(-6) || []}>
                          <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#141414" 
                            strokeWidth={4}
                            dot={{ fill: '#141414', strokeWidth: 2, r: 4 }}
                          />
                          <XAxis dataKey="month" hide />
                          <YAxis hide />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: '#141414',
                              border: '3px solid #20B2AA',
                              color: '#FAFAFA',
                              fontFamily: 'JetBrains Mono'
                            }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </BrutalCard>
              </div>

              {/* Customers Metric */}
              <div className="lg:col-span-1 xl:col-span-1">
                <BrutalCard color="success" className="p-6 h-64">
                  <div className="h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono-brutal text-sm mb-2 text-brutal-black opacity-80">
                          CUSTOMERS
                        </p>
                        <p className="font-brutal text-3xl text-brutal-black mb-2">
                          {totalCustomers}
                        </p>
                        <div className="px-2 py-1 bg-brutal-black border-2 border-brutal-black">
                          <span className="font-mono-brutal text-xs text-brutal-white">+{Math.floor(totalCustomers * 0.15)} THIS MONTH</span>
                        </div>
                      </div>
                      <div className="p-3 bg-brutal-black border-2 border-brutal-black">
                        <Users className="h-6 w-6 text-brutal-white" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-xs font-mono-brutal text-brutal-black opacity-60">
                        ACTIVE: {data?.customers?.filter(c => c.status === 'ACTIVE').length || 0}
                      </div>
                    </div>
                  </div>
                </BrutalCard>
              </div>

              {/* AWS Cost Metric */}
              <div className="lg:col-span-1 xl:col-span-1">
                <BrutalCard color="warning" className="p-6 h-64">
                  <div className="h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono-brutal text-sm mb-2 text-brutal-black opacity-80">
                          AWS COSTS
                        </p>
                        <p className="font-brutal text-3xl text-brutal-black mb-2">
                          ${totalAwsCost.toLocaleString()}
                        </p>
                        <div className="px-2 py-1 bg-brutal-black border-2 border-brutal-black">
                          <span className="font-mono-brutal text-xs text-brutal-white">MONTHLY</span>
                        </div>
                      </div>
                      <div className="p-3 bg-brutal-black border-2 border-brutal-black">
                        <Cloud className="h-6 w-6 text-brutal-white" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-xs font-mono-brutal text-brutal-black opacity-60">
                        MARGIN: {Math.round(((totalRevenue - totalAwsCost) / totalRevenue) * 100)}%
                      </div>
                    </div>
                  </div>
                </BrutalCard>
              </div>

              {/* Invoices Status */}
              <div className="lg:col-span-1 xl:col-span-1">
                <BrutalCard color="black" className="p-6 h-64">
                  <div className="h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono-brutal text-sm mb-2 text-brutal-white opacity-80">
                          INVOICES
                        </p>
                        <p className="font-brutal text-3xl text-brutal-white mb-2">
                          {paidInvoices}/{totalInvoices}
                        </p>
                        <div className="px-2 py-1 bg-success border-2 border-brutal-white">
                          <span className="font-mono-brutal text-xs text-brutal-white">{Math.round((paidInvoices/totalInvoices)*100)}% PAID</span>
                        </div>
                      </div>
                      <div className="p-3 bg-primary border-2 border-brutal-white">
                        <CreditCard className="h-6 w-6 text-brutal-black" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-xs font-mono-brutal text-brutal-white opacity-60">
                        OVERDUE: {data?.invoices?.filter(i => i.status === 'OVERDUE').length || 0}
                      </div>
                    </div>
                  </div>
                </BrutalCard>
              </div>

              {/* Row 2 - Charts */}
              {/* Monthly Revenue Chart */}
              <div className="lg:col-span-3 xl:col-span-4">
                <BrutalCard color="white" className="p-6 h-80">
                  <h3 className="font-brutal text-lg mb-4 text-brutal-black">
                    MONTHLY REVENUE ANALYTICS
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.monthly_revenue || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333333" strokeWidth={2} />
                        <XAxis 
                          dataKey="month" 
                          stroke="#141414"
                          fontSize={12}
                          fontFamily="JetBrains Mono"
                          fontWeight={600}
                        />
                        <YAxis 
                          stroke="#141414"
                          fontSize={12}
                          fontFamily="JetBrains Mono"
                          fontWeight={600}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#141414',
                            border: '3px solid #20B2AA',
                            color: '#FAFAFA',
                            fontFamily: 'JetBrains Mono'
                          }}
                        />
                        <Bar 
                          dataKey="revenue" 
                          fill="#20B2AA" 
                          stroke="#141414"
                          strokeWidth={3}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </BrutalCard>
              </div>

              {/* Usage Breakdown */}
              <div className="lg:col-span-1 xl:col-span-2">
                <BrutalCard color="white" className="p-6 h-80">
                  <h3 className="font-brutal text-lg mb-4 text-brutal-black">
                    USAGE BREAKDOWN
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.usage_breakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="value"
                          stroke="#141414"
                          strokeWidth={3}
                        >
                          {analytics.usage_breakdown?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#141414',
                            border: '3px solid #20B2AA',
                            color: '#FAFAFA',
                            fontFamily: 'JetBrains Mono'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </BrutalCard>
              </div>

              {/* Row 3 - Lists */}
              {/* Customer List */}
              <div className="lg:col-span-2 xl:col-span-2">
                <BrutalCard color="white" className="p-4 h-80">
                  <h4 className="font-brutal text-sm mb-4 text-brutal-black">TOP CUSTOMERS</h4>
                  <div className="h-64 overflow-y-auto space-y-2">
                    {data?.customers?.slice(0, 6).map((customer) => (
                      <div key={customer.customer_id} className="p-3 border-2 border-brutal-black bg-brutal-white hover:bg-primary hover:text-brutal-black transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-mono-brutal text-xs font-bold">{customer.name}</p>
                            <p className="font-mono-brutal text-xs text-brutal-gray">{customer.pricing_tier}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-brutal text-sm">${customer.revenue.toLocaleString()}</p>
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 ${customer.status === 'ACTIVE' ? 'bg-success' : 'bg-warning'}`}></div>
                              <span className="font-mono-brutal text-xs text-success">{customer.growth}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </BrutalCard>
              </div>

              {/* Invoice List */}
              <div className="lg:col-span-2 xl:col-span-2">
                <BrutalCard color="white" className="p-4 h-80">
                  <h4 className="font-brutal text-sm mb-4 text-brutal-black">RECENT INVOICES</h4>
                  <div className="h-64 overflow-y-auto space-y-2">
                    {data?.invoices?.slice(0, 5).map((invoice) => (
                      <div key={invoice.invoice_id} className="p-3 border-2 border-brutal-black bg-brutal-white hover:bg-primary hover:text-brutal-black transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-mono-brutal text-xs font-bold">{invoice.invoice_id}</p>
                            <p className="font-mono-brutal text-xs text-brutal-gray">{invoice.customer_name}</p>
                          </div>
                          <div className="text-right flex items-center space-x-2">
                            <div>
                              <p className="font-brutal text-sm">${invoice.total_amount.toLocaleString()}</p>
                              <div className={`text-xs font-mono-brutal ${
                                invoice.status === 'PAID' ? 'text-success' : 
                                invoice.status === 'OVERDUE' ? 'text-error' : 'text-warning'
                              }`}>
                                {invoice.status}
                              </div>
                            </div>
                            <InvoiceGenerator invoiceData={invoice} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </BrutalCard>
              </div>

              {/* Activity Feed */}
              <div className="lg:col-span-2 xl:col-span-2">
                <BrutalCard color="black" className="p-4 h-80">
                  <h4 className="font-brutal text-sm mb-4 text-brutal-white">RECENT ACTIVITY</h4>
                  <div className="h-64 overflow-y-auto space-y-2">
                    {data?.recent_activities?.slice(0, 6).map((activity) => (
                      <div key={activity.id} className="p-3 border-2 border-brutal-gray bg-brutal-black">
                        <div className="flex items-start space-x-2">
                          <div className={`w-2 h-2 mt-2 flex-shrink-0 ${
                            activity.type === 'PAYMENT' ? 'bg-success' :
                            activity.type === 'INVOICE' ? 'bg-warning' :
                            activity.type === 'CUSTOMER' ? 'bg-info' : 
                            activity.type === 'ALERT' ? 'bg-error' : 'bg-primary'
                          }`}></div>
                          <div className="flex-1">
                            <p className="font-mono-brutal text-xs text-brutal-white">{activity.description}</p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="font-mono-brutal text-xs text-brutal-gray">{activity.time}</p>
                              {activity.amount > 0 && (
                                <p className="font-brutal text-xs text-success">${activity.amount.toLocaleString()}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </BrutalCard>
              </div>

            </div>
          </div>
        </div>
      </div>
    </BrutalContainer>
  );
};

export default BrutalDashboard;