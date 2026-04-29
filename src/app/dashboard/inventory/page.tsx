'use client';

import { useState, useEffect } from 'react';
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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { StoreInventory, StockJournalType } from '@/features/inventory/types';
import { Loader2 } from 'lucide-react';

export default function InventoryPage() {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'super_admin';

  const [activeTab, setActiveTab] = useState<'overview' | 'journal'>('overview');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  
  // Overview state
  const { inventories, isLoading: isLoadingInventories, refetch: refetchInventories } = useInventories({
    store_id: selectedStore === 'all' ? undefined : selectedStore,
  });

  // Journal state
  const [journalPage, setJournalPage] = useState(1);
  const [journalType, setJournalType] = useState<string>('all');
  const { journals, meta: journalMeta, isLoading: isLoadingJournals, refetch: refetchJournals } = useJournals({
    store_id: selectedStore === 'all' ? undefined : selectedStore,
    type: journalType === 'all' ? undefined : (journalType as StockJournalType),
    page: journalPage,
    limit: 10,
  });

  // Stores (for Super Admin)
  const { stores } = useStores();
  const { products } = useProducts();

  // Reset pagination when filter changes
  useEffect(() => {
    setJournalPage(1);
  }, [selectedStore, journalType]);

  const refreshAll = () => {
    refetchInventories();
    refetchJournals();
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
          className={`pb-2 px-1 text-sm font-medium ${activeTab === 'overview' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('overview')}
        >
          Stock Overview
        </button>
        <button
          className={`pb-2 px-1 text-sm font-medium ${activeTab === 'journal' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('journal')}
        >
          Stock Journal
        </button>
      </div>

      {activeTab === 'overview' && (
        <OverviewTab
          inventories={inventories}
          isLoading={isLoadingInventories}
          onSuccess={refreshAll}
          selectedStoreId={selectedStore === 'all' ? undefined : selectedStore}
        />
      )}

      {activeTab === 'journal' && (
        <JournalTab
          journals={journals}
          meta={journalMeta}
          isLoading={isLoadingJournals}
          journalType={journalType}
          setJournalType={setJournalType}
          page={journalPage}
          setPage={setJournalPage}
          stores={stores}
          products={products}
          selectedStoreId={selectedStore === 'all' ? undefined : selectedStore}
          isSuperAdmin={isSuperAdmin}
          onSuccess={refreshAll}
        />
      )}
    </div>
  );
}

function OverviewTab({
  inventories,
  isLoading,
  onSuccess,
  selectedStoreId
}: {
  inventories: StoreInventory[],
  isLoading: boolean,
  onSuccess: () => void,
  selectedStoreId?: string
}) {
  const { adjustStock, isLoading: isAdjusting } = useAdjustStock();
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  
  // Adjust stock form state
  const [qty, setQty] = useState('');
  const [type, setType] = useState<'addition' | 'reduction'>('addition');
  const [desc, setDesc] = useState('');

  const handleAdjustStock = async (e: React.FormEvent, inventory: StoreInventory) => {
    e.preventDefault();
    if (!qty || isNaN(parseInt(qty)) || parseInt(qty) <= 0) return;

    await adjustStock({
      store_id: inventory.store_id, // ensure store_id is correctly passed
      product_id: inventory.product_id,
      quantity: parseInt(qty),
      type,
      description: desc || undefined
    }, () => {
      setOpenDialog(null);
      setQty('');
      setDesc('');
      setType('addition');
      onSuccess();
    });
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;
  }

  return (
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
          {inventories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                No inventory found matching criteria.
              </TableCell>
            </TableRow>
          ) : (
            inventories.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium">{inv.store?.name || `Store #${inv.store_id}`}</TableCell>
                <TableCell>{inv.product?.name || `Product #${inv.product_id}`}</TableCell>
                <TableCell>
                  <Badge variant={inv.stock <= 5 ? "destructive" : "secondary"}>
                    {inv.stock}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog open={openDialog === inv.id} onOpenChange={(open) => {
                    setOpenDialog(open ? inv.id : null);
                    if (!open) {
                      setQty('');
                      setDesc('');
                      setType('addition');
                    }
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
                            <Select value={type} onValueChange={(v: 'addition'|'reduction') => setType(v)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="addition">Addition</SelectItem>
                                <SelectItem value="reduction">Reduction</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Quantity</Label>
                            <Input 
                              type="number" 
                              min="1" 
                              value={qty} 
                              onChange={(e) => setQty(e.target.value)}
                              required 
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Description / Note</Label>
                          <Input 
                            value={desc} 
                            onChange={(e) => setDesc(e.target.value)} 
                            placeholder="Reason for adjustment" 
                          />
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
  );
}

function JournalTab({ 
  journals, 
  meta, 
  isLoading,
  journalType,
  setJournalType,
  page,
  setPage,
  stores,
  products,
  selectedStoreId,
  isSuperAdmin,
  onSuccess
}: { 
  journals: any[], 
  meta: any, 
  isLoading: boolean,
  journalType: string,
  setJournalType: (v: string) => void,
  page: number,
  setPage: (p: number) => void,
  stores: any[],
  products: any[],
  selectedStoreId?: string,
  isSuperAdmin: boolean,
  onSuccess: () => void
}) {
  const { createJournal, isLoading: isCreating } = useCreateJournal();
  const [openDialog, setOpenDialog] = useState(false);
  
  // Create journal form state
  const [storeId, setStoreId] = useState('');
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState('');
  const [type, setType] = useState<StockJournalType>('addition');
  const [desc, setDesc] = useState('');

  const handleCreateJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !qty || isNaN(parseInt(qty)) || parseInt(qty) <= 0) return;

    const payload = {
      store_id: isSuperAdmin ? (storeId || undefined) : selectedStoreId,
      product_id: productId,
      quantity: parseInt(qty),
      type,
      description: desc || undefined
    };

    await createJournal(payload, () => {
      setOpenDialog(false);
      setStoreId('');
      setProductId('');
      setQty('');
      setDesc('');
      setType('addition');
      onSuccess();
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 w-full sm:w-auto">
        <Select value={journalType} onValueChange={setJournalType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
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

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>Create Journal Entry</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Journal Entry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateJournal} className="space-y-4 pt-4">
              {isSuperAdmin && (
                <div className="space-y-2">
                  <Label>Store</Label>
                  <Select value={storeId} onValueChange={setStoreId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id.toString()}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Product</Label>
                <Select value={productId} onValueChange={setProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={type} onValueChange={(v: StockJournalType) => setType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="addition">Addition</SelectItem>
                      <SelectItem value="reduction">Reduction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    value={qty} 
                    onChange={(e) => setQty(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description / Note</Label>
                <Input 
                  value={desc} 
                  onChange={(e) => setDesc(e.target.value)} 
                  placeholder="Reason for entry" 
                />
              </div>
              <Button type="submit" className="w-full" disabled={isCreating || !productId || !qty}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Entry
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
                  No journals found.
                </TableCell>
              </TableRow>
            ) : (
              journals.map((j) => {
                const storeInv = j.store_inventory || {};
                const isPositive = ['addition', 'mutation_in'].includes(j.type);
                
                return (
                  <TableRow key={j.id}>
                    <TableCell className="whitespace-nowrap">
                      {new Date(j.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>{storeInv.store?.name || `Store #${storeInv.store_id}`}</TableCell>
                    <TableCell>{storeInv.product?.name || `Product #${storeInv.product_id}`}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {j.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : '-'}{j.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {j.description || '-'}
                    </TableCell>
                  </TableRow>
                );
              })
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
