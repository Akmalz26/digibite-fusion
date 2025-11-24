import { Outlet, useNavigate } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import { useAuthStore } from '@/store/authStore';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  Users, 
  CreditCard, 
  FileText, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/tenants', label: 'Tenants', icon: Store },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/reports', label: 'Reports', icon: FileText },
];

export function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 glass-strong border-r border-border/50 flex-col">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gradient">Digibite</h2>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:glass text-muted-foreground hover:text-foreground"
              activeClassName="glass-strong text-primary font-medium glow-primary"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-10 h-10 rounded-full ring-2 ring-primary/20"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
            <ThemeToggle />
          </div>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-72 glass-strong border-r border-border/50 z-50 lg:hidden flex flex-col"
            >
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                      <LayoutDashboard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg text-gradient">Digibite</h2>
                      <p className="text-xs text-muted-foreground">Admin Panel</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:glass text-muted-foreground hover:text-foreground"
                    activeClassName="glass-strong text-primary font-medium"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="p-4 border-t border-border/50">
                <div className="flex items-center gap-3 mb-4 px-2">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full ring-2 ring-primary/20"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">Admin</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden glass-strong border-b border-border/50 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gradient">Digibite</span>
          </div>
          <ThemeToggle />
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
