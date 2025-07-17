
import { useState, useEffect } from 'react';
import { TopNavigation } from './TopNavigation';
import { DiningSection } from './DiningSection';
import { ThemeSelector } from '@/components/theme/ThemeSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, CheckCircle, XCircle, Utensils, Car } from 'lucide-react';
import type { User, Table } from '@/pages/Index';
import { api } from '@/lib/api';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onTableSelect: (table: Table) => void;
}

export const Dashboard = ({ user, onLogout, onTableSelect }: DashboardProps) => {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [currentSection, setCurrentSection] = useState<'overview' | 'Section 1' | 'Section 2' | 'Section 3' | 'Takeaway'>('overview');
  const [tables, setTables] = useState<Table[]>([]);
  const [stats, setStats] = useState({
    totalTables: 0,
    available: 0,
    occupied: 0,
    ordering: 0,
    reserved: 0,
  });

  useEffect(() => {
    const loadTables = async () => {
      try {
        const response = await api.getTables();
        const tableData = response.tables.map((table: any) => ({
          id: table.id.toString(),
          number: table.number,
          zone: table.zone,
          seats: table.seats,
          status: table.status,
        }));
        setTables(tableData);
        
        // Calculate stats
        const totalTables = tableData.length;
        const available = tableData.filter(t => t.status === 'Available').length;
        const occupied = tableData.filter(t => t.status === 'Full').length;
        const ordering = tableData.filter(t => t.status === 'Ordering').length;
        const reserved = tableData.filter(t => t.status === 'Booked').length;
        
        setStats({ totalTables, available, occupied, ordering, reserved });
      } catch (error) {
        console.error('Failed to load tables:', error);
      }
    };
    
    loadTables();
  }, []);

  if (currentSection !== 'overview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
        <TopNavigation
          user={user}
          onLogout={onLogout}
          isVisible={isNavVisible}
          onToggleVisibility={() => setIsNavVisible(!isNavVisible)}
        />
        
        <main className={`transition-all duration-300 ${isNavVisible ? 'pt-20' : 'pt-8'}`}>
          <div className="container mx-auto p-4 md:p-6">
            <DiningSection
              section={currentSection}
              tables={tables}
              onTableSelect={onTableSelect}
              onBack={() => setCurrentSection('overview')}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      <TopNavigation
        user={user}
        onLogout={onLogout}
        isVisible={isNavVisible}
        onToggleVisibility={() => setIsNavVisible(!isNavVisible)}
      />
      
      <main className={`transition-all duration-300 ${isNavVisible ? 'pt-20' : 'pt-8'}`}>
        <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
          {/* Welcome Header */}
          <div className="text-center space-y-4">
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Cafe Management Dashboard
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Welcome back, <span className="font-semibold text-foreground">{user.name}</span>! 
              Ready to serve today's customers.
            </p>
          </div>

          {/* Theme Selector - Compact */}
          <div className="flex justify-center">
            <Card className="w-fit">
              <CardContent className="p-4">
                <ThemeSelector />
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-3 md:p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 md:h-8 w-6 md:w-8 text-blue-600" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-blue-800">{stats.totalTables}</div>
                <div className="text-xs md:text-sm text-blue-600">Total Tables</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-3 md:p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-6 md:h-8 w-6 md:w-8 text-green-600" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-green-800">{stats.available}</div>
                <div className="text-xs md:text-sm text-green-600">Available</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-3 md:p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <XCircle className="h-6 md:h-8 w-6 md:w-8 text-red-600" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-red-800">{stats.occupied}</div>
                <div className="text-xs md:text-sm text-red-600">Occupied</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="p-3 md:p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-6 md:h-8 w-6 md:w-8 text-yellow-600" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-yellow-800">{stats.ordering}</div>
                <div className="text-xs md:text-sm text-yellow-600">Ordering</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 col-span-2 sm:col-span-1">
              <CardContent className="p-3 md:p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 md:h-8 w-6 md:w-8 text-purple-600" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-purple-800">{stats.reserved}</div>
                <div className="text-xs md:text-sm text-purple-600">Reserved</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Dining Sections */}
          <Card className="bg-card/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-xl">Dining Areas</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50"
                  onClick={() => setCurrentSection('Section 1')}
                >
                  <Utensils className="h-8 w-8 text-blue-600" />
                  <span className="font-semibold">Section 1</span>
                  <span className="text-sm text-muted-foreground">Full Page View</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-green-50"
                  onClick={() => setCurrentSection('Section 2')}
                >
                  <Utensils className="h-8 w-8 text-green-600" />
                  <span className="font-semibold">Section 2</span>
                  <span className="text-sm text-muted-foreground">Full Page View</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50"
                  onClick={() => setCurrentSection('Section 3')}
                >
                  <Utensils className="h-8 w-8 text-purple-600" />
                  <span className="font-semibold">Section 3</span>
                  <span className="text-sm text-muted-foreground">Full Page View</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-orange-50"
                  onClick={() => setCurrentSection('Takeaway')}
                >
                  <Car className="h-8 w-8 text-orange-600" />
                  <span className="font-semibold">Takeaway</span>
                  <span className="text-sm text-muted-foreground">Full Page View</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
