import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Building2, CheckCircle, Copy, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  if (items.length === 0) {
    navigate('/user/cart');
    return null;
  }

  const handleCheckout = () => {
    setShowPaymentDialog(true);
  };

  const handlePaymentConfirm = async () => {
    setLoading(true);
    setShowPaymentDialog(false);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    setShowSuccessDialog(true);
  };

  const handleSuccessClose = () => {
    clearCart();
    setShowSuccessDialog(false);
    toast.success('Pesanan berhasil dibuat!');
    navigate('/user/history');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Disalin ke clipboard!');
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

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="glass-strong border-primary/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedPayment === 'qris' && 'Scan QRIS'}
              {selectedPayment === 'transfer' && 'Transfer Bank'}
              {selectedPayment === 'cash' && 'Pembayaran Cash'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {selectedPayment === 'qris' && (
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl mx-auto w-64 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-48 h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                      <Smartphone className="w-24 h-24 text-primary" />
                    </div>
                  </div>
                </div>
                <div className="glass p-4 rounded-xl text-center">
                  <p className="text-sm text-muted-foreground mb-2">Total Pembayaran</p>
                  <p className="text-2xl font-bold text-primary">
                    Rp {total.toLocaleString('id-ID')}
                  </p>
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  Scan kode QR dengan aplikasi e-wallet Anda
                </p>
              </div>
            )}

            {selectedPayment === 'transfer' && (
              <div className="space-y-4">
                <div className="glass p-6 rounded-xl space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Nama Bank</p>
                    <p className="text-lg font-bold">Bank Central Asia (BCA)</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Nomor Rekening</p>
                    <div className="flex items-center justify-between glass-strong p-3 rounded-lg">
                      <p className="text-xl font-bold">1234567890</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard('1234567890')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Atas Nama</p>
                    <p className="text-lg font-bold">Digibite Canteen</p>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Transfer</p>
                    <div className="flex items-center justify-between glass-strong p-3 rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        Rp {total.toLocaleString('id-ID')}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(total.toString())}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  Transfer sesuai nominal dan konfirmasi setelah pembayaran
                </p>
              </div>
            )}

            {selectedPayment === 'cash' && (
              <div className="space-y-4">
                <div className="glass p-8 rounded-xl text-center space-y-4">
                  <div className="w-20 h-20 rounded-full gradient-primary mx-auto flex items-center justify-center">
                    <CreditCard className="w-10 h-10" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Total Pembayaran</p>
                    <p className="text-3xl font-bold text-primary">
                      Rp {total.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="glass-strong p-4 rounded-lg">
                    <p className="font-medium mb-2">Silakan bayar di kasir</p>
                    <p className="text-sm text-muted-foreground">
                      Tunjukkan pesanan ini kepada kasir saat mengambil makanan
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handlePaymentConfirm}
              disabled={loading}
              className="w-full gradient-primary glow-primary h-12"
            >
              {loading ? 'Memproses...' : 'Konfirmasi Pembayaran'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="glass-strong border-primary/20 max-w-md">
          <div className="text-center space-y-6 py-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-24 h-24 rounded-full gradient-primary mx-auto flex items-center justify-center glow-primary"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Pembayaran Berhasil!</h3>
              <p className="text-muted-foreground">
                Pesanan Anda telah berhasil dibuat dan sedang diproses
              </p>
            </div>

            <div className="glass p-4 rounded-xl">
              <p className="text-sm text-muted-foreground mb-1">Total Dibayar</p>
              <p className="text-2xl font-bold text-primary">
                Rp {total.toLocaleString('id-ID')}
              </p>
            </div>

            <Button
              onClick={handleSuccessClose}
              className="w-full gradient-primary glow-primary h-12"
            >
              Lihat Riwayat Pesanan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
