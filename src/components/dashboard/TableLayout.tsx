import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { Table } from '@/pages/Index';

interface TableLayoutProps {
  onTableSelect: (table: Table) => void;
}

export const TableLayout = ({ onTableSelect }: TableLayoutProps) => {
  const [tables] = useState<Table[]>([
    // Left Zone (Window side)
    { id: '1', number: '1', status: 'Available', zone: 'Left', seats: 4 },
    { id: '2', number: '2', status: 'Ordering', zone: 'Left', seats: 2 },
    { id: '3', number: '3', status: 'Full', zone: 'Left', seats: 6 },
    { id: '4', number: '4', status: 'Available', zone: 'Left', seats: 4 },
    { id: '5', number: '5', status: 'Booked', zone: 'Left', seats: 8 },
    
    // Middle Zone (Main dining)
    { id: '6', number: '6', status: 'Available', zone: 'Middle', seats: 4 },
    { id: '7', number: '7', status: 'Full', zone: 'Middle', seats: 2 },
    { id: '8', number: '8', status: 'Ordering', zone: 'Middle', seats: 4 },
    { id: '9', number: '9', status: 'Available', zone: 'Middle', seats: 6 },
    { id: '10', number: '10', status: 'Available', zone: 'Middle', seats: 4 },
    { id: '11', number: '11', status: 'Booked', zone: 'Middle', seats: 8 },
    
    // Right Zone (Corner/Private)
    { id: '12', number: '12', status: 'Available', zone: 'Right', seats: 2 },
    { id: '13', number: '13', status: 'Full', zone: 'Right', seats: 4 },
    { id: '14', number: '14', status: 'Ordering', zone: 'Right', seats: 6 },
    { id: '15', number: '15', status: 'Available', zone: 'Right', seats: 4 },
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

  const TableShape = ({ table, onClick }: { table: Table; onClick: () => void }) => {
    const isRectangular = table.seats >= 6;
    
    return (
      <div
        className={`relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl`}
        onClick={onClick}
      >
        {/* Table Surface */}
        <div className={`
          ${isRectangular ? 'w-24 h-16' : 'w-20 h-20'} 
          ${getStatusColor(table.status)}
          rounded-lg shadow-lg border-4 border-white
          flex items-center justify-center
          relative overflow-hidden
        `}>
          {/* Table texture/pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-white/30 to-transparent rounded-lg" />
          </div>
          
          {/* Table number */}
          <div className="relative z-10 text-white font-bold text-lg">
            {table.number}
          </div>
          
          {/* Status indicator */}
          <div className="absolute top-1 right-1">
            {getStatusIcon(table.status)}
          </div>
        </div>
        
        {/* Chairs around the table */}
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
        
        {/* Table info card */}
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
    Left: tables.filter(t => t.zone === 'Left'),
    Middle: tables.filter(t => t.zone === 'Middle'),
    Right: tables.filter(t => t.zone === 'Right'),
  };

  return (
    <div className="space-y-8">
      {/* Header with status legend */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">Dining Area Layout</h2>
        <div className="flex justify-center items-center space-x-6 bg-card rounded-lg p-4 shadow-sm">
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
      <div className="bg-muted/30 rounded-2xl p-8 shadow-inner">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 min-h-96">
          {Object.entries(tablesByZone).map(([zone, zoneTables]) => (
            <div key={zone} className="relative">
              {/* Zone header */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  {zone} Zone
                </div>
              </div>
              
              {/* Zone background */}
              <div className="bg-background/60 rounded-xl p-6 h-full border-2 border-dashed border-muted-foreground/20">
                <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-8 pt-4 justify-items-center">
                  {zoneTables.map((table) => (
                    <div key={table.id} className="relative pb-8">
                      <TableShape
                        table={table}
                        onClick={() => onTableSelect(table)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Floor plan elements */}
      <div className="flex justify-center space-x-8 text-muted-foreground text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-300 rounded-full" />
          <span>Entrance</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-300 rounded-full" />
          <span>Kitchen</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-300 rounded-full" />
          <span>Restroom</span>
        </div>
      </div>
    </div>
  );
};
