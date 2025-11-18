import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoginPage } from "@/pages/LoginPage";
import { UserLayout } from "@/layouts/UserLayout";
import { UserHomePage } from "@/pages/user/UserHomePage";
import { TenantsPage } from "@/pages/user/TenantsPage";
import { TenantDetailPage } from "@/pages/user/TenantDetailPage";
import { CartPage } from "@/pages/user/CartPage";
import { CheckoutPage } from "@/pages/user/CheckoutPage";
import { OrderHistoryPage } from "@/pages/user/OrderHistoryPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* User Routes */}
          <Route path="/user" element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserLayout />
            </ProtectedRoute>
          }>
            <Route index element={<UserHomePage />} />
            <Route path="tenants" element={<TenantsPage />} />
            <Route path="tenant/:id" element={<TenantDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="history" element={<OrderHistoryPage />} />
          </Route>

          {/* Seller Routes - Coming Soon */}
          <Route path="/seller" element={
            <ProtectedRoute allowedRoles={['seller']}>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gradient mb-4">Seller Dashboard</h1>
                  <p className="text-muted-foreground">Coming Soon...</p>
                </div>
              </div>
            </ProtectedRoute>
          } />

          {/* Admin Routes - Coming Soon */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gradient mb-4">Admin Dashboard</h1>
                  <p className="text-muted-foreground">Coming Soon...</p>
                </div>
              </div>
            </ProtectedRoute>
          } />

          {/* Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
