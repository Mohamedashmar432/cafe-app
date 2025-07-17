
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { TableLayout } from './TableLayout';
import type { Table } from '@/pages/Index';

interface DiningSectionProps {
  section: 'Section 1' | 'Section 2' | 'Section 3' | 'Takeaway';
  tables: Table[];
  onTableSelect: (table: Table) => void;
  onBack: () => void;
}

export const DiningSection = ({ section, tables, onTableSelect, onBack }: DiningSectionProps) => {
  const sectionTables = tables.filter(table => 
    section === 'Takeaway' ? table.zone === 'Takeaway' : table.zone === section
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800 border-green-300';
      case 'Ordering': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Full': return 'bg-red-100 text-red-800 border-red-300';
      case 'Booked': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // For Takeaway section, show different layout
  if (section === 'Takeaway') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h2 className="text-2xl font-bold">{section} Orders</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Mock takeaway orders */}
          {[
            { id: 'T001', status: 'Preparing', customerName: 'John Doe', time: '5 min' },
            { id: 'T002', status: 'Ready', customerName: 'Jane Smith', time: '2 min' },
            { id: 'T003', status: 'Starting', customerName: 'Bob Wilson', time: '8 min' },
            { id: 'T004', status: 'Preparing', customerName: 'Alice Brown', time: '3 min' },
          ].map((order) => (
            <Card 
              key={order.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onTableSelect({ 
                id: order.id, 
                number: order.id, 
                status: 'Ordering' as any, 
                zone: 'Takeaway' as any, 
                seats: 0 
              })}
            >
              <CardContent className="p-4">
                <div className="text-lg font-bold mb-2">{order.id}</div>
                <div className="text-sm text-muted-foreground mb-2">{order.customerName}</div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
                <div className="text-sm text-muted-foreground mt-2">
                  Est. {order.time}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // For dining sections, show table layout
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-2xl font-bold">{section}</h2>
      </div>

      {/* Use the existing TableLayout component design for individual sections */}
      <div className="bg-muted/30 rounded-2xl p-4 md:p-8 shadow-inner">
        <div className="bg-background/60 rounded-xl p-4 md:p-6 h-full border-2 border-dashed border-muted-foreground/20">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 justify-items-center">
            {sectionTables.map((table) => (
              <div key={table.id} className="relative pb-8">
                <div
                  className="relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  onClick={() => onTableSelect(table)}
                >
                  {/* Table representation */}
                  <div className={`
                    ${table.seats >= 6 ? 'w-24 h-16' : 'w-20 h-20'} 
                    ${table.status === 'Available' ? 'bg-green-500 hover:bg-green-600' : 
                      table.status === 'Ordering' ? 'bg-yellow-500 hover:bg-yellow-600' :
                      table.status === 'Full' ? 'bg-red-500 hover:bg-red-600' :
                      'bg-purple-500 hover:bg-purple-600'}
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
                  </div>
                  
                  {/* Chairs around table */}
                  <div className="absolute inset-0">
                    {Array.from({ length: table.seats }).map((_, i) => {
                      const angle = (i * 360) / table.seats;
                      const distance = table.seats >= 6 ? 45 : 42;
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
