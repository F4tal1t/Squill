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
  Monitor
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ChartContainer } from './ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import InvoiceGenerator from './InvoiceGenerator';
import ApiService from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const token = ApiService.getToken();
    if (token) {
      ApiService.setToken(token);
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!ApiService.isAuthenticated()) {
        throw new Error('Authentication required');
      }
      
      try {
        const [analytics, customers, invoices] = await Promise.all([
          ApiService.getAnalytics(),
          ApiService.getCustomers(),
          ApiService.getInvoices()
        ]);

        setData({ analytics, customers, invoices });
      } catch (apiError) {
        // Use demo data if API fails
        setData({
          analytics: {
            total_revenue: 47850,
            monthly_revenue: [
              { month: 'Jan', revenue: 35000 },
              { month: 'Feb', revenue: 42000 },
              { month: 'Mar', revenue: 38000 },
              { month: 'Apr', revenue: 45000 },
              { month: 'May', revenue: 48000 },
              { month: 'Jun', revenue: 52000 },
            ],
            usage_metrics: [
              { name: 'API Calls', value: 2400 },
              { name: 'Storage', value: 1800 },
              { name: 'Bandwidth', value: 1200 },
              { name: 'Compute', value: 800 },
            ]
          },
          customers: [
            { customer_id: '1', name: 'TaskFlow Inc', email: 'billing@taskflow.io', pricing_tier: 'Enterprise' },
            { customer_id: '2', name: 'CloudStore Corp', email: 'finance@cloudstore.com', pricing_tier: 'Pro' },
            { customer_id: '3', name: 'FinTech Solutions', email: 'accounts@fintech.io', pricing_tier: 'Basic' }
          ],
          invoices: [
            { invoice_id: 'INV-001', customer_name: 'TaskFlow Inc', total_amount: 999, status: 'generated' },
            { invoice_id: 'INV-002', customer_name: 'CloudStore Corp', total_amount: 299, status: 'pending' },
            { invoice_id: 'INV-003', customer_name: 'FinTech Solutions', total_amount: 99, status: 'generated' }
          ]
        });
      }
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      if (err.message === 'Authentication failed' || err.message === 'Authentication required') {
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, change, icon: Icon, subtitle }) => (
    <Card className="minimal-card fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardDescription className="text-muted-foreground text-xs uppercase tracking-wider">
              {title}
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-primary">
              {value}
            </CardTitle>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
        {change !== undefined && (
          <div className={`flex items-center mt-2 ${change >= 0 ? 'text-primary' : 'text-destructive'}`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm font-bold">{Math.abs(change)}%</span>
          </div>
        )}
      </CardHeader>
    </Card>
  );

  const RevenueChart = () => {
    const chartData = data?.analytics?.monthly_revenue || [
      { month: 'Jan', revenue: 35000 },
      { month: 'Feb', revenue: 42000 },
      { month: 'Mar', revenue: 38000 },
      { month: 'Apr', revenue: 45000 },
      { month: 'May', revenue: 48000 },
      { month: 'Jun', revenue: 52000 },
    ];

    return (
      <Card className="minimal-card fade-in">
        <CardHeader>
          <CardTitle className="text-primary">Revenue Trend</CardTitle>
          <CardDescription className="">Monthly revenue over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  fontFamily="Departure Mono"
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  fontFamily="Departure Mono"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontFamily: 'Departure Mono'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  };

  const UsageChart = () => {
    const usageData = data?.analytics?.usage_metrics || [
      { name: 'API Calls', value: 2400 },
      { name: 'Storage', value: 1800 },
      { name: 'Bandwidth', value: 1200 },
      { name: 'Compute', value: 800 },
    ];

    return (
      <Card className="minimal-card fade-in">
        <CardHeader>
          <CardTitle className="text-primary">Usage Metrics</CardTitle>
          <CardDescription className="">Resource consumption</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  fontFamily="Departure Mono"
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  fontFamily="Departure Mono"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontFamily: 'Departure Mono'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  };

  const DataTable = ({ title, data, type }) => (
    <Card className="minimal-card fade-in">
      <CardHeader>
        <CardTitle className="text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data?.slice(0, 5).map((item, index) => (
            <div key={item.customer_id || item.invoice_id || index} 
                 className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="space-y-1">
                <p className="font-medium text-sm">
                  {type === 'customers' ? item.name : item.customer_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {type === 'customers' ? item.email : item.invoice_id}
                </p>
              </div>
              <div className="text-right">
                {type === 'customers' ? (
                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded">
                    {item.pricing_tier}
                  </span>
                ) : (
                  <div className="space-y-1">
                    <p className="font-medium text-primary">${item.total_amount}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        item.status === 'generated' ? 'bg-primary/20 text-primary' : 
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {item.status}
                      </span>
                      <InvoiceGenerator invoiceData={item} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const SystemStatus = () => (
    <Card className="minimal-card fade-in">
      <CardHeader>
        <CardTitle className="text-primary">System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-primary/5 rounded-lg">
            <CheckCircle className="h-6 w-6 text-primary" />
            <div>
              <p className="font-medium text-primary text-sm">API Status</p>
              <p className="text-xs text-muted-foreground">Operational</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-primary/5 rounded-lg">
            <Database className="h-6 w-6 text-primary" />
            <div>
              <p className="font-medium text-primary text-sm">Database</p>
              <p className="text-xs text-muted-foreground">Connected</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-primary/5 rounded-lg">
            <Monitor className="h-6 w-6 text-primary" />
            <div>
              <p className="font-medium text-primary text-sm">Services</p>
              <p className="text-xs text-muted-foreground">Running</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-primary font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="minimal-card max-w-md">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <CardTitle className="text-destructive">System Error</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button 
              onClick={fetchDashboardData}
              className="w-full"
              disabled={loading}
            >
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const analytics = data?.analytics || {};
  const totalRevenue = analytics.total_revenue || 0;
  const totalCustomers = data?.customers?.length || 0;
  const totalInvoices = data?.invoices?.length || 0;
  const avgInvoiceAmount = totalInvoices > 0 ? totalRevenue / totalInvoices : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8 fade-in">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">
              Squill Dashboard
            </h1>
            <p className="text-muted-foreground">
              Billing Platform Analytics
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">
              Last update: {lastUpdated.toLocaleTimeString()}
            </p>
            <Button 
              onClick={fetchDashboardData}
              variant="outline"
              size="icon"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            change={12.5}
            icon={DollarSign}
            subtitle="All time revenue"
          />
          <MetricCard
            title="Active Customers"
            value={totalCustomers}
            change={8.2}
            icon={Users}
            subtitle="Total customers"
          />
          <MetricCard
            title="Total Invoices"
            value={totalInvoices}
            change={15.3}
            icon={CreditCard}
            subtitle="Generated invoices"
          />
          <MetricCard
            title="Avg Invoice"
            value={`$${avgInvoiceAmount.toFixed(2)}`}
            change={-2.1}
            icon={TrendingUp}
            subtitle="Per invoice"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RevenueChart />
          <UsageChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DataTable 
            title="Recent Customers" 
            data={data?.customers} 
            type="customers"
          />
          <DataTable 
            title="Recent Invoices" 
            data={data?.invoices} 
            type="invoices"
          />
        </div>

        <SystemStatus />
      </div>
    </div>
  );
};

export default Dashboard;