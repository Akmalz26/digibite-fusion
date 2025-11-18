import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { 
  DollarSign, 
  Package, 
  ShoppingBag, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { mockOrders, mockProducts } from '@/utils/mockData';
import { useAuthStore } from '@/store/authStore';
import { StatusBadge } from '@/components/StatusBadge';

export function SellerDashboard() {
  const { user } = useAuthStore();
  
  // Filter data for current seller
  const sellerProducts = mockProducts.filter(p => p.tenantId === user?.id || p.tenantId === '1');
  const sellerOrders = mockOrders.filter(o => 
    o.items.some(item => sellerProducts.find(p => p.id === item.product.id))
  );

  // Calculate stats
  const totalRevenue = sellerOrders
    .filter(o => o.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0);
  
  const pendingOrders = sellerOrders.filter(o => o.status === 'pending').length;
  const processingOrders = sellerOrders.filter(o => o.status === 'processing').length;
  const completedOrders = sellerOrders.filter(o => o.status === 'delivered').length;

  const stats = [
    {
      label: 'Total Revenue',
      value: `Rp ${totalRevenue.toLocaleString('id-ID')}`,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      label: 'Total Products',
      value: sellerProducts.length,
      icon: Package,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      label: 'Total Orders',
      value: sellerOrders.length,
      icon: ShoppingBag,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
    },
    {
      label: 'Completed Today',
      value: completedOrders,
      icon: TrendingUp,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
    },
  ];

  const recentOrders = sellerOrders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Order Status Summary */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-bold mb-4">Order Status Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-400/10">
            <Clock className="w-8 h-8 text-yellow-400" />
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{pendingOrders}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-400/10">
            <Package className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-sm text-muted-foreground">Processing</p>
              <p className="text-2xl font-bold">{processingOrders}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-green-400/10">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{completedOrders}</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Recent Orders */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <motion.div
                key={order.id}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth"
              >
                <div className="flex-1">
                  <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} items • Rp {order.total.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(order.createdAt).toLocaleString('id-ID')}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
