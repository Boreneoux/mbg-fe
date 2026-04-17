import { HardHat } from 'lucide-react';

interface Props {
  title?: string;
  description?: string;
}

export function UnderConstruction({
  title = 'Sedang dalam Pengembangan',
  description = 'Halaman ini sedang kami bangun. Pantau terus — akan segera hadir!'
}: Props) {
  return (
    <div className="flex min-h-100 flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <HardHat className="h-8 w-8 text-primary" />
      </div>
      <div className="space-y-1.5 max-w-xs">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex gap-1.5">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-primary/30"
            style={{ opacity: 0.3 + i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}
