import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Bell,
  FileText,
  Wallet
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'DASHBOARD' },
    { id: 'customers', icon: Users, label: 'CUSTOMERS' },
    { id: 'billing', icon: CreditCard, label: 'BILLING' },
    { id: 'analytics', icon: BarChart3, label: 'ANALYTICS' },
    { id: 'invoices', icon: FileText, label: 'INVOICES' },
    { id: 'wallet', icon: Wallet, label: 'WALLET' },
    { id: 'notifications', icon: Bell, label: 'NOTIFICATIONS' },
    { id: 'settings', icon: Settings, label: 'SETTINGS' },
  ];

  return (
    <div className="w-20 bg-primary min-h-screen flex flex-col items-center py-6 block-fade">
      {/* Logo */}
      <div className="w-12 h-12 bg-white border-3 border-gray-200 flex items-center justify-center mb-8 shadow-block">
        <span className="text-primary font-mono font-bold text-lg">S</span>
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col space-y-3 flex-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                w-12 h-12 flex items-center justify-center
                transition-all duration-200 group relative block-fade
                border-3 font-mono
                ${isActive 
                  ? 'bg-white text-primary border-white shadow-block' 
                  : 'text-white border-transparent hover:border-white hover:bg-white hover:text-primary'
                }
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
              title={item.label}
            >
              <Icon size={18} strokeWidth={2} />
              
              {/* Tooltip */}
              <div className="absolute left-16 bg-gray-900 text-white px-3 py-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 font-mono shadow-block">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      {/* User Avatar */}
      <div className="w-12 h-12 bg-white text-primary border-3 border-gray-200 flex items-center justify-center shadow-block cursor-pointer hover:border-primary transition-colors">
        <span className="font-mono font-bold text-sm">AD</span>
      </div>
    </div>
  );
}