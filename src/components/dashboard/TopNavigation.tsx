
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  X,
  FileText,
  List,
  Truck,
  CreditCard,
  Calculator,
  Calendar,
  DollarSign,
  Users,
  Package,
  Clock,
  LogIn,
  LogOut,
  Power,
  Maximize,
  ChevronDown,
  Eye,
  EyeOff
} from 'lucide-react';
import type { User } from '@/pages/Index';

interface TopNavigationProps {
  user: User;
  onLogout: () => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const TopNavigation = ({ user, onLogout, isVisible, onToggleVisibility }: TopNavigationProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const menuItems = [
    { name: 'Order', icon: FileText, action: () => console.log('Order clicked') },
    { name: 'List', icon: List, action: () => console.log('List clicked') },
    { name: 'Delivery', icon: Truck, action: () => console.log('Delivery clicked') },
    { name: 'Transaction', icon: CreditCard, action: () => console.log('Transaction clicked') },
    { name: 'Settlement', icon: Calculator, action: () => console.log('Settlement clicked') },
    { name: 'Day End', icon: Calendar, action: () => console.log('Day End clicked') },
    { name: 'Drawer', icon: DollarSign, action: () => console.log('Drawer clicked') },
    { name: 'Member', icon: Users, action: () => console.log('Member clicked') },
    { name: 'Stock', icon: Package, action: () => console.log('Stock clicked') },
    { name: 'Time Entry', icon: Clock, action: () => console.log('Time Entry clicked') },
  ];

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <>
      {/* Toggle button - always visible */}
      <Button
        onClick={onToggleVisibility}
        className="fixed top-4 left-4 z-50 rounded-full p-2"
        size="sm"
        variant="outline"
      >
        {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>

      {/* Navigation bar */}
      <nav className={`fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Menu items */}
            <div className="flex items-center space-x-1 ml-12">
              {menuItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  size="sm"
                  onClick={item.action}
                  className="flex items-center space-x-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden md:block">{item.name}</span>
                </Button>
              ))}
            </div>

            {/* Right side - User info and actions */}
            <div className="flex items-center space-x-4">
              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFullscreen}
                  className="flex items-center space-x-2"
                >
                  <Maximize className="h-4 w-4" />
                  <span className="hidden md:block">Fullscreen</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:block">Sign Out</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.close()}
                  className="flex items-center space-x-2"
                >
                  <Power className="h-4 w-4" />
                  <span className="hidden md:block">Quit</span>
                </Button>
              </div>

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-accent">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                      <span className="text-xs text-muted-foreground">{user.role}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
