'use client';

import { useMutations } from '@/features/mutations/hooks/useMutations';
import { useCreateMutation } from '@/features/mutations/hooks/useCreateMutation';
import { useStores } from '@/features/stores/hooks/useStores';
import useAuthStore from '@/stores/useAuthStore';
import { getInventoriesApi } from '@/features/inventory/api/getInventories.api';
import { ProductCombobox } from '@/components/ui/product-combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Pagination, PaginationContent, PaginationEllipsis,
  PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowRight, Search, ArrowUpDown } from 'lucide-react';
import { useState, useEffect } from 'react';

function buildPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total];
  if (current >= total - 3) return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total];
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
}

export default function StockMutationsPage() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'super_admin';

  if (!isSuperAdmin) {
    return <div className="p-8 text-center text-red-500">Access Denied</div>;
  }

  const { mutations, meta, isLoading, refetch, page, setPage, search, setSearch, sort, setSort } = useMutations();
  const { createMutation, isLoading: isCreating } = useCreateMutation();
  const { stores } = useStores();

  const [openDialog, setOpenDialog] = useState(false);
  const [sourceStore, setSourceStore] = useState('');
  const [destStore, setDestStore] = useState('');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [sourceStoreProducts, setSourceStoreProducts] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Fetch products available in the selected source store
  useEffect(() => {
    if (!sourceStore) {
      setSourceStoreProducts([]);
      setProduct('');
      return;
    }
    setIsLoadingProducts(true);
    getInventoriesApi({ store_id: sourceStore, limit: 9999 })
      .then(({ inventories }) => {
        const opts = inventories
          .filter((inv) => inv.stock > 0)
          .map((inv) => ({
            value: inv.product_id,
            label: `${inv.product?.name ?? inv.product_id} (Stock: ${inv.stock})`,
          }));
        setSourceStoreProducts(opts);
      })
      .finally(() => setIsLoadingProducts(false));
    setProduct('');
  }, [sourceStore]);

  const pageNumbers = buildPageNumbers(page, meta.totalPages);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceStore || !destStore || !product || !quantity) return;
    await createMutation({
      source_store_id: sourceStore,
      destination_store_id: destStore,
      product_id: product,
      quantity: parseInt(quantity),
    }, () => {
      setOpenDialog(false);
      setSourceStore(''); setDestStore(''); setProduct(''); setQuantity('');
      refetch();
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
                <Select value={sourceStore} onValueChange={(v) => { setSourceStore(v); setDestStore(''); }}>
                  <SelectTrigger><SelectValue placeholder="Select Source Store" /></SelectTrigger>
                  <SelectContent>
                    {stores.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Destination Store</Label>
                <Select value={destStore} onValueChange={setDestStore}>
                  <SelectTrigger><SelectValue placeholder="Select Destination Store" /></SelectTrigger>
                  <SelectContent>
                    {stores.filter((s) => s.id !== sourceStore).map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Product {!sourceStore && <span className="text-muted-foreground font-normal text-xs">— select a source store first</span>}</Label>
                <ProductCombobox
                  options={sourceStoreProducts}
                  value={product}
                  onValueChange={setProduct}
                  placeholder={isLoadingProducts ? 'Loading products...' : 'Search & select product...'}
                  searchPlaceholder="Search products..."
                  emptyMessage={sourceStore ? 'No products with stock in this store.' : 'Select a source store first.'}
                  disabled={!sourceStore || isLoadingProducts}
                />
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
              </div>

              <Button type="submit" className="w-full" disabled={isCreating || !sourceStore || !destStore || !product || !quantity}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Execute Transfer
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search by store */}
        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by store or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Sort by date */}
        <Select value={sort} onValueChange={(v: 'asc' | 'desc') => setSort(v)}>
          <SelectTrigger className="w-44">
            <ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest First</SelectItem>
            <SelectItem value="asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
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
                  {search ? `No stock mutations found for "${search}".` : 'No stock mutations found.'}
                </TableCell>
              </TableRow>
            ) : (
              mutations.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="whitespace-nowrap">{new Date(m.created_at).toLocaleString()}</TableCell>
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

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * meta.limit + 1}–{Math.min(page * meta.limit, meta.total)} of {meta.total} mutations
          </p>
          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => setPage(page - 1)} className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
              </PaginationItem>
              {pageNumbers.map((p, i) =>
                p === 'ellipsis' ? (
                  <PaginationItem key={`e-${i}`}><PaginationEllipsis /></PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink isActive={p === page} onClick={() => setPage(p as number)} className="cursor-pointer">{p}</PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext onClick={() => setPage(page + 1)} className={page === meta.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
