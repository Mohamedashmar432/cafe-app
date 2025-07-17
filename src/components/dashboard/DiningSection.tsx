
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-2xl font-bold">{section}</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {sectionTables.map((table) => (
          <Card 
            key={table.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onTableSelect(table)}
          >
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold mb-2">Table {table.number}</div>
              <Badge className={getStatusColor(table.status)}>
                {table.status}
              </Badge>
              <div className="text-sm text-muted-foreground mt-2">
                {table.seats} seats
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
