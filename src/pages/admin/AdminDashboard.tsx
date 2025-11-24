import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { 
  Store, 
  Package, 
  Users, 
  TrendingUp, 
  ShoppingBag,
  DollarSign 
} from 'lucide-react';
import { mockStats, mockOrders } from '@/utils/mockData';

const stats = [
  { 
    label: 'Total Tenants', 
    value: mockStats.totalTenants, 
    icon: Store, 
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  { 
    label: 'Total Users', 
    value: mockStats.totalUsers, 
    icon: Users, 
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  { 
    label: 'Total Orders', 
    value: mockStats.totalOrders, 
    icon: ShoppingBag, 
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  { 
    label: 'Total Revenue', 
    value: `Rp ${mockStats.totalRevenue.toLocaleString('id-ID')}`, 
    icon: DollarSign, 
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10'
  },
  { 
    label: "Today's Orders", 
    value: mockStats.todayOrders, 
    icon: TrendingUp, 
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10'
  },
  { 
    label: "Today's Revenue", 
    value: `Rp ${mockStats.todayRevenue.toLocaleString('id-ID')}`, 
    icon: Package, 
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10'
  },
];

export function AdminDashboard() {
  const recentOrders = mockOrders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard glow className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tenant</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Total</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-mono text-sm">#{order.id.slice(0, 8)}</td>
                    <td className="p-4">{order.userName}</td>
                    <td className="p-4">{order.tenantName}</td>
                    <td className="p-4 font-semibold">Rp {order.total.toLocaleString('id-ID')}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                        order.status === 'processing' ? 'bg-blue-500/20 text-blue-500' :
                        order.status === 'pending' ? 'bg-amber-500/20 text-amber-500' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
