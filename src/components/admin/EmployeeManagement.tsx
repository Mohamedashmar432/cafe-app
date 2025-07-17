
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Trash2, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  role: 'Admin' | 'Waiter' | 'Cashier';
  status: 'Active' | 'Inactive';
}

interface EmployeeManagementProps {
  onBack: () => void;
}

export const EmployeeManagement = ({ onBack }: EmployeeManagementProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', name: 'Admin User', employeeId: '0001', role: 'Admin', status: 'Active' },
    { id: '2', name: 'John Doe', employeeId: '0002', role: 'Waiter', status: 'Active' },
    { id: '3', name: 'Jane Smith', employeeId: '0003', role: 'Cashier', status: 'Active' },
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

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin
        </Button>
        <h2 className="text-2xl font-bold">Employee Management</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Employee Form */}
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
                className="w-full p-2 border border-input rounded-md"
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

        {/* Employee List */}
        <Card>
          <CardHeader>
            <CardTitle>Employee List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employees.map((employee) => (
                <div key={employee.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{employee.name}</h4>
                    <p className="text-sm text-muted-foreground">ID: {employee.employeeId}</p>
                    <div className="flex space-x-2 mt-1">
                      <Badge variant="outline">{employee.role}</Badge>
                      <Badge variant={employee.status === 'Active' ? 'default' : 'secondary'}>
                        {employee.status}
                      </Badge>
                    </div>
                  </div>
                  {employee.employeeId !== '0001' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteEmployee(employee.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
