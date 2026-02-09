import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/app/components/ui/card';
import { Lock, ArrowRight, Mail } from 'lucide-react';
import { toast } from 'sonner';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect
  if (isAuthenticated) {
    navigate('/admin');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success('Welcome back');
        navigate('/admin');
      } else {
        toast.error(result.error || 'Invalid credentials');
      }
    } catch {
      toast.error('Authentication service unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-background-secondary p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-primary/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md border-brand-border shadow-lg relative z-10 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 bg-brand-background-secondary rounded-2xl flex items-center justify-center mb-2 border border-brand-border">
            <Lock className="w-8 h-8 text-brand-primary" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold text-brand-text-primary">Admin Portal</CardTitle>
            <CardDescription className="text-brand-text-muted">Sign in with your Supabase account</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="h-12 pl-10 border-brand-border focus:ring-brand-primary/20 transition-all bg-white"
                  autoComplete="email"
                />
              </div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-12 border-brand-border focus:ring-brand-primary/20 transition-all bg-white"
                autoComplete="current-password"
              />
            </div>
            <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-brand-primary hover:bg-brand-primary-hover transition-all shadow-md hover:shadow-lg" 
                disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
