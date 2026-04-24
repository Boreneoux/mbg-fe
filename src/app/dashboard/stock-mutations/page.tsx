'use client';

import { useState } from 'react';
import { useMutations } from '@/features/mutations/hooks/useMutations';
import { useCreateMutation } from '@/features/mutations/hooks/useCreateMutation';
import { useStores } from '@/features/stores/hooks/useStores';
import { useProducts } from '@/features/products/hooks/useProducts';
import useAuthStore from '@/stores/useAuthStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StockMutationsPage() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'super_admin';
  const router = useRouter();

  if (!isSuperAdmin) {
    // Basic protection, layout middleware usually handles this but just in case
    return <div className="p-8 text-center text-red-500">Access Denied</div>;
  }

  const [page, setPage] = useState(1);
  const { mutations, meta, isLoading, refetch } = useMutations({ page, limit: 10 });
  const { createMutation, isLoading: isCreating } = useCreateMutation();
  const { stores } = useStores();
  const { products } = useProducts();

  const [openDialog, setOpenDialog] = useState(false);
  const [sourceStore, setSourceStore] = useState('');
  const [destStore, setDestStore] = useState('');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceStore || !destStore || !product || !quantity) return;

    await createMutation({
      source_store_id: parseInt(sourceStore),
      destination_store_id: parseInt(destStore),
      product_id: parseInt(product),
      quantity: parseInt(quantity)
    }, () => {
      setOpenDialog(false);
      setSourceStore('');
      setDestStore('');
      setProduct('');
      setQuantity('');
      refetch();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Stock Mutations</h1>
          <p className="text-gray-600">Transfer inventory between stores</p>
        </div>
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>New Mutation</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Transfer Stock</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Source Store</Label>
                <Select value={sourceStore} onValueChange={setSourceStore}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Source Store" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Destination Store</Label>
                <Select value={destStore} onValueChange={setDestStore}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Destination Store" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.filter(s => s.id.toString() !== sourceStore).map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Product</Label>
                <Select value={product} onValueChange={setProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input 
                  type="number" 
                  min="1" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)}
                  required 
                />
              </div>

              <Button type="submit" className="w-full" disabled={isCreating || !sourceStore || !destStore || !product || !quantity}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Execute Transfer
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Transfer Route</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                </TableCell>
              </TableRow>
            ) : mutations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No stock mutations found.
                </TableCell>
              </TableRow>
            ) : (
              mutations.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(m.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">{m.product?.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-700">{m.source_store?.name}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-blue-700">{m.destination_store?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{m.quantity}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 capitalize">
                      {m.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {meta && meta.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
                className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {Array.from({ length: meta.totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  href="#" 
                  isActive={page === i + 1}
                  onClick={(e) => { e.preventDefault(); setPage(i + 1); }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => { e.preventDefault(); if (page < meta.totalPages) setPage(page + 1); }}
                className={page >= meta.totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
