
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Table } from '@/pages/Index';

interface TableLayoutProps {
  onTableSelect: (table: Table) => void;
}

export const TableLayout = ({ onTableSelect }: TableLayoutProps) => {
  const [tables] = useState<Table[]>([
    // Left Zone
    { id: '1', number: '1', status: 'Available', zone: 'Left', seats: 4 },
    { id: '2', number: '2', status: 'Ordering', zone: 'Left', seats: 2 },
    { id: '3', number: '3', status: 'Full', zone: 'Left', seats: 6 },
    { id: '4', number: '4', status: 'Available', zone: 'Left', seats: 4 },
    { id: '5', number: '5', status: 'Booked', zone: 'Left', seats: 8 },
    
    // Middle Zone
    { id: '6', number: '6', status: 'Available', zone: 'Middle', seats: 4 },
    { id: '7', number: '7', status: 'Full', zone: 'Middle', seats: 2 },
    { id: '8', number: '8', status: 'Ordering', zone: 'Middle', seats: 4 },
    { id: '9', number: '9', status: 'Available', zone: 'Middle', seats: 6 },
    { id: '10', number: '10', status: 'Available', zone: 'Middle', seats: 4 },
    
    // Right Zone
    { id: '11', number: '11', status: 'Booked', zone: 'Right', seats: 2 },
    { id: '12', number: '12', status: 'Available', zone: 'Right', seats: 4 },
    { id: '13', number: '13', status: 'Full', zone: 'Right', seats: 8 },
    { id: '14', number: '14', status: 'Ordering', zone: 'Right', seats: 4 },
    { id: '15', number: '15', status: 'Available', zone: 'Right', seats: 6 },
  ]);

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500';
      case 'Ordering':
        return 'bg-yellow-500';
      case 'Full':
        return 'bg-red-500';
      case 'Booked':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: Table['status']) => {
    switch (status) {
      case 'Available':
        return 'default';
      case 'Ordering':
        return 'secondary';
      case 'Full':
        return 'destructive';
      case 'Booked':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const tablesByZone = {
    Left: tables.filter(t => t.zone === 'Left'),
    Middle: tables.filter(t => t.zone === 'Middle'),
    Right: tables.filter(t => t.zone === 'Right'),
  };

  const TableCard = ({ table }: { table: Table }) => (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
        table.status === 'Ordering' ? 'animate-pulse' : ''
      }`}
      onClick={() => onTableSelect(table)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Table {table.number}</CardTitle>
          <div className={`w-4 h-4 rounded-full ${getStatusColor(table.status)}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge variant={getStatusBadgeVariant(table.status)}>
              {table.status}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Seats:</span>
            <span className="text-sm">{table.seats}</span>
          </div>
          
          {/* Table SVG Icon */}
          <div className="flex justify-center mt-4">
            <svg
              width="60"
              height="60"
              viewBox="0 0 100 100"
              className="text-muted-foreground"
            >
              {/* Table */}
              <rect
                x="20"
                y="35"
                width="60"
                height="30"
                rx="5"
                fill="currentColor"
                opacity="0.3"
              />
              
              {/* Chairs */}
              {Array.from({ length: Math.min(table.seats, 8) }).map((_, i) => {
                const angle = (i * 360) / Math.min(table.seats, 8);
                const x = 50 + Math.cos((angle * Math.PI) / 180) * 35;
                const y = 50 + Math.sin((angle * Math.PI) / 180) * 35;
                
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="6"
                    fill="currentColor"
                    opacity="0.6"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Dining Area Layout</h2>
        <div className="flex justify-center space-x-8 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500" />
            <span className="text-sm">Ordering</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span className="text-sm">Full/Booked</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {Object.entries(tablesByZone).map(([zone, zoneTables]) => (
          <div key={zone} className="space-y-4">
            <h3 className="text-xl font-semibold text-center bg-accent rounded-lg py-2">
              {zone} Zone
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {zoneTables.map((table) => (
                <TableCard key={table.id} table={table} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
