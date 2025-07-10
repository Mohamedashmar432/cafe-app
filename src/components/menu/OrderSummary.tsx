import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Minus,
  Check,
  RotateCcw,
  Clock,
  CreditCard,
  DollarSign,
  Merge,
  Split,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Table, OrderItem } from '@/pages/Index';

interface OrderSummaryProps {
  table: Table;
  orderItems: OrderItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onClearOrder: () => void;
}

export const OrderSummary = ({
  table,
  orderItems,
  onUpdateQuantity,
  onClearOrder,
}: OrderSummaryProps) => {
  const { toast } = useToast();
  const [modifiers, setModifiers] = useState<{ [key: string]: string }>({});

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );
  const totalGst = orderItems.reduce(
    (sum, item) => sum + item.gst * item.quantity,
    0
  );
  const total = subtotal + totalGst;
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleModifierChange = (itemId: string, modifier: string) => {
    setModifiers({ ...modifiers, [itemId]: modifier });
  };

  const handleConfirmOrder = () => {
    if (orderItems.length === 0) {
      toast({
        title: "No items in order",
        description: "Please add items to your order before confirming.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Order Confirmed!",
      description: `Order for Table ${table.number} has been sent to the kitchen.`,
    });
    
    // Here you would typically send the order to your backend
    console.log('Order confirmed:', {
      table,
      items: orderItems,
      modifiers,
      total,
    });
  };

  const handleHoldOrder = () => {
    toast({
      title: "Order Held",
      description: `Order for Table ${table.number} has been saved as draft.`,
    });
  };

  const handleCheckout = () => {
    toast({
      title: "Checkout Initiated",
      description: `Proceeding to checkout for Table ${table.number}.`,
    });
  };

  const handlePayment = () => {
    toast({
      title: "Payment Processing",
      description: "Redirecting to payment gateway...",
    });
  };

  const handleMergeBills = () => {
    toast({
      title: "Merge Bills",
      description: "Bill merging functionality would be implemented here.",
    });
  };

  const handleSplitBills = () => {
    toast({
      title: "Split Bills",
      description: "Bill splitting functionality would be implemented here.",
    });
  };

  return (
    <Card className="w-full border-2 border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
        <CardTitle className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-lg sm:text-xl text-blue-800">Order Summary</span>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs sm:text-sm bg-blue-600 text-white border-blue-600">
              Table {table.number}
            </Badge>
            {totalItems > 0 && (
              <Badge variant="secondary" className="text-xs sm:text-sm bg-green-100 text-green-800 border-green-300">
                {totalItems} item{totalItems !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {orderItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-gray-600">No items in order</p>
            <p className="text-sm text-gray-500">Select items from the menu to add them here</p>
          </div>
        ) : (
          <>
            {/* Order Items */}
            <div className="space-y-3 max-h-60 sm:max-h-80 overflow-y-auto">
              {orderItems.map((item) => (
                <div key={item.id} className="space-y-2 p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-gray-800">{item.menuItem.name}</p>
                      <p className="text-sm font-semibold text-blue-600">
                        ${item.menuItem.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-bold bg-white px-2 py-1 rounded border">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 border-green-300 text-green-600 hover:bg-green-50"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Modifiers */}
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Modifiers:</Label>
                    <Select
                      value={modifiers[item.id] || ''}
                      onValueChange={(value) => handleModifierChange(item.id, value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Add modifier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="extra-sugar">Extra Sugar</SelectItem>
                        <SelectItem value="less-sugar">Less Sugar</SelectItem>
                        <SelectItem value="no-sugar">No Sugar</SelectItem>
                        <SelectItem value="extra-shot">Extra Shot</SelectItem>
                        <SelectItem value="decaf">Decaf</SelectItem>
                        <SelectItem value="soy-milk">Soy Milk</SelectItem>
                        <SelectItem value="almond-milk">Almond Milk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between text-sm bg-white p-2 rounded">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-bold text-blue-600">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm bg-white p-2 rounded">
                    <span className="text-gray-600">GST:</span>
                    <span className="font-semibold text-orange-600">${(item.gst * item.quantity).toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 pt-4 border-t-2 border-gray-200 bg-gradient-to-b from-gray-50 to-white p-4 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 font-medium">Total Items:</span>
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{totalItems}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 font-medium">Subtotal:</span>
                <span className="font-bold text-blue-600">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 font-medium">GST (10%):</span>
                <span className="font-bold text-orange-600">${totalGst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span className="text-gray-800">TOTAL:</span>
                <span className="text-green-700 bg-green-100 px-3 py-1 rounded-lg">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4">
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={handleConfirmOrder} className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm font-semibold">
                  <Check className="h-4 w-4 mr-1" />
                  Confirm Order
                </Button>
                <Button variant="outline" onClick={onClearOrder} className="text-xs sm:text-sm border-red-300 text-red-600 hover:bg-red-50">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={handleHoldOrder} className="text-xs sm:text-sm border-yellow-300 text-yellow-700 hover:bg-yellow-50">
                  <Clock className="h-4 w-4 mr-1" />
                  Hold Order
                </Button>
                <Button variant="outline" onClick={handleCheckout} className="text-xs sm:text-sm border-blue-300 text-blue-600 hover:bg-blue-50">
                  <CreditCard className="h-4 w-4 mr-1" />
                  Checkout
                </Button>
              </div>
              
              <Button className="w-full text-xs sm:text-sm bg-purple-600 hover:bg-purple-700 font-semibold" onClick={handlePayment}>
                <DollarSign className="h-4 w-4 mr-1" />
                Process Payment
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={handleMergeBills} className="text-xs sm:text-sm border-gray-300 text-gray-600 hover:bg-gray-50">
                  <Merge className="h-4 w-4 mr-1" />
                  Merge Bills
                </Button>
                <Button variant="outline" onClick={handleSplitBills} className="text-xs sm:text-sm border-gray-300 text-gray-600 hover:bg-gray-50">
                  <Split className="h-4 w-4 mr-1" />
                  Split Bills
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
