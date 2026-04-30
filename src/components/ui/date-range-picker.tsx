'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateRangePickerProps {
  /** YYYY-MM string */
  fromMonth?: string;
  /** YYYY-MM string */
  toMonth?: string;
  onFromChange: (val: string) => void;
  onToChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

function monthStrToDate(m?: string): Date | undefined {
  if (!m) return undefined;
  // "2024-01" → first day of that month
  return new Date(m + '-01');
}

function dateToMonthStr(d: Date): string {
  return format(d, 'yyyy-MM');
}

export function DateRangePicker({
  fromMonth,
  toMonth,
  onFromChange,
  onToChange,
  placeholder = 'Pick date range',
  disabled = false,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const from = monthStrToDate(fromMonth);
  const to = monthStrToDate(toMonth);

  const range: DateRange | undefined = from ? { from, to } : undefined;

  function handleSelect(r: DateRange | undefined) {
    if (r?.from) onFromChange(dateToMonthStr(r.from));
    if (r?.to) onToChange(dateToMonthStr(r.to));
    // close only when both ends selected
    if (r?.from && r?.to) setOpen(false);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    const now = new Date();
    const thisMonth = dateToMonthStr(now);
    const sixMonthsAgo = dateToMonthStr(new Date(now.getFullYear(), now.getMonth() - 5, 1));
    onFromChange(sixMonthsAgo);
    onToChange(thisMonth);
  }

  const label = from
    ? to && to.getTime() !== from.getTime()
      ? `${format(from, 'MMM yyyy')} – ${format(to, 'MMM yyyy')}`
      : format(from, 'MMM yyyy')
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'justify-start text-left font-normal min-w-[200px]',
            !from && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          <span className="flex-1 truncate">{label}</span>
          {from && (
            <X
              className="ml-auto h-4 w-4 text-muted-foreground hover:text-foreground"
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={from ?? new Date()}
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={2}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
