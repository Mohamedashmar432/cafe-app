
import { useState } from 'react';
import { TopNavigation } from './TopNavigation';
import { TableLayout } from './TableLayout';
import { ThemeSelector } from '@/components/theme/ThemeSelector';
import type { User, Table } from '@/pages/Index';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onTableSelect: (table: Table) => void;
}

export const Dashboard = ({ user, onLogout, onTableSelect }: DashboardProps) => {
  const [isNavVisible, setIsNavVisible] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation
        user={user}
        onLogout={onLogout}
        isVisible={isNavVisible}
        onToggleVisibility={() => setIsNavVisible(!isNavVisible)}
      />
      
      <main className={`transition-all duration-300 ${isNavVisible ? 'pt-16' : 'pt-4'}`}>
        <div className="container mx-auto p-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Cafe Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user.name}! Manage your cafe operations from here.
            </p>
          </div>
          
          <TableLayout onTableSelect={onTableSelect} />
          
          <div className="mt-8">
            <ThemeSelector />
          </div>
        </div>
      </main>
    </div>
  );
};
