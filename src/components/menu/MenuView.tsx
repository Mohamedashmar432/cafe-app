import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, ShoppingCart, ChevronDown } from 'lucide-react';
import { TopNavigation } from '@/components/dashboard/TopNavigation';
import { OrderSummary } from './OrderSummary';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { User, Table, MenuItem, OrderItem } from '@/pages/Index';
import { api } from '@/lib/api';

interface MenuViewProps {
  user: User;
  table: Table;
  onBack: () => void;
  onLogout: () => void;
}

export const MenuView = ({ user, table, onBack, onLogout }: MenuViewProps) => {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [menuCategories, setMenuCategories] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);
        const response = await api.getMenuItems();
        setMenuCategories(response.menu);
      } catch (error) {
        console.error('Failed to load menu:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMenu();
  }, []);

  const addToOrder = (item: any, category: string) => {
    const menuItem: MenuItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      category: category,
      subcategory: item.subcategory as 'Special' | 'Strong' | 'Less Sugar' | 'Normal',
      icon: item.icon,
    };

    const existingItem = orderItems.find(orderItem => orderItem.menuItem.id === menuItem.id);
    
    if (existingItem) {
      setOrderItems(orderItems.map(orderItem =>
        orderItem.menuItem.id === menuItem.id
          ? { ...orderItem, quantity: orderItem.quantity + 1 }
          : orderItem
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

  const getSubcategoryColor = (subcategory: string) => {
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

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

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
            <div className="flex items-center space-x-2 shrink-0 bg-blue-50 px-3 py-2 rounded-lg border">
              <ShoppingCart className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
              <span className="font-semibold text-sm sm:text-base text-blue-800">{orderItems.length}</span>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
            {/* Menu Items - Left Side (3/5 width) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Menu Categories</h2>
                <p className="text-sm text-gray-600">Select items to add to your order</p>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading menu...</p>
                </div>
              ) : Object.entries(menuCategories).map(([category, items]) => (
                <Card key={category} className="overflow-hidden border-l-4 border-l-blue-500">
                  <Collapsible 
                    open={openCategories.includes(category)}
                    onOpenChange={() => toggleCategory(category)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="pb-2 cursor-pointer hover:bg-accent/50 transition-colors bg-gradient-to-r from-blue-50 to-transparent">
                        <CardTitle className="text-base sm:text-lg flex items-center justify-between">
                          <span className="bg-blue-600 text-white rounded-lg py-2 px-4 font-medium">{category}</span>
                          <ChevronDown className={`h-5 w-5 transition-transform text-blue-600 ${openCategories.includes(category) ? 'rotate-180' : ''}`} />
                        </CardTitle>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="p-4 space-y-2">
                        {items.map(item => (
                          <div 
                            key={item.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/30 transition-colors hover:border-blue-300"
                          >
                            <div className="flex items-center space-x-3 flex-1">
                              <span className="text-lg">{item.icon}</span>
                              <div className="flex-1">
                                <div className="font-medium text-sm sm:text-base text-gray-800">{item.name}</div>
                                <div className="text-lg font-bold text-green-600">${item.price.toFixed(2)}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={`${getSubcategoryColor(item.subcategory)} text-xs border-0`}>
                                {item.subcategory}
                              </Badge>
                              <Button
                                size="sm"
                                onClick={() => addToOrder(item, category)}
                                className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>

            {/* Order Summary - Right Side (2/5 width) */}
            <div className="lg:col-span-2">
              <div className="sticky top-4">
                <OrderSummary
                  table={table}
                  orderItems={orderItems}
                  onUpdateQuantity={updateQuantity}
                  onClearOrder={() => setOrderItems([])}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
