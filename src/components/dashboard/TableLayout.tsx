
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';
import type { Table } from '@/pages/Index';

interface TableLayoutProps {
  onTableSelect: (table: Table) => void;
}

export const TableLayout = ({ onTableSelect }: TableLayoutProps) => {
  const { theme } = useTheme();
  const [tables] = useState<Table[]>([
    // Section 1 (formerly Left Zone)
    { id: '1', number: '1', status: 'Available', zone: 'Section 1', seats: 4 },
    { id: '2', number: '2', status: 'Ordering', zone: 'Section 1', seats: 2 },
    { id: '3', number: '3', status: 'Full', zone: 'Section 1', seats: 6 },
    { id: '4', number: '4', status: 'Available', zone: 'Section 1', seats: 4 },
    { id: '5', number: '5', status: 'Booked', zone: 'Section 1', seats: 8 },
    
    // Section 2 (formerly Middle Zone)
    { id: '6', number: '6', status: 'Available', zone: 'Section 2', seats: 4 },
    { id: '7', number: '7', status: 'Full', zone: 'Section 2', seats: 2 },
    { id: '8', number: '8', status: 'Ordering', zone: 'Section 2', seats: 4 },
    { id: '9', number: '9', status: 'Available', zone: 'Section 2', seats: 6 },
    { id: '10', number: '10', status: 'Available', zone: 'Section 2', seats: 4 },
    { id: '11', number: '11', status: 'Booked', zone: 'Section 2', seats: 8 },
    
    // Section 3 (formerly Right Zone)
    { id: '12', number: '12', status: 'Available', zone: 'Section 3', seats: 2 },
    { id: '13', number: '13', status: 'Full', zone: 'Section 3', seats: 4 },
    { id: '14', number: '14', status: 'Ordering', zone: 'Section 3', seats: 6 },
    { id: '15', number: '15', status: 'Available', zone: 'Section 3', seats: 4 },
  ]);

  // Mock takeaway orders
  const [takeawayOrders] = useState([
    { id: 'T001', status: 'Preparing', customerName: 'John Doe', time: '5 min' },
    { id: 'T002', status: 'Ready', customerName: 'Jane Smith', time: '2 min' },
    { id: 'T003', status: 'Starting', customerName: 'Bob Wilson', time: '8 min' },
    { id: 'T004', status: 'Preparing', customerName: 'Alice Brown', time: '3 min' },
  ]);

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'Available': return 'bg-green-500 hover:bg-green-600';
      case 'Ordering': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Full': return 'bg-red-500 hover:bg-red-600';
      case 'Booked': return 'bg-purple-500 hover:bg-purple-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusIcon = (status: Table['status']) => {
    switch (status) {
      case 'Available': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Ordering': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Full': return <Users className="h-4 w-4 text-red-600" />;
      case 'Booked': return <XCircle className="h-4 w-4 text-purple-600" />;
      default: return null;
    }
  };

  const getTakeawayStatusColor = (status: string) => {
    switch (status) {
      case 'Starting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Preparing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Ready': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Theme-specific table rendering
  const renderTableByTheme = (table: Table, onClick: () => void) => {
    if (theme === 'sunset') {
      return (
        <div
          className="relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
          onClick={onClick}
        >
          {/* Realistic dining table for sunset theme */}
          <div className={`
            w-32 h-20 rounded-2xl shadow-lg border-4 border-amber-200
            ${getStatusColor(table.status)}
            flex items-center justify-center relative overflow-hidden
          `}>
            {/* Wood grain texture */}
            <div className="absolute inset-0 opacity-30">
              <div className="w-full h-full bg-gradient-to-br from-amber-100/50 to-orange-200/50 rounded-2xl" />
            </div>
            
            {/* Table number */}
            <div className="relative z-10 text-white font-bold text-xl bg-black/20 rounded-full w-8 h-8 flex items-center justify-center">
              {table.number}
            </div>
            
            {/* Chair placement around table */}
            {Array.from({ length: table.seats }).map((_, i) => {
              const angle = (i * 360) / table.seats;
              const distance = 50;
              const x = Math.cos((angle * Math.PI) / 180) * distance;
              const y = Math.sin((angle * Math.PI) / 180) * distance;
              
              return (
                <div
                  key={i}
                  className="absolute w-8 h-8 bg-amber-600 border-2 border-amber-800 rounded-lg shadow-md"
                  style={{
                    left: `calc(50% + ${x}px - 16px)`,
                    top: `calc(50% + ${y}px - 16px)`,
                    transform: `rotate(${angle + 90}deg)`,
                  }}
                />
              );
            })}
          </div>
          
          {/* Table info */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-card rounded-md shadow-lg p-2 min-w-20 border">
            <div className="text-xs text-center">
              <div className="font-semibold">Table {table.number}</div>
              <div className="text-muted-foreground">{table.seats} seats</div>
              <Badge variant="outline" className="text-xs mt-1">
                {table.status}
              </Badge>
            </div>
          </div>
        </div>
      );
    }

    if (theme === 'ocean') {
      return (
        <div
          className="relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
          onClick={onClick}
        >
          {/* Ocean-themed round table */}
          <div className={`
            w-28 h-28 rounded-full shadow-lg border-4 border-blue-200
            ${getStatusColor(table.status)}
            flex items-center justify-center relative overflow-hidden
          `}>
            {/* Wave pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-gradient-to-br from-blue-100/50 to-cyan-200/50 rounded-full" />
              <div className="absolute inset-2 border-2 border-blue-300/30 rounded-full" />
            </div>
            
            {/* Table number */}
            <div className="relative z-10 text-white font-bold text-lg bg-blue-900/40 rounded-full w-10 h-10 flex items-center justify-center">
              {table.number}
            </div>
            
            {/* Chairs around circular table */}
            {Array.from({ length: table.seats }).map((_, i) => {
              const angle = (i * 360) / table.seats;
              const distance = 42;
              const x = Math.cos((angle * Math.PI) / 180) * distance;
              const y = Math.sin((angle * Math.PI) / 180) * distance;
              
              return (
                <div
                  key={i}
                  className="absolute w-6 h-8 bg-blue-600 border-2 border-blue-800 rounded-t-lg shadow-md"
                  style={{
                    left: `calc(50% + ${x}px - 12px)`,
                    top: `calc(50% + ${y}px - 16px)`,
                    transform: `rotate(${angle}deg)`,
                  }}
                />
              );
            })}
          </div>
          
          {/* Table info */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-card rounded-md shadow-lg p-2 min-w-20 border">
            <div className="text-xs text-center">
              <div className="font-semibold">Table {table.number}</div>
              <div className="text-muted-foreground">{table.seats} seats</div>
              <Badge variant="outline" className="text-xs mt-1">
                {table.status}
              </Badge>
            </div>
          </div>
        </div>
      );
    }

    if (theme === 'forest') {
      return (
        <div
          className="relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
          onClick={onClick}
        >
          {/* Forest-themed hexagonal table */}
          <div className={`
            w-24 h-24 shadow-lg border-4 border-green-200
            ${getStatusColor(table.status)}
            flex items-center justify-center relative overflow-hidden
          `}
          style={{
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
          }}>
            {/* Wood texture */}
            <div className="absolute inset-0 opacity-25">
              <div className="w-full h-full bg-gradient-to-br from-green-100/50 to-emerald-200/50" />
            </div>
            
            {/* Table number */}
            <div className="relative z-10 text-white font-bold text-lg bg-green-900/40 rounded-full w-8 h-8 flex items-center justify-center">
              {table.number}
            </div>
            
            {/* Chairs around hexagonal table */}
            {Array.from({ length: table.seats }).map((_, i) => {
              const angle = (i * 360) / table.seats;
              const distance = 40;
              const x = Math.cos((angle * Math.PI) / 180) * distance;
              const y = Math.sin((angle * Math.PI) / 180) * distance;
              
              return (
                <div
                  key={i}
                  className="absolute w-6 h-6 bg-green-700 border-2 border-green-900 rounded shadow-md"
                  style={{
                    left: `calc(50% + ${x}px - 12px)`,
                    top: `calc(50% + ${y}px - 12px)`,
                    transform: `rotate(${angle}deg)`,
                  }}
                />
              );
            })}
          </div>
          
          {/* Table info */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-card rounded-md shadow-lg p-2 min-w-20 border">
            <div className="text-xs text-center">
              <div className="font-semibold">Table {table.number}</div>
              <div className="text-muted-foreground">{table.seats} seats</div>
              <Badge variant="outline" className="text-xs mt-1">
                {table.status}
              </Badge>
            </div>
          </div>
        </div>
      );
    }

    // Default theme - original design
    const isRectangular = table.seats >= 6;
    return (
      <div
        className="relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
        onClick={onClick}
      >
        <div className={`
          ${isRectangular ? 'w-24 h-16' : 'w-20 h-20'} 
          ${getStatusColor(table.status)}
          rounded-lg shadow-lg border-4 border-white
          flex items-center justify-center
          relative overflow-hidden
        `}>
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-white/30 to-transparent rounded-lg" />
          </div>
          
          <div className="relative z-10 text-white font-bold text-lg">
            {table.number}
          </div>
          
          <div className="absolute top-1 right-1">
            {getStatusIcon(table.status)}
          </div>
        </div>
        
        <div className="absolute inset-0">
          {Array.from({ length: table.seats }).map((_, i) => {
            const angle = (i * 360) / table.seats;
            const distance = isRectangular ? 45 : 42;
            const x = Math.cos((angle * Math.PI) / 180) * distance;
            const y = Math.sin((angle * Math.PI) / 180) * distance;
            
            return (
              <div
                key={i}
                className="absolute w-6 h-6 bg-accent border-2 border-muted rounded-sm shadow-md"
                style={{
                  left: `calc(50% + ${x}px - 12px)`,
                  top: `calc(50% + ${y}px - 12px)`,
                  transform: `rotate(${angle + 90}deg)`,
                }}
              />
            );
          })}
        </div>
        
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-card rounded-md shadow-lg p-2 min-w-20 border">
          <div className="text-xs text-center">
            <div className="font-semibold">Table {table.number}</div>
            <div className="text-muted-foreground">{table.seats} seats</div>
            <Badge variant="outline" className="text-xs mt-1">
              {table.status}
            </Badge>
          </div>
        </div>
      </div>
    );
  };

  const tablesByZone = {
    'Section 1': tables.filter(t => t.zone === 'Section 1'),
    'Section 2': tables.filter(t => t.zone === 'Section 2'),
    'Section 3': tables.filter(t => t.zone === 'Section 3'),
  };

  return (
    <div className="space-y-8">
      {/* Header with status legend */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Dining Area Layout</h2>
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 bg-card rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span className="text-sm font-medium">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500" />
            <span className="text-sm font-medium">Ordering</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span className="text-sm font-medium">Occupied</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-purple-500" />
            <span className="text-sm font-medium">Reserved</span>
          </div>
        </div>
      </div>

      {/* Dining area layout */}
      <div className="bg-muted/30 rounded-2xl p-4 md:p-8 shadow-inner">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12 min-h-96">
          {Object.entries(tablesByZone).map(([zone, zoneTables]) => (
            <div key={zone} className="relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-primary text-primary-foreground px-3 md:px-4 py-1 md:py-2 rounded-full text-sm font-semibold shadow-lg">
                  {zone}
                </div>
              </div>
              
              <div className="bg-background/60 rounded-xl p-4 md:p-6 h-full border-2 border-dashed border-muted-foreground/20">
                <div className="grid grid-cols-2 gap-4 md:gap-8 pt-4 justify-items-center">
                  {zoneTables.map((table) => (
                    <div key={table.id} className="relative pb-8">
                      {renderTableByTheme(table, () => onTableSelect(table))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Takeaway Orders Section */}
      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
        <CardHeader>
          <CardTitle className="text-center text-indigo-800">Takeaway Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {takeawayOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg p-4 shadow-md border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">{order.id}</span>
                  <Badge className={getTakeawayStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-1">{order.customerName}</div>
                <div className="text-xs text-muted-foreground">Est. {order.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
