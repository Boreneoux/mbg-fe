'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerSingleProps {
  value?: string | null;            // ISO date string or null
  onChange: (val: string | null) => void;
  placeholder?: string;
  optional?: boolean;
  disabled?: boolean;
  className?: string;
}

export function DatePickerSingle({
  value,
  onChange,
  placeholder = 'Pick a date',
  optional = false,
  disabled = false,
  className,
}: DatePickerSingleProps) {
  const [open, setOpen] = React.useState(false);

  const selected = value ? new Date(value) : undefined;

  function handleSelect(day: Date | undefined) {
    if (!day) {
      onChange(null);
      setOpen(false);
      return;
    }
    // Store as YYYY-MM-DD (date only, no time)
    const iso = format(day, 'yyyy-MM-dd');
    onChange(iso);
    setOpen(false);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange(null);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !selected && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          <span className="flex-1 truncate">
            {selected ? format(selected, 'PPP') : placeholder}
          </span>
          {optional && selected && (
            <X
              className="ml-auto h-4 w-4 text-muted-foreground hover:text-foreground"
              onClick={handleClear}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
