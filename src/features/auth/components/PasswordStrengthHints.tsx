import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const RULES = [
  { label: 'Minimal 8 karakter', test: (v: string) => v.length >= 8 },
  { label: 'Huruf besar (A–Z)', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'Huruf kecil (a–z)', test: (v: string) => /[a-z]/.test(v) },
  { label: 'Angka (0–9)', test: (v: string) => /\d/.test(v) },
];

interface PasswordStrengthHintsProps {
  value: string;
}

export function PasswordStrengthHints({ value }: PasswordStrengthHintsProps) {
  if (!value) return null;

  return (
    <ul className="mt-2 space-y-1">
      {RULES.map(({ label, test }) => {
        const met = test(value);
        return (
          <li key={label} className="flex items-center gap-2">
            {met ? (
              <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
            )}
            <span
              className={cn(
                'text-xs transition-colors duration-200',
                met ? 'text-green-600 font-medium' : 'text-muted-foreground',
              )}>
              {label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
