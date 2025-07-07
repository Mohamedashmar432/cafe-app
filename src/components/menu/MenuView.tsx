
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react';
import { TopNavigation } from '@/components/dashboard/TopNavigation';
import { OrderSummary } from './OrderSummary';
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
    { id: '1', name: 'Espresso', price: 3.50, category: 'Coffee', subcategory: 'Strong', icon: '☕' },
    { id: '2', name: 'Cappuccino', price: 4.25, category: 'Coffee', subcategory: 'Normal', icon: '☕' },
    { id: '3', name: 'Latte', price: 4.75, category: 'Coffee', subcategory: 'Normal', icon: '☕' },
    { id: '4', name: 'Mocha', price: 5.25, category: 'Coffee', subcategory: 'Special', icon: '☕' },
    { id: '5', name: 'Americano', price: 3.75, category: 'Coffee', subcategory: 'Strong', icon: '☕' },
    { id: '6', name: 'Caramel Macchiato', price: 5.50, category: 'Coffee', subcategory: 'Special', icon: '☕' },
    { id: '7', name: 'Iced Coffee', price: 4.00, category: 'Cold Drinks', subcategory: 'Normal', icon: '🧊' },
    { id: '8', name: 'Frappuccino', price: 5.75, category: 'Cold Drinks', subcategory: 'Special', icon: '🧊' },
    { id: '9', name: 'Green Tea', price: 3.25, category: 'Tea', subcategory: 'Less Sugar', icon: '🍵' },
    { id: '10', name: 'Earl Grey', price: 3.50, category: 'Tea', subcategory: 'Normal', icon: '🍵' },
    { id: '11', name: 'Croissant', price: 3.00, category: 'Pastries', subcategory: 'Normal', icon: '🥐' },
    { id: '12', name: 'Muffin', price: 3.50, category: 'Pastries', subcategory: 'Normal', icon: '🧁' },
    { id: '13', name: 'Cheesecake', price: 6.00, category: 'Desserts', subcategory: 'Special', icon: '🍰' },
    { id: '14', name: 'Tiramisu', price: 6.50, category: 'Desserts', subcategory: 'Special', icon: '🍰' },
    { id: '15', name: 'Caesar Salad', price: 8.50, category: 'Food', subcategory: 'Normal', icon: '🥗' },
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

  const MenuItemCard = ({ item }: { item: MenuItem }) => (
    <Card className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <span className="text-2xl">{item.icon}</span>
            <span>{item.name}</span>
          </CardTitle>
          <Badge className={getSubcategoryColor(item.subcategory)}>
            {item.subcategory}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{item.category}</p>
            <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
          </div>
          <Button onClick={() => addToOrder(item)} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
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
        <div className="container mx-auto p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Table {table.number} - Menu</h1>
                <p className="text-muted-foreground">
                  {table.zone} Zone • {table.seats} Seats
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span className="font-semibold">{orderItems.length} items</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Menu Items - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {categories.map(category => (
                <div key={category}>
                  <h3 className="text-xl font-semibold mb-4 bg-accent rounded-lg py-2 px-4">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menuItems
                      .filter(item => item.category === category)
                      .map(item => (
                        <MenuItemCard key={item.id} item={item} />
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary - Right Side */}
            <div className="lg:col-span-1">
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
