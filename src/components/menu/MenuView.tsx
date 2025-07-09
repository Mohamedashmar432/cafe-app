
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Minus, ShoppingCart, ChevronDown } from 'lucide-react';
import { TopNavigation } from '@/components/dashboard/TopNavigation';
import { OrderSummary } from './OrderSummary';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { User, Table, MenuItem, OrderItem } from '@/pages/Index';

interface MenuViewProps {
  user: User;
  table: Table;
  onBack: () => void;
  onLogout: () => void;
}

export const MenuView = ({ user, table, onBack, onLogout }: MenuViewProps) => {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const menuItems: MenuItem[] = [
    // Famous Prata Items
    { id: '1', name: 'Prata Kosong', price: 1.50, category: 'Famous Prata Items', subcategory: 'Normal', icon: '🥞' },
    { id: '2', name: 'Prata Egg', price: 2.00, category: 'Famous Prata Items', subcategory: 'Normal', icon: '🥞' },
    { id: '3', name: 'Prata Onion', price: 2.00, category: 'Famous Prata Items', subcategory: 'Normal', icon: '🥞' },
    { id: '4', name: 'Prata Egg Onion', price: 2.50, category: 'Famous Prata Items', subcategory: 'Normal', icon: '🥞' },
    { id: '5', name: 'Prata Tissue', price: 3.50, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { id: '6', name: 'Milo Prata', price: 3.00, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { id: '7', name: 'Prata Chocolate', price: 3.00, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { id: '8', name: 'Prata Cheese', price: 3.50, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { id: '9', name: 'Prata Mushroom', price: 3.00, category: 'Famous Prata Items', subcategory: 'Normal', icon: '🥞' },
    { id: '10', name: 'Prata Cheese Mushroom', price: 4.00, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { id: '11', name: 'Prata Egg Cheese', price: 3.50, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { id: '12', name: 'Coin Prata Chicken', price: 4.50, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { id: '13', name: 'Coin Prata Mutton', price: 5.00, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { id: '14', name: 'Planta Prata', price: 2.50, category: 'Famous Prata Items', subcategory: 'Normal', icon: '🥞' },
    { id: '15', name: 'Prata Hot Dog', price: 3.50, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { id: '16', name: 'Kothu Prata', price: 4.00, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { id: '17', name: 'Roti John', price: 3.50, category: 'Famous Prata Items', subcategory: 'Normal', icon: '🥞' },
    { id: '18', name: 'Roti John Chicken', price: 4.50, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { id: '19', name: 'Roti John Mutton', price: 5.00, category: 'Famous Prata Items', subcategory: 'Special', icon: '🥞' },
    { id: '20', name: 'Roti John Sardines', price: 4.00, category: 'Famous Prata Items', subcategory: 'Normal', icon: '🥞' },
    { id: '21', name: 'Roti John Tuna', price: 4.50, category: 'Famous Prata Items', subcategory: 'Normal', icon: '🥞' },

    // Goreng Items
    { id: '22', name: 'Mee Goreng Chicken', price: 5.50, category: 'Goreng Items', subcategory: 'Normal', icon: '🍜' },
    { id: '23', name: 'Mee Goreng Mutton', price: 6.00, category: 'Goreng Items', subcategory: 'Normal', icon: '🍜' },
    { id: '24', name: 'Mee Hoon Goreng', price: 5.00, category: 'Goreng Items', subcategory: 'Normal', icon: '🍜' },
    { id: '25', name: 'Mee Hoon Special', price: 6.50, category: 'Goreng Items', subcategory: 'Special', icon: '🍜' },
    { id: '26', name: 'Keow Trow Goreng', price: 5.50, category: 'Goreng Items', subcategory: 'Normal', icon: '🍜' },
    { id: '27', name: 'Maggi Goreng', price: 4.50, category: 'Goreng Items', subcategory: 'Normal', icon: '🍜' },
    { id: '28', name: 'Maggi Goreng Double', price: 6.00, category: 'Goreng Items', subcategory: 'Special', icon: '🍜' },
    { id: '29', name: 'Maggi Goreng Mutton', price: 6.00, category: 'Goreng Items', subcategory: 'Normal', icon: '🍜' },
    { id: '30', name: 'Maggi Goreng Chicken', price: 5.50, category: 'Goreng Items', subcategory: 'Normal', icon: '🍜' },
    { id: '31', name: 'Mee Kuah', price: 4.00, category: 'Goreng Items', subcategory: 'Normal', icon: '🍜' },
    { id: '32', name: 'Nasi Goreng Meeran', price: 5.50, category: 'Goreng Items', subcategory: 'Normal', icon: '🍜' },
    { id: '33', name: 'Nasi Goreng Ayam', price: 6.00, category: 'Goreng Items', subcategory: 'Normal', icon: '🍜' },
    { id: '34', name: 'Nasi Goreng Combo', price: 7.50, category: 'Goreng Items', subcategory: 'Special', icon: '🍜' },

    // Biryani
    { id: '35', name: 'Chicken Biryani', price: 8.50, category: 'Biryani', subcategory: 'Normal', icon: '🍛' },
    { id: '36', name: 'Mutton Biryani', price: 10.00, category: 'Biryani', subcategory: 'Normal', icon: '🍛' },
    { id: '37', name: 'Special Biryani', price: 12.00, category: 'Biryani', subcategory: 'Special', icon: '🍛' },

    // Thosai
    { id: '38', name: 'Normal Thosai', price: 2.00, category: 'Thosai', subcategory: 'Normal', icon: '🥘' },
    { id: '39', name: 'Roast Thosai', price: 2.50, category: 'Thosai', subcategory: 'Normal', icon: '🥘' },
    { id: '40', name: 'Egg Thosai', price: 3.00, category: 'Thosai', subcategory: 'Normal', icon: '🥘' },
    { id: '41', name: 'Chicken Thosai', price: 4.00, category: 'Thosai', subcategory: 'Special', icon: '🥘' },
    { id: '42', name: 'Mutton Thosai', price: 4.50, category: 'Thosai', subcategory: 'Special', icon: '🥘' },
    { id: '43', name: 'Onion Thosai', price: 3.00, category: 'Thosai', subcategory: 'Normal', icon: '🥘' },

    // Coffees
    { id: '44', name: 'Kopi', price: 1.50, category: 'Coffees', subcategory: 'Normal', icon: '☕' },
    { id: '45', name: 'Kopi O', price: 1.30, category: 'Coffees', subcategory: 'Normal', icon: '☕' },
    { id: '46', name: 'Kopi C', price: 1.70, category: 'Coffees', subcategory: 'Normal', icon: '☕' },
    { id: '47', name: 'Kopi Peng', price: 1.80, category: 'Coffees', subcategory: 'Normal', icon: '☕' },
    { id: '48', name: 'Kopi O Peng', price: 1.60, category: 'Coffees', subcategory: 'Normal', icon: '☕' },
    { id: '49', name: 'Kopi C Peng', price: 2.00, category: 'Coffees', subcategory: 'Normal', icon: '☕' },

    // Cold Drinks
    { id: '50', name: 'Milo', price: 2.00, category: 'Cold Drinks', subcategory: 'Normal', icon: '🧊' },
    { id: '51', name: 'Milo Peng', price: 2.50, category: 'Cold Drinks', subcategory: 'Normal', icon: '🧊' },
    { id: '52', name: 'Lime Juice', price: 2.50, category: 'Cold Drinks', subcategory: 'Normal', icon: '🧊' },
    { id: '53', name: 'Orange Juice', price: 3.00, category: 'Cold Drinks', subcategory: 'Normal', icon: '🧊' },
    { id: '54', name: 'Bandung', price: 2.50, category: 'Cold Drinks', subcategory: 'Special', icon: '🧊' },
    { id: '55', name: 'Teh Tarik Peng', price: 2.00, category: 'Cold Drinks', subcategory: 'Normal', icon: '🧊' },

    // Teas
    { id: '56', name: 'Teh', price: 1.50, category: 'Teas', subcategory: 'Normal', icon: '🍵' },
    { id: '57', name: 'Teh O', price: 1.30, category: 'Teas', subcategory: 'Normal', icon: '🍵' },
    { id: '58', name: 'Teh C', price: 1.70, category: 'Teas', subcategory: 'Normal', icon: '🍵' },
    { id: '59', name: 'Teh Tarik', price: 2.00, category: 'Teas', subcategory: 'Special', icon: '🍵' },
    { id: '60', name: 'Teh Halia', price: 2.00, category: 'Teas', subcategory: 'Special', icon: '🍵' },

    // Desserts
    { id: '61', name: 'Ice Cream', price: 3.00, category: 'Desserts', subcategory: 'Normal', icon: '🍨' },
    { id: '62', name: 'Cendol', price: 3.50, category: 'Desserts', subcategory: 'Special', icon: '🍨' },
    { id: '63', name: 'Ice Kacang', price: 4.00, category: 'Desserts', subcategory: 'Special', icon: '🍨' },
    { id: '64', name: 'Pulut Hitam', price: 3.50, category: 'Desserts', subcategory: 'Special', icon: '🍨' },
  ];

  const addToOrder = (menuItem: MenuItem) => {
    const existingItem = orderItems.find(item => item.menuItem.id === menuItem.id);
    
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.menuItem.id === menuItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const newOrderItem: OrderItem = {
        id: Math.random().toString(36).substr(2, 9),
        menuItem,
        quantity: 1,
        modifiers: [],
        gst: menuItem.price * 0.1, // 10% GST
      };
      setOrderItems([...orderItems, newOrderItem]);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setOrderItems(orderItems.filter(item => item.id !== itemId));
    } else {
      setOrderItems(orderItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const getSubcategoryColor = (subcategory: MenuItem['subcategory']) => {
    switch (subcategory) {
      case 'Special':
        return 'bg-purple-100 text-purple-800';
      case 'Strong':
        return 'bg-red-100 text-red-800';
      case 'Less Sugar':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const CategoryDropdown = ({ category, items }: { category: string; items: MenuItem[] }) => (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg sm:text-xl bg-accent rounded-lg py-2 px-4">
          {category}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {items.map(item => (
          <DropdownMenu key={item.id}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between h-auto p-3 text-left"
                size="lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <div className="font-medium text-sm sm:text-base">{item.name}</div>
                    <div className="text-xs text-muted-foreground">${item.price.toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getSubcategoryColor(item.subcategory)} text-xs`}>
                    {item.subcategory}
                  </Badge>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                onClick={() => addToOrder(item)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>Add to Order</span>
                <div className="flex items-center space-x-1">
                  <Plus className="h-3 w-3" />
                  <span className="text-xs">${item.price.toFixed(2)}</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </CardContent>
    </Card>
  );

  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation
        user={user}
        onLogout={onLogout}
        isVisible={isNavVisible}
        onToggleVisibility={() => setIsNavVisible(!isNavVisible)}
      />
      
      <main className={`transition-all duration-300 ${isNavVisible ? 'pt-16' : 'pt-4'}`}>
        <div className="container mx-auto p-2 sm:p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              <Button variant="outline" onClick={onBack} className="shrink-0">
                <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold truncate">Table {table.number}</h1>
                <p className="text-sm text-muted-foreground truncate">
                  {table.zone} Zone • {table.seats} Seats
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <ShoppingCart className="h-4 sm:h-5 w-4 sm:w-5" />
              <span className="font-semibold text-sm sm:text-base">{orderItems.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-8">
            {/* Menu Items - Left Side (Dropdown View) */}
            <div className="xl:col-span-2 space-y-4 sm:space-y-6">
              {categories.map(category => (
                <CategoryDropdown 
                  key={category} 
                  category={category} 
                  items={menuItems.filter(item => item.category === category)} 
                />
              ))}
            </div>

            {/* Order Summary - Right Side */}
            <div className="xl:col-span-1">
              <OrderSummary
                table={table}
                orderItems={orderItems}
                onUpdateQuantity={updateQuantity}
                onClearOrder={() => setOrderItems([])}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
