import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { mockOrders, mockProducts } from '@/utils/mockData';
import { Order, OrderStatus } from '@/types';
import { 
  Search, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Package,
  Filter,
  ShoppingBag,
  User,
  Store,
  CreditCard,
  Calendar
} from 'lucide-react';

const statusOptions: { value: OrderStatus; label: string; color: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'pending', label: 'Pending', color: 'bg-amber-500/20 text-amber-500', icon: Clock },
  { value: 'processing', label: 'Processing', color: 'bg-blue-500/20 text-blue-500', icon: Loader2 },
  { value: 'ready', label: 'Ready', color: 'bg-purple-500/20 text-purple-500', icon: Package },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-500/20 text-green-500', icon: CheckCircle },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500/20 text-red-500', icon: XCircle },
];

// Extended mock orders for demonstration
const extendedOrders: Order[] = [
  ...mockOrders,
  {
    id: 'o3',
    userId: 'user3',
    userName: 'Ahmad Rizki',
    tenantId: '3',
    tenantName: 'Ramen House',
    items: [
      { product: mockProducts[4], quantity: 2 },
      { product: mockProducts[5], quantity: 1 },
    ],
    total: 99000,
    status: 'delivered',
    paymentMethod: 'transfer',
    createdAt: '2024-01-19T14:30:00',
    updatedAt: '2024-01-19T15:00:00',
  },
  {
    id: 'o4',
    userId: 'user4',
    userName: 'Siti Nurhaliza',
    tenantId: '4',
    tenantName: 'Healthy Bowl',
    items: [
      { product: mockProducts[6], quantity: 1 },
      { product: mockProducts[7], quantity: 2 },
    ],
    total: 58000,
    status: 'ready',
    paymentMethod: 'qris',
    createdAt: '2024-01-20T09:15:00',
    updatedAt: '2024-01-20T09:45:00',
  },
  {
    id: 'o5',
    userId: 'user5',
    userName: 'Budi Santoso',
    tenantId: '1',
    tenantName: 'Warung Makan Jaya',
    items: [
      { product: mockProducts[0], quantity: 3 },
    ],
    total: 45000,
    status: 'cancelled',
    paymentMethod: 'cash',
    notes: 'Customer cancelled due to long waiting time',
    createdAt: '2024-01-18T12:00:00',
    updatedAt: '2024-01-18T12:30:00',
  },
  {
    id: 'o6',
    userId: 'user6',
    userName: 'Dewi Lestari',
    tenantId: '2',
    tenantName: 'Burger & Grill Station',
    items: [
      { product: mockProducts[2], quantity: 2 },
      { product: mockProducts[3], quantity: 1 },
    ],
    total: 78000,
    status: 'processing',
    paymentMethod: 'qris',
    createdAt: '2024-01-20T11:30:00',
    updatedAt: '2024-01-20T11:45:00',
  },
];

export function AdminOrders() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [orders, setOrders] = useState<Order[]>(extendedOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tenantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    ));
    toast({
      title: 'Status Updated',
      description: `Order status changed to ${newStatus}`,
    });
  };

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusOption = statusOptions.find(s => s.value === status);
    if (!statusOption) return null;
    const Icon = statusOption.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusOption.color}`}>
        <Icon className="w-3 h-3" />
        {statusOption.label}
      </span>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash': return 'Cash';
      case 'qris': return 'QRIS';
      case 'transfer': return 'Bank Transfer';
      default: return method;
    }
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient mb-2">Order Management</h1>
        <p className="text-muted-foreground">Manage and track all orders across tenants</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{orderStats.total}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{orderStats.pending}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Loader2 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Processing</p>
              <p className="text-2xl font-bold">{orderStats.processing}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Delivered</p>
              <p className="text-2xl font-bold">{orderStats.delivered}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID, customer, or tenant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </GlassCard>

      {/* Orders Table */}
      <GlassCard className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-muted-foreground">No orders found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-mono text-sm">#{order.id.slice(0, 8)}</TableCell>
                  <TableCell>{order.userName}</TableCell>
                  <TableCell>{order.tenantName}</TableCell>
                  <TableCell className="font-semibold">Rp {order.total.toLocaleString('id-ID')}</TableCell>
                  <TableCell>{getPaymentMethodLabel(order.paymentMethod)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('id-ID', { 
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetail(order)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Select 
                        value={order.status} 
                        onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                      >
                        <SelectTrigger className="w-[130px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(status => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </GlassCard>

      {/* Order Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Order Details</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.id.slice(0, 8)}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Customer</span>
                  </div>
                  <p className="font-medium">{selectedOrder.userName}</p>
                </div>
                <div className="glass p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Store className="w-4 h-4" />
                    <span className="text-sm">Tenant</span>
                  </div>
                  <p className="font-medium">{selectedOrder.tenantName}</p>
                </div>
                <div className="glass p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm">Payment Method</span>
                  </div>
                  <p className="font-medium">{getPaymentMethodLabel(selectedOrder.paymentMethod)}</p>
                </div>
                <div className="glass p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Order Date</span>
                  </div>
                  <p className="font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold mb-3">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 glass p-3 rounded-xl">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Rp {item.product.price.toLocaleString('id-ID')} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="glass p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p>{selectedOrder.notes}</p>
                </div>
              )}

              {/* Total & Status */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-gradient">
                    Rp {selectedOrder.total.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
