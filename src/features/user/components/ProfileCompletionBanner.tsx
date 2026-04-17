'use client';

import { CheckCircle2, Circle, X } from 'lucide-react';
import { useState } from 'react';
import { UserProfile } from '../types';

interface Step {
  key: string;
  label: string;
  done: boolean;
}

function buildSteps(profile: UserProfile): Step[] {
  return [
    {
      key: 'photo',
      label: 'Tambah foto profil',
      done: !!profile.profile_image,
    },
    {
      key: 'phone',
      label: 'Tambah nomor telepon',
      done: !!profile.phone,
    },
    {
      key: 'verified',
      label: 'Verifikasi email kamu',
      done: profile.is_verified,
    },
  ];
}

interface Props {
  profile: UserProfile;
}

export function ProfileCompletionBanner({ profile }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const steps = buildSteps(profile);
  const doneCount = steps.filter((s) => s.done).length;
  const pct = Math.round((doneCount / steps.length) * 100);

  if (dismissed || doneCount === steps.length) return null;

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            Lengkapi profilmu
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {doneCount}/{steps.length} selesai
            </span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Profil lengkap membangun kepercayaan dan membuka semua fitur.
          </p>
        </div>
        <button
          type="button"
          aria-label="Tutup"
          onClick={() => setDismissed(true)}
          className="shrink-0 cursor-pointer rounded-md p-0.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 h-1.5 w-full rounded-full bg-primary/15 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ul className="mt-3 space-y-1.5">
        {steps.map((step) => (
          <li key={step.key} className="flex items-center gap-2 text-xs">
            {step.done ? (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
            ) : (
              <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
            )}
            <span className={step.done ? 'text-muted-foreground line-through' : 'text-foreground'}>
              {step.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
