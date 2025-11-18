import { motion } from 'framer-motion';
import { Search, TrendingUp, Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/GlassCard';
import { Input } from '@/components/ui/input';
import { mockTenants, mockProducts } from '@/utils/mockData';
import { Button } from '@/components/ui/button';

const categories = [
  { name: 'Semua', icon: '🍽️' },
  { name: 'Indonesian', icon: '🍜' },
  { name: 'Western', icon: '🍔' },
  { name: 'Japanese', icon: '🍱' },
  { name: 'Healthy', icon: '🥗' },
  { name: 'Drinks', icon: '🥤' },
];

export const UserHomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-primary rounded-2xl p-8 glow-primary relative overflow-hidden"
      >
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Selamat Datang di Digibite! 🎉
          </h1>
          <p className="text-white/90 mb-6">
            Pesan makanan favoritmu dari kantin Digitech University
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Cari makanan atau minuman..."
              className="pl-12 h-12 glass-strong border-white/20"
            />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </motion.div>

      {/* Categories */}
      <div>
        <h2 className="text-xl font-bold mb-4">Kategori</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat, idx) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass px-6 py-3 rounded-xl flex-shrink-0 hover:glass-strong transition-smooth"
            >
              <div className="text-2xl mb-1">{cat.icon}</div>
              <div className="text-sm font-medium whitespace-nowrap">{cat.name}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Popular Tenants */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Tenant Populer
          </h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/user/tenants')}>
            Lihat Semua
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockTenants.slice(0, 4).map((tenant, idx) => (
            <motion.div
              key={tenant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard
                className="cursor-pointer overflow-hidden p-0"
                onClick={() => navigate(`/user/tenant/${tenant.id}`)}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={tenant.image}
                    alt={tenant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 glass px-2 py-1 rounded-lg flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold">{tenant.rating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-1">{tenant.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{tenant.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>15-20 menit</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommended Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Star className="w-5 h-5 text-accent" />
            Rekomendasi Untuk Anda
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockProducts.slice(0, 8).map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <GlassCard
                className="cursor-pointer overflow-hidden p-0"
                onClick={() => navigate(`/user/tenant/${product.tenantId}`)}
              >
                <div className="relative h-32 md:h-40 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                    {product.tenantName}
                  </p>
                  <div className="font-bold text-primary">
                    Rp {product.price.toLocaleString('id-ID')}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
