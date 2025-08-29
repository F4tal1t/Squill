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
  Cloud
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import InvoiceGenerator from './InvoiceGenerator';
import Sidebar from './Sidebar';
import ApiService from '../services/api';

const BentoDashboard = ({ onLogout }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Use demo data for consistent display
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
          aws_services: [
            { name: 'API Gateway', cost: 245, usage: '15K requests' },
            { name: 'Lambda', cost: 180, usage: '50K invocations' },
            { name: 'DynamoDB', cost: 95, usage: '25GB storage' },
            { name: 'S3', cost: 45, usage: '100GB storage' },
          ]
        },
        customers: [
          { customer_id: '1', name: 'TaskFlow Inc', pricing_tier: 'Enterprise', status: 'active' },
          { customer_id: '2', name: 'CloudStore Corp', pricing_tier: 'Pro', status: 'active' },
          { customer_id: '3', name: 'FinTech Solutions', pricing_tier: 'Basic', status: 'pending' }
        ],
        invoices: [
          { invoice_id: 'INV-001', customer_name: 'TaskFlow Inc', total_amount: 999, status: 'paid' },
          { invoice_id: 'INV-002', customer_name: 'CloudStore Corp', total_amount: 299, status: 'pending' },
        ]
      });
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

  if (loading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white/70 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const analytics = data?.analytics || {};
  const totalRevenue = analytics.total_revenue || 0;
  const totalCustomers = data?.customers?.length || 0;
  const totalInvoices = data?.invoices?.length || 0;

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar onLogout={onLogout} />
      
      {/* Main Content */}
      <div className="flex-1 hero-gradient overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Dashboard Overview
              </h1>
              <p className="text-white/70">
                AWS Billing Platform Analytics
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-white/70">
                Last update: {lastUpdated.toLocaleTimeString()}
              </span>
              <Button 
                onClick={fetchDashboardData}
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 border-white/30 text-white hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bento Grid Layout - Exact positioning from image */}
          <div className="grid grid-cols-4 grid-rows-3 gap-4 h-[calc(100vh-200px)]">
            
            {/* Top Row */}
            {/* Large Revenue Card - spans 2 columns */}
            <Card className="col-span-2 row-span-1 bg-gradient-to-br from-purple-600/30 via-blue-600/20 to-purple-800/30 border-white/30 backdrop-blur-xl">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardDescription className="text-white/90 text-sm font-medium">
                      Total Revenue
                    </CardDescription>
                    <CardTitle className="text-3xl font-bold text-white tracking-tight">
                      ${totalRevenue.toLocaleString()}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center px-2 py-1 bg-green-500/20 rounded-full">
                        <TrendingUp className="h-3 w-3 mr-1 text-green-400" />
                        <span className="text-xs font-medium text-green-400">+12.5%</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 bg-white/10 rounded-lg">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.monthly_revenue?.slice(-4) || []}>
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#ffffff" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Customers Card */}
            <Card className="col-span-1 row-span-1 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-white/20 backdrop-blur-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm font-medium">Customers</p>
                    <p className="text-2xl font-bold text-white mt-1">{totalCustomers}</p>
                    <p className="text-xs text-green-400 mt-1">+2 this week</p>
                  </div>
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Users className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Invoices Card */}
            <Card className="col-span-1 row-span-1 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border-white/20 backdrop-blur-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm font-medium">Invoices</p>
                    <p className="text-2xl font-bold text-white mt-1">{totalInvoices}</p>
                    <p className="text-xs text-emerald-400 mt-1">98% paid</p>
                  </div>
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <CreditCard className="h-5 w-5 text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Second Row */}
            {/* AWS Services - Left */}
            <Card className="col-span-1 row-span-1 bg-gradient-to-br from-orange-600/20 to-red-600/20 border-white/20 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-white flex items-center">
                  <Cloud className="h-4 w-4 mr-2 text-orange-400" />
                  AWS Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.aws_services?.slice(0, 3).map((service, index) => (
                    <div key={service.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <p className="text-xs text-white">{service.name}</p>
                      </div>
                      <p className="text-xs font-bold text-white">${service.cost}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Status - Left */}
            <Card className="col-span-1 row-span-1 bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-white/20 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-white flex items-center">
                  <Monitor className="h-4 w-4 mr-2 text-green-400" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: 'API Gateway', icon: Server },
                    { name: 'Lambda', icon: Zap },
                    { name: 'DynamoDB', icon: Database }
                  ].map((service) => (
                    <div key={service.name} className="flex items-center space-x-2">
                      <div className="p-1 bg-green-500/20 rounded">
                        <service.icon className="h-3 w-3 text-green-400" />
                      </div>
                      <p className="text-xs text-white">{service.name}</p>
                      <div className="w-1 h-1 bg-green-400 rounded-full ml-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Large Revenue Chart - Right side, spans 2 columns */}
            <Card className="col-span-2 row-span-2 bg-black/30 border-white/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-purple-400" />
                  Revenue Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-full">
                  <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={analytics.monthly_revenue || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="month" 
                        stroke="rgba(255,255,255,0.7)"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="rgba(255,255,255,0.7)"
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(0,0,0,0.9)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                      <Bar 
                        dataKey="revenue" 
                        fill="#8B5CF6" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Third Row - Bottom */}
            {/* Recent Customers */}
            <Card className="col-span-1 row-span-1 bg-black/30 border-white/20 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-white flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data?.customers?.slice(0, 2).map((customer) => (
                    <div key={customer.customer_id} className="p-2 bg-white/5 rounded-lg">
                      <p className="font-medium text-xs text-white">{customer.name}</p>
                      <p className="text-xs text-white/60">{customer.pricing_tier}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Invoices */}
            <Card className="col-span-1 row-span-1 bg-black/30 border-white/20 backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-white flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Invoices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data?.invoices?.slice(0, 2).map((invoice) => (
                    <div key={invoice.invoice_id} className="p-2 bg-white/5 rounded-lg">
                      <p className="font-medium text-xs text-white">{invoice.customer_name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs font-bold text-white">${invoice.total_amount}</p>
                        <InvoiceGenerator invoiceData={invoice} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BentoDashboard;