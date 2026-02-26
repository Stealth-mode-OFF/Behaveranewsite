import { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { LayoutPřehled, FileText, Briefcase, LogOut, Menu, Loader2, Users, Target, QrCode, ExternalLink } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Sheet, SheetObsah, SheetTrigger, SheetTitle } from '@/app/components/ui/sheet';
import { cn } from '@/app/components/ui/utils';

export function AdminLayout() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-background-secondary">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const userEmail = user?.email || 'admin';
  const userInitials = userEmail.slice(0, 2).toUpperCase();

  const NavItems = () => (
    <div className="space-y-1.5">
      <div className="text-xs font-semibold text-brand-text-muted/60 uppercase tracking-wider px-3 mb-2 mt-4">Přehled</div>
      <NavLink
        to="/admin"
        end
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
            isActive 
              ? "bg-brand-primary/10 text-brand-primary shadow-sm" 
              : "text-brand-text-secondary hover:bg-brand-background-secondary hover:text-brand-primary"
          )
        }
      >
        <LayoutPřehled className="w-4 h-4 transition-transform group-hover:scale-110" />
        Přehled
      </NavLink>

      <div className="text-xs font-semibold text-brand-text-muted/60 uppercase tracking-wider px-3 mb-2 mt-6">Obsah</div>
      <NavLink
        to="/admin/posts"
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
            isActive 
              ? "bg-brand-primary/10 text-brand-primary shadow-sm" 
              : "text-brand-text-secondary hover:bg-brand-background-secondary hover:text-brand-primary"
          )
        }
      >
        <FileText className="w-4 h-4 transition-transform group-hover:scale-110" />
        Články
      </NavLink>
      <NavLink
        to="/admin/case-studies"
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
            isActive 
              ? "bg-brand-primary/10 text-brand-primary shadow-sm" 
              : "text-brand-text-secondary hover:bg-brand-background-secondary hover:text-brand-primary"
          )
        }
      >
        <Briefcase className="w-4 h-4 transition-transform group-hover:scale-110" />
        Případové studie
      </NavLink>

      <div className="text-xs font-semibold text-brand-text-muted/60 uppercase tracking-wider px-3 mb-2 mt-6">Prodej</div>
      <NavLink
        to="/admin/onboardings"
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
            isActive 
              ? "bg-brand-primary/10 text-brand-primary shadow-sm" 
              : "text-brand-text-secondary hover:bg-brand-background-secondary hover:text-brand-primary"
          )
        }
      >
        <Users className="w-4 h-4 transition-transform group-hover:scale-110" />
        Registrace
      </NavLink>
      <NavLink
        to="/admin/leads"
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
            isActive 
              ? "bg-brand-primary/10 text-brand-primary shadow-sm" 
              : "text-brand-text-secondary hover:bg-brand-background-secondary hover:text-brand-primary"
          )
        }
      >
        <Target className="w-4 h-4 transition-transform group-hover:scale-110" />
        Leady
      </NavLink>

      <div className="text-xs font-semibold text-brand-text-muted/60 uppercase tracking-wider px-3 mb-2 mt-6">Nástroje</div>
      <a
        href="/scan-qr"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group text-brand-text-secondary hover:bg-brand-background-secondary hover:text-brand-primary"
      >
        <QrCode className="w-4 h-4 transition-transform group-hover:scale-110" />
        QR registrace
        <ExternalLink className="w-3 h-3 ml-auto opacity-40 group-hover:opacity-70" />
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-background-secondary/30 flex font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-brand-border/60 fixed inset-y-0 z-50 shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-brand-border/40">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white font-bold">EP</div>
             <span className="text-lg font-bold text-brand-text-primary tracking-tight">Behavera</span>
           </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <NavItems />
        </div>

        <div className="p-4 border-t border-brand-border/40 bg-brand-background-secondary/20">
          <div className="flex items-center gap-3 px-2 mb-4">
             <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-primary text-xs font-bold">{userInitials}</div>
             <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-brand-text-primary truncate">{userEmail}</div>
             </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-brand-error hover:text-brand-error hover:bg-brand-error/10 h-10 px-3 font-medium" 
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Odhlásit se
          </Button>
        </div>
      </aside>

      {/* Main Obsah */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-72 transition-all duration-300">
        {/* Mobile Header */}
        <header className="md:hidden bg-white/80 backdrop-blur-md border-b border-brand-border/60 p-4 sticky top-0 z-40 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white font-bold text-xs">EP</div>
             <span className="text-lg font-bold text-brand-text-primary">Admin</span>
           </div>
           
           <Sheet>
             <SheetTrigger asChild>
               <Button variant="ghost" size="icon" className="text-brand-text-primary">
                 <Menu className="w-5 h-5" />
               </Button>
             </SheetTrigger>
             <SheetObsah side="left" className="w-72 p-0 border-r border-brand-border/60">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
               <div className="h-16 flex items-center px-6 border-b border-brand-border/40 bg-brand-background-primary">
                  <span className="text-lg font-bold text-brand-text-primary">Behavera</span>
                </div>
                <div className="p-4 flex flex-col h-[calc(100vh-64px)] bg-brand-background-primary">
                  <div className="flex-1">
                    <NavItems />
                  </div>
                  <div className="pt-4 border-t border-brand-border/40">
                      <Button variant="ghost" className="w-full justify-start text-brand-error hover:bg-brand-error/10" onClick={logout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Odhlásit se
                      </Button>
                  </div>
                </div>
             </SheetObsah>
           </Sheet>
        </header>

        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
