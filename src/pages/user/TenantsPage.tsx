import { motion } from 'framer-motion';
import { Search, MapPin, Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/GlassCard';
import { Input } from '@/components/ui/input';
import { mockTenants } from '@/utils/mockData';

export const TenantsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Semua Tenant</h1>
            <p className="text-muted-foreground">
              Temukan tenant favorit Anda di Kantin Digitech
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Cari tenant..."
            className="pl-12 glass"
          />
        </div>
      </div>

      {/* Tenant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTenants.map((tenant, idx) => (
          <motion.div
            key={tenant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <GlassCard
              className="overflow-hidden p-0"
              onClick={() => navigate(`/user/tenant/${tenant.id}`)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={tenant.image}
                  alt={tenant.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{tenant.rating}</span>
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-4 left-4 glass px-3 py-1 rounded-lg text-sm font-medium">
                  {tenant.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">{tenant.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {tenant.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>Kantin Digitech</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>15-20 min</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
