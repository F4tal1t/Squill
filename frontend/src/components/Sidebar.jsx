import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut,
  Activity,
  DollarSign,
  Menu,
  X
} from 'lucide-react';
import { 
  BrutalButton 
} from './ui/brutal';

const Sidebar = ({ onLogout }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = [
    { icon: BarChart3, label: 'DASHBOARD', id: 'Dashboard' },
    { icon: Users, label: 'CUSTOMERS', id: 'Customers' },
    { icon: CreditCard, label: 'INVOICES', id: 'Invoices' },
    { icon: DollarSign, label: 'REVENUE', id: 'Revenue' },
    { icon: Activity, label: 'ANALYTICS', id: 'Analytics' },
    { icon: Settings, label: 'SETTINGS', id: 'Settings' }
  ];

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    setIsMobileOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <BrutalButton
          onClick={toggleMobileMenu}
          variant="primary"
          size="sm"
          className="p-3"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </BrutalButton>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-brutal-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative
        ${isCollapsed ? 'w-20' : 'w-64'} h-screen
        bg-brutal-black border-r-4 border-primary
        flex flex-col
        transform transition-all duration-300 ease-in-out
        z-40
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Logo Section - Clickable to toggle collapse */}
        <div 
          className={`${isCollapsed ? 'p-4' : 'p-6'} border-b-4 border-primary cursor-pointer hover:bg-primary/10 transition-colors`}
          onClick={toggleCollapse}
        >
          <div className="flex items-center justify-center flex-col space-y-4">
            {/* Logo Area - Square placeholder for your logo */}
            <div className={`${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'} bg-primary border-4 border-brutal-black flex items-center justify-center`}>
              <span className={`text-brutal-black font-brutal ${isCollapsed ? 'text-lg' : 'text-xl'}`}>S</span>
            </div>
            
            {!isCollapsed && (
              <div className="text-center">
                <h2 className="font-brutal text-2xl text-brutal-white">SQUILL</h2>
                <p className="font-mono-brutal text-xs text-brutal-gray mt-1">
                  BILLING AUTOMATION
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`
                  w-full ${isCollapsed ? 'p-3' : 'p-4'} border-4 font-brutal text-left transition-all duration-150
                  flex items-center
                  ${activeItem === item.id 
                    ? 'bg-primary border-brutal-white text-brutal-black shadow-brutal-sm' 
                    : 'bg-brutal-black border-brutal-gray text-brutal-gray hover:border-primary hover:text-primary'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <item.icon className={`${isCollapsed ? '' : 'mr-3'}`} size={isCollapsed ? 24 : 20} />
                {!isCollapsed && (
                  <span className="text-sm">{item.label}</span>
                )}
              </button>
            ))}
          </div>

          {/* Status Section */}
          {!isCollapsed && (
            <div className="mt-8 p-4 border-4 border-success bg-brutal-black">
              <div className="text-center">
                <div className="w-4 h-4 bg-success mx-auto mb-2 animate-pulse"></div>
                <p className="font-mono-brutal text-xs text-success">
                  SYSTEM ONLINE
                </p>
                <p className="font-mono-brutal text-xs text-brutal-gray mt-1">
                  99.9% UPTIME
                </p>
              </div>
            </div>
          )}
        </nav>
        
        {/* User Section */}
        <div className="p-4 border-t-4 border-primary">
          {/* User Info */}
          {!isCollapsed && (
            <div className="mb-4 p-3 border-2 border-brutal-gray bg-brutal-black">
              <div className="font-mono-brutal text-xs text-brutal-white">
                LOGGED IN AS:
              </div>
              <div className="font-brutal text-sm text-primary">
                ADMIN USER
              </div>
            </div>
          )}

          {/* Logout Button */}
          <BrutalButton
            onClick={onLogout}
            variant="error"
            className={`w-full flex items-center justify-center brutal-hover ${isCollapsed ? 'p-3' : ''}`}
          >
            <LogOut className={`${isCollapsed ? '' : 'mr-2'}`} size={isCollapsed ? 20 : 16} />
            {!isCollapsed && 'LOGOUT'}
          </BrutalButton>
        </div>
      </div>
    </>
  );
};

export default Sidebar;