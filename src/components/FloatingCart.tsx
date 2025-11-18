import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { Button } from './ui/button';

export const FloatingCart = () => {
  const navigate = useNavigate();
  const { getTotalItems, getTotalPrice } = useCartStore();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (totalItems === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
        onClick={() => navigate('/user/cart')}
        className="glass-strong glow-primary rounded-full h-16 px-6 shadow-2xl group"
        size="lg"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="text-left">
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="font-bold">Rp {totalPrice.toLocaleString('id-ID')}</div>
          </div>
        </div>
      </Button>
    </motion.div>
  );
};
