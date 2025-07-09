
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Receipt, 
  DollarSign, 
  UserPlus, 
  Trash2, 
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import { TopNavigation } from '@/components/dashboard/TopNavigation';
import type { User } from '@/pages/Index';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  onBack: () => void;
}

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  role: 'Admin' | 'Waiter' | 'Cashier';
  status: 'Active' | 'Inactive';
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
  const [showPassword, setShowPassword] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', name: 'Admin User', employeeId: '0001', role: 'Admin', status: 'Active' },
    { id: '2', name: 'John Doe', employeeId: '0002', role: 'Waiter', status: 'Active' },
    { id: '3', name: 'Jane Smith', employeeId: '0003', role: 'Cashier', status: 'Active' },
  ]);
  
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
  ]);

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    employeeId: '',
    password: '',
    role: 'Waiter' as 'Admin' | 'Waiter' | 'Cashier'
  });

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.employeeId && newEmployee.password) {
      const employee: Employee = {
        id: Math.random().toString(36).substr(2, 9),
        name: newEmployee.name,
        employeeId: newEmployee.employeeId,
        role: newEmployee.role,
        status: 'Active'
      };
      setEmployees([...employees, employee]);
      setNewEmployee({ name: '', employeeId: '', password: '', role: 'Waiter' });
    }
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status === 'Pending').length;
  const completedOrders = orders.filter(order => order.status === 'Completed').length;

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
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage your cafe operations</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Receipt className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-800">{orders.length}</div>
                <div className="text-sm text-blue-600">Total Orders</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-800">{employees.length}</div>
                <div className="text-sm text-green-600">Employees</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-800">${totalRevenue.toFixed(2)}</div>
                <div className="text-sm text-purple-600">Total Revenue</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Receipt className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-800">{pendingOrders}</div>
                <div className="text-sm text-orange-600">Pending Orders</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders Section */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">Table {order.tableNumber}</h4>
                        <p className="text-sm text-muted-foreground">
                          Employee: {order.employeeId}
                        </p>
                      </div>
                      <Badge 
                        variant={order.status === 'Completed' ? 'default' : 'secondary'}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <p>Items: {order.items.join(', ')}</p>
                      <p className="font-semibold mt-1">Total: ${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Add Employee Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5" />
                  <span>Add New Employee</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                    placeholder="Employee name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    value={newEmployee.employeeId}
                    onChange={(e) => setNewEmployee({...newEmployee, employeeId: e.target.value})}
                    placeholder="0004"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={newEmployee.password}
                      onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                      placeholder="Enter password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value as 'Admin' | 'Waiter' | 'Cashier'})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Waiter">Waiter</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <Button onClick={handleAddEmployee} className="w-full">
                  Add Employee
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Employees List */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Employee ID</th>
                      <th className="text-left p-2">Role</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(employee => (
                      <tr key={employee.id} className="border-b">
                        <td className="p-2">{employee.name}</td>
                        <td className="p-2">{employee.employeeId}</td>
                        <td className="p-2">
                          <Badge variant="outline">{employee.role}</Badge>
                        </td>
                        <td className="p-2">
                          <Badge 
                            variant={employee.status === 'Active' ? 'default' : 'secondary'}
                          >
                            {employee.status}
                          </Badge>
                        </td>
                        <td className="p-2">
                          {employee.employeeId !== '0001' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteEmployee(employee.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
