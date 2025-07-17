
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Trash2, ArrowLeft } from 'lucide-react';

interface MenuItemType {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory: 'Special' | 'Strong' | 'Less Sugar' | 'Normal';
  icon: string;
}

interface MenuManagementProps {
  onBack: () => void;
}

export const MenuManagement = ({ onBack }: MenuManagementProps) => {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([
    { id: '1', name: 'Prata Kosong', price: 1.50, category: 'Famous Prata Items', subcategory: 'Normal', icon: '🥞' },
    { id: '2', name: 'Chicken Biryani', price: 8.50, category: 'Biryani', subcategory: 'Normal', icon: '🍛' },
    { id: '3', name: 'Kopi', price: 1.50, category: 'Coffees', subcategory: 'Normal', icon: '☕' },
  ]);

  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    price: '',
    category: '',
    subcategory: 'Normal' as 'Special' | 'Strong' | 'Less Sugar' | 'Normal',
    icon: '🍽️'
  });

  const categories = [
    'Famous Prata Items',
    'Goreng Items', 
    'Biryani',
    'Thosai',
    'Coffees',
    'Cold Drinks',
    'Teas',
    'Desserts'
  ];

  const handleAddMenuItem = () => {
    if (newMenuItem.name && newMenuItem.price && newMenuItem.category) {
      const menuItem: MenuItemType = {
        id: Math.random().toString(36).substr(2, 9),
        name: newMenuItem.name,
        price: parseFloat(newMenuItem.price),
        category: newMenuItem.category,
        subcategory: newMenuItem.subcategory,
        icon: newMenuItem.icon
      };
      setMenuItems([...menuItems, menuItem]);
      setNewMenuItem({ name: '', price: '', category: '', subcategory: 'Normal', icon: '🍽️' });
    }
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin
        </Button>
        <h2 className="text-2xl font-bold">Menu Management</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Menu Item Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ChefHat className="h-5 w-5" />
              <span>Add Menu Item</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                value={newMenuItem.name}
                onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                placeholder="Item name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="itemPrice">Price ($)</Label>
              <Input
                id="itemPrice"
                type="number"
                step="0.01"
                value={newMenuItem.price}
                onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemCategory">Category</Label>
              <select
                id="itemCategory"
                value={newMenuItem.category}
                onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                className="w-full p-2 border border-input rounded-md"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemSubcategory">Subcategory</Label>
              <select
                id="itemSubcategory"
                value={newMenuItem.subcategory}
                onChange={(e) => setNewMenuItem({...newMenuItem, subcategory: e.target.value as 'Special' | 'Strong' | 'Less Sugar' | 'Normal'})}
                className="w-full p-2 border border-input rounded-md"
              >
                <option value="Normal">Normal</option>
                <option value="Special">Special</option>
                <option value="Strong">Strong</option>
                <option value="Less Sugar">Less Sugar</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemIcon">Icon (Emoji)</Label>
              <Input
                id="itemIcon"
                value={newMenuItem.icon}
                onChange={(e) => setNewMenuItem({...newMenuItem, icon: e.target.value})}
                placeholder="🍽️"
              />
            </div>

            <Button onClick={handleAddMenuItem} className="w-full">
              Add Menu Item
            </Button>
          </CardContent>
        </Card>

        {/* Menu Items List */}
        <Card>
          <CardHeader>
            <CardTitle>Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {menuItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="font-bold text-green-600">${item.price.toFixed(2)}</span>
                        <Badge variant="outline">{item.subcategory}</Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteMenuItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
