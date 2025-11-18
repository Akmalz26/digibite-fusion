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
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center glow-primary">
              <Store className="w-9 h-9 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Digibite</h1>
          <p className="text-muted-foreground">Kantin Digital Digitech University</p>
        </div>

        <GlassCard glow>
          <form onSubmit={handleLogin} className="space-y-4">
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

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Demo Login: gunakan email dan password apapun</p>
        </div>
      </motion.div>
    </div>
  );
};
