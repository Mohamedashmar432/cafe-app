
import { useState, useEffect } from 'react';
import { LoginPage } from '@/components/auth/LoginPage';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { MenuView } from '@/components/menu/MenuView';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Waiter' | 'Cashier';
  avatar?: string;
};

export type Table = {
  id: string;
  number: string;
  status: 'Available' | 'Ordering' | 'Full' | 'Booked';
  zone: 'Section 1' | 'Section 2' | 'Section 3';
  seats: number;
};

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory: 'Special' | 'Strong' | 'Less Sugar' | 'Normal';
  icon: string;
};

export type OrderItem = {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  modifiers: string[];
  gst: number;
};

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'menu'>('login');

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem('cafeUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('cafeUser', JSON.stringify(userData));
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cafeUser');
    setCurrentView('login');
    setSelectedTable(null);
  };

  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
    setCurrentView('menu');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedTable(null);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {currentView === 'login' && (
          <LoginPage onLogin={handleLogin} />
        )}
        
        {currentView === 'dashboard' && user && (
          <Dashboard
            user={user}
            onLogout={handleLogout}
            onTableSelect={handleTableSelect}
          />
        )}
        
        {currentView === 'menu' && user && selectedTable && (
          <MenuView
            user={user}
            table={selectedTable}
            onBack={handleBackToDashboard}
            onLogout={handleLogout}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default Index;
