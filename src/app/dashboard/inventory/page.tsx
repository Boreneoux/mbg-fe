'use client';

import { useState } from 'react';
import { useInventories } from '@/features/inventory/hooks/useInventories';
import { useJournals } from '@/features/inventory/hooks/useJournals';
import { useAdjustStock } from '@/features/inventory/hooks/useAdjustStock';
import { useCreateJournal } from '@/features/inventory/hooks/useCreateJournal';
import { useStores } from '@/features/stores/hooks/useStores';
import { useProducts } from '@/features/products/hooks/useProducts';
import useAuthStore from '@/stores/useAuthStore';
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
import { ProductCombobox } from '@/components/ui/product-combobox';
import { StoreInventory, StockJournalType } from '@/features/inventory/types';
import { Loader2, Search } from 'lucide-react';
import { PaginationMeta } from '@/types/api';

function buildPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total];
  if (current >= total - 3) return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total];
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
}

export default function InventoryPage() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'super_admin';

  const [activeTab, setActiveTab] = useState<'overview' | 'journal'>('overview');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [journalType, setJournalType] = useState<string>('all');

  const storeId = selectedStore === 'all' ? undefined : selectedStore;
  const journalTypeFilter = journalType === 'all' ? undefined : (journalType as StockJournalType);

  const inventoriesHook = useInventories(storeId);
  const journalsHook = useJournals(storeId, journalTypeFilter);

  // Stores (for Super Admin) — load all, no pagination needed in selector
  const { stores } = useStores();
  const { products } = useProducts({ limit: 1000 });

  const refreshAll = () => {
    inventoriesHook.refetch();
    journalsHook.refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Inventory Management</h1>

        {isSuperAdmin && (
          <div className="w-full sm:w-64">
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger>
                <SelectValue placeholder="Select Store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id.toString()}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex gap-4 border-b">
        <button
          className={`pb-2 px-1 text-sm font-medium cursor-pointer ${activeTab === 'overview' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('overview')}
        >
          Stock Overview
        </button>
        <button
          className={`pb-2 px-1 text-sm font-medium cursor-pointer ${activeTab === 'journal' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('journal')}
        >
          Stock Journal
        </button>
      </div>

      {activeTab === 'overview' && (
        <OverviewTab
          inventoriesHook={inventoriesHook}
          onSuccess={refreshAll}
          selectedStoreId={storeId}
        />
      )}

      {activeTab === 'journal' && (
        <JournalTab
          journalsHook={journalsHook}
          journalType={journalType}
          setJournalType={setJournalType}
          stores={stores}
          products={products}
          selectedStoreId={storeId}
          isSuperAdmin={isSuperAdmin}
          onSuccess={refreshAll}
        />
      )}
    </div>
  );
}

// ─── Overview Tab ────────────────────────────────────────────────────────────

type InventoriesHook = ReturnType<typeof useInventories>;

function OverviewTab({
  inventoriesHook,
  onSuccess,
  selectedStoreId,
}: {
  inventoriesHook: InventoriesHook;
  onSuccess: () => void;
  selectedStoreId?: string;
}) {
  const { inventories, meta, isLoading, page, setPage, search, setSearch } = inventoriesHook;
  const { adjustStock, isLoading: isAdjusting } = useAdjustStock();
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [qty, setQty] = useState('');
  const [type, setType] = useState<'addition' | 'reduction'>('addition');
  const [desc, setDesc] = useState('');

  const pageNumbers = buildPageNumbers(page, meta.totalPages);

  const handleAdjustStock = async (e: React.FormEvent, inventory: StoreInventory) => {
    e.preventDefault();
    if (!qty || isNaN(parseInt(qty)) || parseInt(qty) <= 0) return;
    await adjustStock({
      store_id: inventory.store_id,
      product_id: inventory.product_id,
      quantity: parseInt(qty),
      type,
      description: desc || undefined,
    }, () => {
      setOpenDialog(null);
      setQty('');
      setDesc('');
      setType('addition');
      onSuccess();
    });
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by store or product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                </TableCell>
              </TableRow>
            ) : inventories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  {search
                    ? `No inventory found for "${search}".`
                    : 'No inventory found matching criteria.'}
                </TableCell>
              </TableRow>
            ) : (
              inventories.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.store?.name || `Store #${inv.store_id}`}</TableCell>
                  <TableCell>{inv.product?.name || `Product #${inv.product_id}`}</TableCell>
                  <TableCell>
                    <Badge variant={inv.stock <= 5 ? 'destructive' : 'secondary'}>
                      {inv.stock}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog open={openDialog === inv.id} onOpenChange={(open) => {
                      setOpenDialog(open ? inv.id : null);
                      if (!open) { setQty(''); setDesc(''); setType('addition'); }
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">Adjust Stock</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Adjust Stock for {inv.product?.name}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={(e) => handleAdjustStock(e, inv)} className="space-y-4 pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Operation</Label>
                              <Select value={type} onValueChange={(v: 'addition' | 'reduction') => setType(v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="addition">Addition</SelectItem>
                                  <SelectItem value="reduction">Reduction</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Quantity</Label>
                              <Input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} required />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Description / Note</Label>
                            <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Reason for adjustment" />
                          </div>
                          <Button type="submit" className="w-full" disabled={isAdjusting || !qty}>
                            {isAdjusting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm Adjustment
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
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
            Showing {(page - 1) * meta.limit + 1}–{Math.min(page * meta.limit, meta.total)} of {meta.total} items
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

// ─── Journal Tab ─────────────────────────────────────────────────────────────

type JournalsHook = ReturnType<typeof useJournals>;

function JournalTab({
  journalsHook,
  journalType,
  setJournalType,
  stores,
  products,
  selectedStoreId,
  isSuperAdmin,
  onSuccess,
}: {
  journalsHook: JournalsHook;
  journalType: string;
  setJournalType: (v: string) => void;
  stores: any[];
  products: any[];
  selectedStoreId?: string;
  isSuperAdmin: boolean;
  onSuccess: () => void;
}) {
  const { journals, meta, isLoading, page, setPage, search, setSearch } = journalsHook;
  const { createJournal, isLoading: isCreating } = useCreateJournal();
  const [openDialog, setOpenDialog] = useState(false);
  const [storeId, setStoreId] = useState('');
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState('');
  const [type, setType] = useState<StockJournalType>('addition');
  const [desc, setDesc] = useState('');

  const pageNumbers = buildPageNumbers(page, meta.totalPages);

  const handleCreateJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !qty || isNaN(parseInt(qty)) || parseInt(qty) <= 0) return;
    const payload = {
      store_id: isSuperAdmin ? (storeId || undefined) : selectedStoreId,
      product_id: productId,
      quantity: parseInt(qty),
      type,
      description: desc || undefined,
    };
    await createJournal(payload, () => {
      setOpenDialog(false);
      setStoreId(''); setProductId(''); setQty(''); setDesc(''); setType('addition');
      onSuccess();
    });
  };

  return (
    <div className="space-y-4">
      {/* Controls row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Type filter */}
        <Select value={journalType} onValueChange={setJournalType}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filter by Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="addition">Addition</SelectItem>
            <SelectItem value="reduction">Reduction</SelectItem>
            <SelectItem value="mutation_in">Mutation In</SelectItem>
            <SelectItem value="mutation_out">Mutation Out</SelectItem>
            <SelectItem value="order_deduction">Order Deduction</SelectItem>
            <SelectItem value="order_cancellation_return">Order Cancellation Return</SelectItem>
          </SelectContent>
        </Select>

        {/* Create journal */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>Create Journal Entry</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Create Journal Entry</DialogTitle></DialogHeader>
            <form onSubmit={handleCreateJournal} className="space-y-4 pt-4">
              {isSuperAdmin && (
                <div className="space-y-2">
                  <Label>Store</Label>
                  <Select value={storeId} onValueChange={setStoreId}>
                    <SelectTrigger><SelectValue placeholder="Select Store" /></SelectTrigger>
                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id.toString()}>{store.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Product</Label>
                <ProductCombobox
                  options={products.map((p) => ({ value: p.id.toString(), label: p.name }))}
                  value={productId}
                  onValueChange={setProductId}
                  placeholder="Search & select product..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={type} onValueChange={(v: StockJournalType) => setType(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="addition">Addition</SelectItem>
                      <SelectItem value="reduction">Reduction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description / Note</Label>
                <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Reason for entry" />
              </div>
              <Button type="submit" className="w-full" disabled={isCreating || !productId || !qty}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Entry
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                </TableCell>
              </TableRow>
            ) : journals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  {search ? `No journals found for "${search}".` : 'No journals found.'}
                </TableCell>
              </TableRow>
            ) : (
              journals.map((j) => {
                const storeInv = j.store_inventory || {};
                const isPositive = ['addition', 'mutation_in'].includes(j.type);
                return (
                  <TableRow key={j.id}>
                    <TableCell className="whitespace-nowrap">{new Date(j.created_at).toLocaleString()}</TableCell>
                    <TableCell>{storeInv.store?.name || `Store #${storeInv.store_id}`}</TableCell>
                    <TableCell>{storeInv.product?.name || `Product #${storeInv.product_id}`}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{j.type.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : '-'}{j.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">{j.description || '-'}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * meta.limit + 1}–{Math.min(page * meta.limit, meta.total)} of {meta.total} entries
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
