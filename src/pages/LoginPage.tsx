import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Store, Mail, Lock, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/GlassCard';
import { toast } from 'sonner';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'seller' | 'admin'>('user');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password, role);
      if (success) {
        toast.success('Login berhasil!');
        // Navigate based on role
        const paths = {
          admin: '/admin',
          seller: '/seller',
          user: '/user',
        };
        navigate(paths[role]);
      } else {
        toast.error('Login gagal! Periksa email dan password Anda.');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl"
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <motion.div 
              className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center glow-primary relative"
              animate={{ 
                boxShadow: [
                  "0 0 20px hsl(220 90% 56% / 0.4)",
                  "0 0 40px hsl(220 90% 56% / 0.8)",
                  "0 0 20px hsl(220 90% 56% / 0.4)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Store className="w-10 h-10 text-white" />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-400/0 via-white/20 to-blue-400/0" />
            </motion.div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold text-gradient mb-3 tracking-tight"
          >
            Digibite
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg"
          >
            Kantin Digital Digitech University
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard glow className="glass-strong">
            <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm font-medium mb-2 block">Masuk Sebagai</label>
              <div className="grid grid-cols-3 gap-2">
                {(['user', 'seller', 'admin'] as const).map((r) => (
                  <Button
                    key={r}
                    type="button"
                    variant={role === r ? 'default' : 'outline'}
                    onClick={() => setRole(r)}
                    className={role === r ? 'gradient-primary' : ''}
                  >
                    {r === 'user' ? 'Mahasiswa' : r === 'seller' ? 'Penjual' : 'Admin'}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 glass"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 glass"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gradient-primary glow-primary h-12 text-base font-semibold"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Belum punya akun?{' '}
              <button
                type="button"
                className="text-primary hover:underline font-medium"
                onClick={() => toast.info('Fitur registrasi segera hadir!')}
              >
                Daftar Sekarang
              </button>
            </div>
          </form>
          </GlassCard>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <div className="glass px-4 py-2 rounded-lg inline-block">
            <p className="text-xs text-muted-foreground">
              💡 Demo Login: gunakan email dan password apapun
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
