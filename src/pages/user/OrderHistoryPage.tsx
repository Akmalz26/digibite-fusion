import { motion } from 'framer-motion';
import { Package, Clock } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { StatusBadge } from '@/components/StatusBadge';
import { mockOrders } from '@/utils/mockData';
import { Button } from '@/components/ui/button';

export const OrderHistoryPage = () => {
  if (mockOrders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong rounded-full w-32 h-32 flex items-center justify-center mb-6"
        >
          <Package className="w-16 h-16 text-muted-foreground" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">Belum Ada Pesanan</h2>
        <p className="text-muted-foreground mb-6">
          Riwayat pesanan Anda akan muncul di sini
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Riwayat Pesanan</h1>
        <p className="text-muted-foreground">Lihat semua pesanan Anda</p>
      </div>

      <div className="space-y-4">
        {mockOrders.map((order, idx) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <GlassCard>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{order.tenantName}</h3>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {new Date(order.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">Total</div>
                  <div className="text-xl font-bold text-primary">
                    Rp {order.total.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              <div className="space-y-2 py-4 border-t border-white/10">
                {order.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="font-medium">
                      Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/10">
                <Button variant="outline" className="flex-1">
                  Lihat Detail
                </Button>
                {order.status === 'delivered' && (
                  <Button className="flex-1 gradient-primary">
                    Pesan Lagi
                  </Button>
                )}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
