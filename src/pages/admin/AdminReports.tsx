import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag,
  Calendar,
  Download,
  Filter,
  Store,
  Users,
  CreditCard
} from 'lucide-react';
import { mockOrders, mockProducts, mockTenants, mockStats } from '@/utils/mockData';

// Generate more comprehensive transaction data
const generateTransactionData = () => {
  const transactions = [];
  const baseDate = new Date('2024-01-01');
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    
    transactions.push({
      id: `t${i + 1}`,
      date: date.toISOString().split('T')[0],
      orderId: `o${i + 1}`,
      tenantName: mockTenants[i % mockTenants.length].name,
      customerName: ['John Doe', 'Jane Smith', 'Ahmad Rizki', 'Siti Nurhaliza', 'Budi Santoso'][i % 5],
      paymentMethod: ['cash', 'qris', 'transfer'][i % 3],
      amount: Math.floor(Math.random() * 100000) + 20000,
      status: ['completed', 'completed', 'completed', 'refunded'][i % 4] as 'completed' | 'refunded',
    });
  }
  
  return transactions;
};

const transactions = generateTransactionData();

// Generate chart data
const generateDailyRevenueData = () => {
  const data = [];
  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  
  for (let i = 0; i < 7; i++) {
    data.push({
      name: days[i],
      revenue: Math.floor(Math.random() * 500000) + 200000,
      orders: Math.floor(Math.random() * 30) + 10,
    });
  }
  
  return data;
};

const generateMonthlyRevenueData = () => {
  const data = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
  
  for (let i = 0; i < 6; i++) {
    data.push({
      name: months[i],
      revenue: Math.floor(Math.random() * 5000000) + 2000000,
      orders: Math.floor(Math.random() * 200) + 100,
    });
  }
  
  return data;
};

const paymentMethodData = [
  { name: 'Cash', value: 35, color: '#22c55e' },
  { name: 'QRIS', value: 45, color: '#3b82f6' },
  { name: 'Transfer', value: 20, color: '#a855f7' },
];

const tenantRevenueData = mockTenants.map(tenant => ({
  name: tenant.name.length > 15 ? tenant.name.slice(0, 15) + '...' : tenant.name,
  revenue: Math.floor(Math.random() * 2000000) + 500000,
}));

export function AdminReports() {
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: '2024-01-31',
  });
  const [selectedTenant, setSelectedTenant] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');

  const dailyData = useMemo(() => generateDailyRevenueData(), []);
  const monthlyData = useMemo(() => generateMonthlyRevenueData(), []);

  const filteredTransactions = transactions.filter(t => {
    const matchesTenant = selectedTenant === 'all' || t.tenantName === selectedTenant;
    const matchesPayment = selectedPayment === 'all' || t.paymentMethod === selectedPayment;
    const matchesDate = t.date >= dateRange.start && t.date <= dateRange.end;
    return matchesTenant && matchesPayment && matchesDate;
  });

  const totalRevenue = filteredTransactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalTransactions = filteredTransactions.length;
  const completedTransactions = filteredTransactions.filter(t => t.status === 'completed').length;
  const refundedTransactions = filteredTransactions.filter(t => t.status === 'refunded').length;

  const handleExport = () => {
    // In a real app, this would generate a CSV/PDF export
    const csvContent = filteredTransactions
      .map(t => `${t.date},${t.orderId},${t.tenantName},${t.customerName},${t.paymentMethod},${t.amount},${t.status}`)
      .join('\n');
    
    const blob = new Blob([`Date,Order ID,Tenant,Customer,Payment,Amount,Status\n${csvContent}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${dateRange.start}-to-${dateRange.end}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">View transaction history and revenue analytics</p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <GlassCard glow className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-2xl font-bold">Rp {totalRevenue.toLocaleString('id-ID')}</p>
                <div className="flex items-center gap-1 mt-2 text-green-500">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+12.5%</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-green-500/10">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <GlassCard glow className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
                <p className="text-2xl font-bold">{totalTransactions}</p>
                <div className="flex items-center gap-1 mt-2 text-green-500">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+8.3%</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10">
                <ShoppingBag className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard glow className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed</p>
                <p className="text-2xl font-bold">{completedTransactions}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {((completedTransactions / totalTransactions) * 100).toFixed(1)}% rate
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10">
                <Store className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <GlassCard glow className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Refunded</p>
                <p className="text-2xl font-bold">{refundedTransactions}</p>
                <div className="flex items-center gap-1 mt-2 text-red-500">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm">-2.1%</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-red-500/10">
                <CreditCard className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs">Start Date</Label>
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-[150px]"
            />
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs">End Date</Label>
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-[150px]"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Tenant</Label>
            <Select value={selectedTenant} onValueChange={setSelectedTenant}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Tenants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tenants</SelectItem>
                {mockTenants.map(tenant => (
                  <SelectItem key={tenant.id} value={tenant.name}>
                    {tenant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Payment</Label>
            <Select value={selectedPayment} onValueChange={setSelectedPayment}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="qris">QRIS</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </GlassCard>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Revenue Overview</h3>
            <Select value={viewMode} onValueChange={(v) => setViewMode(v as 'daily' | 'monthly')}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={viewMode === 'daily' ? dailyData : monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Payment Method Distribution */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-6">Payment Methods</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethodData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {paymentMethodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Orders Trend */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-6">Orders Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewMode === 'daily' ? dailyData : monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Revenue by Tenant */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-6">Revenue by Tenant</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tenantRevenueData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={120} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Transactions Table */}
      <GlassCard className="overflow-hidden">
        <div className="p-4 border-b border-border/50">
          <h3 className="text-lg font-semibold">Transaction History</h3>
          <p className="text-sm text-muted-foreground">
            Showing {filteredTransactions.length} transactions
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.slice(0, 10).map((transaction, index) => (
              <motion.tr
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors"
              >
                <TableCell className="text-sm">
                  {new Date(transaction.date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </TableCell>
                <TableCell className="font-mono text-sm">#{transaction.orderId}</TableCell>
                <TableCell>{transaction.tenantName}</TableCell>
                <TableCell>{transaction.customerName}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted">
                    {transaction.paymentMethod.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className="font-semibold">
                  Rp {transaction.amount.toLocaleString('id-ID')}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.status === 'completed' 
                      ? 'bg-green-500/20 text-green-500' 
                      : 'bg-red-500/20 text-red-500'
                  }`}>
                    {transaction.status === 'completed' ? 'Completed' : 'Refunded'}
                  </span>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </GlassCard>
    </div>
  );
}
