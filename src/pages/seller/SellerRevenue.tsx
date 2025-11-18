import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { DollarSign, TrendingUp, Calendar, Download } from 'lucide-react';
import { mockOrders } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function SellerRevenue() {
  const completedOrders = mockOrders.filter(o => o.status === 'delivered');
  
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
  const thisMonthRevenue = completedOrders
    .filter(o => new Date(o.createdAt).getMonth() === new Date().getMonth())
    .reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = totalRevenue / (completedOrders.length || 1);

  const stats = [
    {
      label: 'Total Revenue',
      value: `Rp ${totalRevenue.toLocaleString('id-ID')}`,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      label: 'This Month',
      value: `Rp ${thisMonthRevenue.toLocaleString('id-ID')}`,
      icon: Calendar,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      label: 'Average Order',
      value: `Rp ${Math.round(averageOrderValue).toLocaleString('id-ID')}`,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
    },
  ];

  const handleDownloadReport = () => {
    toast.success('Revenue report downloaded');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Revenue</h1>
          <p className="text-muted-foreground">Track your earnings and financial performance</p>
        </div>
        <Button onClick={handleDownloadReport} className="gradient-primary">
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {/* Revenue Breakdown */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-bold mb-4">Revenue Breakdown</h2>
        <div className="space-y-4">
          {completedOrders.slice(0, 10).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
            >
              <div>
                <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString('id-ID')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {order.items.length} items • {order.paymentMethod}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-400">
                  + Rp {order.total.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Summary */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-bold mb-4">Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-muted-foreground">Total Orders Completed</span>
            <span className="font-semibold">{completedOrders.length}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-muted-foreground">Total Items Sold</span>
            <span className="font-semibold">
              {completedOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-3">
            <span className="text-lg font-semibold">Total Revenue</span>
            <span className="text-2xl font-bold text-primary">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
