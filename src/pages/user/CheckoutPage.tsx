import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Building2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCartStore } from '@/store/cartStore';
import { PaymentMethod } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const paymentMethods = [
  {
    id: 'cash' as PaymentMethod,
    name: 'Cash',
    description: 'Bayar langsung di tempat',
    icon: CreditCard,
  },
  {
    id: 'qris' as PaymentMethod,
    name: 'QRIS',
    description: 'Scan & bayar dengan QRIS',
    icon: Smartphone,
  },
  {
    id: 'transfer' as PaymentMethod,
    name: 'Transfer Bank',
    description: 'Transfer ke rekening tenant',
    icon: Building2,
  },
];

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('qris');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    navigate('/user/cart');
    return null;
  }

  const handleCheckout = async () => {
    setLoading(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    clearCart();
    toast.success('Pesanan berhasil dibuat!', {
      description: 'Pesanan Anda sedang diproses',
    });
    
    setLoading(false);
    navigate('/user/history');
  };

  const total = getTotalPrice() + 2000;

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">Selesaikan pesanan Anda</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <GlassCard>
            <h3 className="text-lg font-bold mb-4">Pesanan Anda</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <div className="flex-1">
                    <span className="font-medium">{item.product.name}</span>
                    <span className="text-muted-foreground"> x{item.quantity}</span>
                  </div>
                  <span className="font-medium">
                    Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Payment Method */}
          <GlassCard>
            <h3 className="text-lg font-bold mb-4">Metode Pembayaran</h3>
            <div className="grid gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <motion.button
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPayment(method.id)}
                    className={cn(
                      'glass p-4 rounded-xl text-left transition-all',
                      selectedPayment === method.id &&
                        'border-2 border-primary bg-primary/10 glow-primary'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'w-12 h-12 rounded-lg flex items-center justify-center',
                          selectedPayment === method.id
                            ? 'gradient-primary'
                            : 'bg-muted'
                        )}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{method.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {method.description}
                        </div>
                      </div>
                      {selectedPayment === method.id && (
                        <CheckCircle className="w-6 h-6 text-primary" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </GlassCard>

          {/* Notes */}
          <GlassCard>
            <h3 className="text-lg font-bold mb-4">Catatan Pesanan (Opsional)</h3>
            <Textarea
              placeholder="Tambahkan catatan untuk penjual..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="glass resize-none"
              rows={4}
            />
          </GlassCard>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <GlassCard className="sticky top-24 space-y-4">
            <h3 className="text-xl font-bold">Ringkasan Pembayaran</h3>

            <div className="space-y-3 py-4 border-y border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>Rp {getTotalPrice().toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Biaya Layanan</span>
                <span>Rp 2.000</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-primary">
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full gradient-primary glow-primary h-12"
            >
              {loading ? 'Memproses...' : 'Buat Pesanan'}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Dengan melanjutkan, Anda menyetujui syarat dan ketentuan yang berlaku
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
