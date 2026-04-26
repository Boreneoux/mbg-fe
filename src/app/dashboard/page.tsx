'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SalesReportSection from '@/features/dashboard/components/SalesReportSection';
import StockReportSection from '@/features/dashboard/components/StockReportSection';
import { useReportOptions } from '@/features/dashboard/useReportOptions';
import useAuthStore from '@/stores/useAuthStore';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { stores, categories, products, isLoading } = useReportOptions();
  const [activeTab, setActiveTab] = useState<'sales' | 'stock'>('sales');

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Reports Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Monitor sales performance and stock movement from a single admin workspace.
        </p>
      </div>

      <div className="inline-flex rounded-xl border bg-muted/30 p-1">
        <Button
          type="button"
          variant="ghost"
          className={cn(
            'rounded-lg px-4',
            activeTab === 'sales' && 'bg-background shadow-sm hover:bg-background'
          )}
          onClick={() => setActiveTab('sales')}
        >
          Sales Report
        </Button>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            'rounded-lg px-4',
            activeTab === 'stock' && 'bg-background shadow-sm hover:bg-background'
          )}
          onClick={() => setActiveTab('stock')}
        >
          Stock Report
        </Button>
      </div>

      {activeTab === 'sales' ? (
        <SalesReportSection
          role={user.role}
          stores={stores}
          categories={categories}
          products={products}
          isLoadingOptions={isLoading}
        />
      ) : (
        <StockReportSection
          role={user.role}
          stores={stores}
          categories={categories}
          products={products}
          isLoadingOptions={isLoading}
        />
      )}
    </div>
  );
}
