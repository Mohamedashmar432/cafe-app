
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Receipt, 
  DollarSign, 
  ArrowLeft,
  ChefHat,
  UserCog,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { TopNavigation } from '@/components/dashboard/TopNavigation';
import { EmployeeManagement } from './EmployeeManagement';
import { MenuManagement } from './MenuManagement';
import type { User } from '@/pages/Index';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  onBack: () => void;
}

interface Order {
  id: string;
  tableNumber: string;
  employeeId: string;
  items: string[];
  total: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
  timestamp: Date;
}

export const AdminDashboard = ({ user, onLogout, onBack }: AdminDashboardProps) => {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [currentView, setCurrentView] = useState<'overview' | 'employees' | 'menu'>('overview');
  
  const [orders] = useState<Order[]>([
    { 
      id: '1', 
      tableNumber: '5', 
      employeeId: '0002', 
      items: ['Prata Egg', 'Kopi'], 
      total: 3.50, 
      status: 'Completed', 
      timestamp: new Date() 
    },
    { 
      id: '2', 
      tableNumber: '3', 
      employeeId: '0003', 
      items: ['Chicken Biryani', 'Teh Tarik'], 
      total: 10.50, 
      status: 'Pending', 
      timestamp: new Date() 
    },
    { 
      id: '3', 
      tableNumber: '7', 
      employeeId: '0002', 
      items: ['Mee Goreng', 'Iced Milo'], 
      total: 6.80, 
      status: 'Completed', 
      timestamp: new Date() 
    },
    { 
      id: '4', 
      tableNumber: '2', 
      employeeId: '0003', 
      items: ['Thosai', 'Kopi O'], 
      total: 4.20, 
      status: 'Completed', 
      timestamp: new Date() 
    },
  ]);

  if (currentView === 'employees') {
    return (
      <div className="min-h-screen bg-background">
        <TopNavigation
          user={user}
          onLogout={onLogout}
          isVisible={isNavVisible}
          onToggleVisibility={() => setIsNavVisible(!isNavVisible)}
        />
        <main className={`transition-all duration-300 ${isNavVisible ? 'pt-20' : 'pt-8'}`}>
          <div className="container mx-auto p-4 md:p-6">
            <EmployeeManagement onBack={() => setCurrentView('overview')} />
          </div>
        </main>
      </div>
    );
  }

  if (currentView === 'menu') {
    return (
      <div className="min-h-screen bg-background">
        <TopNavigation
          user={user}
          onLogout={onLogout}
          isVisible={isNavVisible}
          onToggleVisibility={() => setIsNavVisible(!isNavVisible)}
        />
        <main className={`transition-all duration-300 ${isNavVisible ? 'pt-20' : 'pt-8'}`}>
          <div className="container mx-auto p-4 md:p-6">
            <MenuManagement onBack={() => setCurrentView('overview')} />
          </div>
        </main>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status === 'Pending').length;
  const completedOrders = orders.filter(order => order.status === 'Completed').length;
  const cancelledOrders = orders.filter(order => order.status === 'Cancelled').length;

  // Daily sales data for graphical overview
  const dailySales = [
    { time: '9 AM', sales: 120 },
    { time: '10 AM', sales: 180 },
    { time: '11 AM', sales: 240 },
    { time: '12 PM', sales: 380 },
    { time: '1 PM', sales: 420 },
    { time: '2 PM', sales: 350 },
    { time: '3 PM', sales: 280 },
    { time: '4 PM', sales: 220 },
    { time: '5 PM', sales: 190 },
  ];

  const maxSales = Math.max(...dailySales.map(d => d.sales));

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation
        user={user}
        onLogout={onLogout}
        isVisible={isNavVisible}
        onToggleVisibility={() => setIsNavVisible(!isNavVisible)}
      />
      
      <main className={`transition-all duration-300 ${isNavVisible ? 'pt-20' : 'pt-8'}`}>
        <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={onBack} className="border-blue-300 text-blue-600 hover:bg-blue-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-600">Manage your cafe operations</p>
              </div>
            </div>
          </div>

          {/* Management Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-20 flex items-center justify-center space-x-4 hover:bg-blue-50"
              onClick={() => setCurrentView('employees')}
            >
              <UserCog className="h-8 w-8 text-blue-600" />
              <div className="text-left">
                <div className="font-semibold">Employee Management</div>
                <div className="text-sm text-muted-foreground">Add, edit, and manage staff</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex items-center justify-center space-x-4 hover:bg-green-50"
              onClick={() => setCurrentView('menu')}
            >
              <ChefHat className="h-8 w-8 text-green-600" />
              <div className="text-left">
                <div className="font-semibold">Menu Management</div>
                <div className="text-sm text-muted-foreground">Add, edit, and manage menu items</div>
              </div>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Receipt className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-800">{orders.length}</div>
                <div className="text-sm text-blue-600 font-medium">Total Orders</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-800">{completedOrders}</div>
                <div className="text-sm text-green-600 font-medium">Completed Orders</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-800">${totalRevenue.toFixed(2)}</div>
                <div className="text-sm text-purple-600 font-medium">Total Revenue</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Receipt className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-orange-800">{pendingOrders}</div>
                <div className="text-sm text-orange-600 font-medium">Pending Orders</div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Daily Sales Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Hourly Sales ($)</span>
                  <span>Peak: ${maxSales}</span>
                </div>
                <div className="grid grid-cols-9 gap-2 h-40">
                  {dailySales.map((data, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div className="flex-1 flex items-end">
                        <div
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                          style={{ height: `${(data.sales / maxSales) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-center">
                        <div className="font-semibold">${data.sales}</div>
                        <div className="text-muted-foreground">{data.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border rounded-lg p-4 bg-gradient-to-r from-white to-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-800">Table {order.tableNumber}</h4>
                        <p className="text-sm text-blue-600 font-medium">
                          Employee: {order.employeeId}
                        </p>
                      </div>
                      <Badge 
                        variant={order.status === 'Completed' ? 'default' : 'secondary'}
                        className={order.status === 'Completed' 
                          ? 'bg-green-100 text-green-800 border-green-300' 
                          : order.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                          : 'bg-red-100 text-red-800 border-red-300'}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-700">Items: {order.items.join(', ')}</p>
                      <p className="font-bold mt-1 text-lg text-green-700">Total: ${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
