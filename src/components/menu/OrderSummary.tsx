
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
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Order Summary</span>
          <Badge variant="outline">Table {table.number}</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {orderItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No items in order</p>
            <p className="text-sm">Select items from the menu to add them here</p>
          </div>
        ) : (
          <>
            {/* Order Items */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {orderItems.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.menuItem.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ${item.menuItem.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Modifiers */}
                  <div className="space-y-2">
                    <Label className="text-xs">Modifiers:</Label>
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
                  
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST:</span>
                    <span>${(item.gst * item.quantity).toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (10%):</span>
                <span>${totalGst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4">
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={handleConfirmOrder} className="bg-green-600 hover:bg-green-700">
                  <Check className="h-4 w-4 mr-1" />
                  Confirm
                </Button>
                <Button variant="outline" onClick={onClearOrder}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={handleHoldOrder}>
                  <Clock className="h-4 w-4 mr-1" />
                  Hold
                </Button>
                <Button variant="outline" onClick={handleCheckout}>
                  <CreditCard className="h-4 w-4 mr-1" />
                  Checkout
                </Button>
              </div>
              
              <Button className="w-full" onClick={handlePayment}>
                <DollarSign className="h-4 w-4 mr-1" />
                Payment
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={handleMergeBills}>
                  <Merge className="h-4 w-4 mr-1" />
                  Merge Bills
                </Button>
                <Button variant="outline" onClick={handleSplitBills}>
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
