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
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-800">{employees.length}</div>
                <div className="text-sm text-green-600 font-medium">Employees</div>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders Section */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                <CardTitle className="text-gray-800">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                          : 'bg-yellow-100 text-yellow-800 border-yellow-300'}
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
              </CardContent>
            </Card>

            {/* Add Employee Section */}
            <Card className="border-2 border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="flex items-center space-x-2 text-blue-800">
                  <UserPlus className="h-5 w-5" />
                  <span>Add New Employee</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium">Name</Label>
                  <Input
                    id="name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                    placeholder="Employee name"
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employeeId" className="text-gray-700 font-medium">Employee ID</Label>
                  <Input
                    id="employeeId"
                    value={newEmployee.employeeId}
                    onChange={(e) => setNewEmployee({...newEmployee, employeeId: e.target.value})}
                    placeholder="0004"
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={newEmployee.password}
                      onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                      placeholder="Enter password"
                      className="border-gray-300 focus:border-blue-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-blue-50"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-gray-700 font-medium">Role</Label>
                  <select
                    id="role"
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value as 'Admin' | 'Waiter' | 'Cashier'})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Waiter">Waiter</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <Button onClick={handleAddEmployee} className="w-full bg-green-600 hover:bg-green-700 font-semibold">
                  Add Employee
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Employees List */}
          <Card className="border-2 border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
              <CardTitle className="text-gray-800">Employee Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      <th className="text-left p-3 font-semibold text-gray-700">Name</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Employee ID</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Role</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee, index) => (
                      <tr key={employee.id} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
                        <td className="p-3 font-medium text-gray-800">{employee.name}</td>
                        <td className="p-3 text-blue-600 font-semibold">{employee.employeeId}</td>
                        <td className="p-3">
                          <Badge 
                            variant="outline" 
                            className={employee.role === 'Admin' ? 'bg-purple-100 text-purple-800 border-purple-300' : 
                                      employee.role === 'Waiter' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                      'bg-green-100 text-green-800 border-green-300'}
                          >
                            {employee.role}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge 
                            variant={employee.status === 'Active' ? 'default' : 'secondary'}
                            className={employee.status === 'Active' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-800 border-gray-300'}
                          >
                            {employee.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          {employee.employeeId !== '0001' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
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
