
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { SocialLogin } from './SocialLogin';
import type { User } from '@/pages/Index';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<User['role']>('Waiter');
  const [rememberMe, setRememberMe] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple mock authentication
    const userData: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    
    onLogin(userData);
  };

  // Floating cafe SVG elements
  const FloatingCafeElement = ({ children, className, delay = 0 }: { children: React.ReactNode; className: string; delay?: number }) => (
    <div 
      className={`absolute opacity-20 animate-pulse ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Cafe SVG Elements */}
      <FloatingCafeElement className="top-10 left-10" delay={0}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" className="text-primary/30">
          <path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.38 0 2.5-1.12 2.5-2.5S19.88 5 18.5 5V3zM16 5v3.5c0 .83-.67 1.5-1.5 1.5S13 9.33 13 8.5V5h3zm-5 0v3.5c0 .83-.67 1.5-1.5 1.5S8 9.33 8 8.5V5h3z"/>
        </svg>
      </FloatingCafeElement>

      <FloatingCafeElement className="top-20 right-20" delay={1}>
        <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor" className="text-accent/30">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </FloatingCafeElement>

      <FloatingCafeElement className="bottom-10 left-20" delay={2}>
        <svg width="70" height="70" viewBox="0 0 24 24" fill="currentColor" className="text-secondary/30">
          <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97L6.5 22h2.25l-.25-9.03C10.34 12.84 12 11.12 12 9V2h-1v7z"/>
        </svg>
      </FloatingCafeElement>

      <FloatingCafeElement className="bottom-20 right-10" delay={0.5}>
        <svg width="55" height="55" viewBox="0 0 24 24" fill="currentColor" className="text-primary/25">
          <path d="M8.1 13.34l2.83-2.83L12.93 12l2.83-2.83-1.41-1.41L12.93 9.17l-1.41-1.41L8.1 10.93 6.69 9.52 5.28 10.93l2.82 2.41zm8.26-2.85c1.17-.52 2.61-.9 4.24-.9.72 0 1.39.1 2.03.26l1.52-6.63C24.6 2.48 24.2 2 23.72 2H4.27c-.48 0-.88.48-.63 1.22l1.52 6.63c.64-.16 1.31-.26 2.03-.26 1.63 0 3.07.38 4.24.9L12 9.12l.57 1.37z"/>
        </svg>
      </FloatingCafeElement>

      <FloatingCafeElement className="top-1/2 left-5" delay={1.5}>
        <svg width="45" height="45" viewBox="0 0 24 24" fill="currentColor" className="text-accent/25">
          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
        </svg>
      </FloatingCafeElement>

      <FloatingCafeElement className="top-1/3 right-5" delay={2.5}>
        <svg width="65" height="65" viewBox="0 0 24 24" fill="currentColor" className="text-secondary/25">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </FloatingCafeElement>

      <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-card/90">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <p className="text-muted-foreground">
            {isRegistering ? 'Sign up for your cafe account' : 'Sign in to your cafe account'}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value: User['role']) => setRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Waiter">Waiter</SelectItem>
                  <SelectItem value="Cashier">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label htmlFor="remember" className="text-sm">
                Remember me
              </Label>
            </div>
            
            <Button type="submit" className="w-full">
              {isRegistering ? 'Create Account' : 'Sign In'}
            </Button>
          </form>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <Button
              variant="link"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Sign In' : 'Register'}
            </Button>
          </div>
          
          {!isRegistering && (
            <div className="text-center">
              <Button variant="link" className="text-sm">
                Forgot Password?
              </Button>
            </div>
          )}
          
          <SocialLogin onLogin={onLogin} />
        </CardContent>
      </Card>
    </div>
  );
};
