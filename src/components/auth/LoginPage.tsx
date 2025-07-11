
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SocialLogin } from './SocialLogin';
import type { User } from '@/pages/Index';
import { api } from '@/lib/api';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Check if credentials are provided
    if (!employeeId || !password) {
      setError('Please enter both Employee ID and Password');
      return;
    }
    
    try {
      const response = await api.login(employeeId, password);
      
      // Convert backend user format to frontend format
      const userData: User = {
        id: response.user.id.toString(),
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.user.employee_id}`,
      };
      
      onLogin(userData);
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    }
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

      {/* Additional Food and Cafe Elements */}
      <FloatingCafeElement className="top-5 right-1/3" delay={3}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="text-orange-400/30">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8 17.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM16 17.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </FloatingCafeElement>

      <FloatingCafeElement className="bottom-1/3 left-10" delay={3.5}>
        <svg width="52" height="52" viewBox="0 0 24 24" fill="currentColor" className="text-green-400/30">
          <path d="M12 2l-5.5 9h11L12 2zM5.8 13l2.9-5h6.6l2.9 5H5.8zM12 14.5L8.5 22h7L12 14.5z"/>
        </svg>
      </FloatingCafeElement>

      <FloatingCafeElement className="top-1/4 left-1/3" delay={4}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-red-400/30">
          <path d="M22 12c0-5.54-4.46-10-10-10S2 6.46 2 12c0 5.54 4.46 10 10 10s10-4.46 10-10zM8 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm8 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
        </svg>
      </FloatingCafeElement>

      <FloatingCafeElement className="bottom-5 right-1/4" delay={4.5}>
        <svg width="58" height="58" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400/30">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
        </svg>
      </FloatingCafeElement>

      <FloatingCafeElement className="top-2/3 right-8" delay={5}>
        <svg width="46" height="46" viewBox="0 0 24 24" fill="currentColor" className="text-purple-400/30">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </FloatingCafeElement>

      <FloatingCafeElement className="top-16 left-1/2" delay={5.5}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-400/30">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </FloatingCafeElement>

      <FloatingCafeElement className="bottom-1/4 right-2" delay={6}>
        <svg width="42" height="42" viewBox="0 0 24 24" fill="currentColor" className="text-pink-400/30">
          <path d="M17.6 11.48 19.44 8.3a.6.6 0 0 0-.4-.9H13.4a.6.6 0 0 0-.4.9l1.84 3.18a.6.6 0 0 0 1.04 0l1.72-2.98z"/>
        </svg>
      </FloatingCafeElement>

      <FloatingCafeElement className="top-3/4 left-6" delay={6.5}>
        <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor" className="text-teal-400/30">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      </FloatingCafeElement>

      <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-card/90">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Cafe Login
          </CardTitle>
          <p className="text-muted-foreground">
            Sign in to your employee account
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter your employee ID (Admin: 0001)"
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
            
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          
          <div className="text-center">
            <Button variant="link" className="text-sm">
              Forgot Password?
            </Button>
          </div>
          
          <SocialLogin onLogin={onLogin} />
        </CardContent>
      </Card>
    </div>
  );
};
