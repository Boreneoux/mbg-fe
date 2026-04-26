'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type MonthlyBarChartItem = {
  label: string;
  value: number;
  secondaryValue: string;
};

type MonthlyBarChartProps = {
  items: MonthlyBarChartItem[];
  title: string;
  description: string;
  emptyMessage: string;
};

export default function MonthlyBarChart({
  items,
  title,
  description,
  emptyMessage,
}: MonthlyBarChartProps) {
  const maxValue = items.reduce((highestValue, item) => {
    return item.value > highestValue ? item.value : highestValue;
  }, 0);

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex h-72 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <div className="grid min-h-72 grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {items.map((item) => {
              const height = maxValue === 0 ? 0 : Math.max((item.value / maxValue) * 100, 6);

              return (
                <div key={item.label} className="flex min-w-0 flex-col gap-3">
                  <div className="flex h-48 items-end rounded-xl bg-muted/40 px-3 py-4">
                    <div
                      className={cn(
                        'w-full rounded-lg bg-primary transition-all',
                        item.value === 0 && 'bg-primary/30'
                      )}
                      style={{ height: `${height}%` }}
                      title={`${item.label}: ${item.secondaryValue}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.secondaryValue}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
