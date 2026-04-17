'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useProfile } from '@/features/user/hooks/useProfile';
import { ProfilePhotoUpload } from '@/features/user/components/ProfilePhotoUpload';
import { PersonalInfoForm } from '@/features/user/components/PersonalInfoForm';
import { ChangePasswordForm } from '@/features/user/components/ChangePasswordForm';
import { ProfileErrorState } from '@/features/user/components/ProfileErrorState';
import { ProfileCompletionBanner } from '@/features/user/components/ProfileCompletionBanner';

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white border border-border shadow-sm p-6 flex flex-col items-center gap-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="rounded-2xl bg-white border border-border shadow-sm p-6 space-y-4">
        <Skeleton className="h-5 w-40" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { profile, setProfile, isLoading, error, refetch } = useProfile();

  if (isLoading) return <ProfileSkeleton />;

  if (error || !profile) {
    return <ProfileErrorState message={error ?? undefined} onRetry={refetch} />;
  }

  return (
    <div className="space-y-5">
      {/* ── Completion nudge ───────────────────────────────── */}
      <ProfileCompletionBanner profile={profile} />

      {/* ── Photo card ─────────────────────────────────────── */}
      <section className="rounded-2xl bg-white border border-border shadow-sm">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Foto Profil</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Foto membantumu dikenali lebih mudah
          </p>
        </div>
        <div className="flex justify-center px-6 py-6">
          <ProfilePhotoUpload profile={profile} onUpdated={setProfile} />
        </div>
      </section>

      {/* ── Personal info card ─────────────────────────────── */}
      <section className="rounded-2xl bg-white border border-border shadow-sm">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Informasi Pribadi</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Perbarui nama, nomor telepon, dan email kamu
          </p>
        </div>
        <div className="px-6 py-6">
          <PersonalInfoForm profile={profile} onUpdated={setProfile} />
        </div>
      </section>

      {/* ── Security card ──────────────────────────────────── */}
      <section className="rounded-2xl bg-white border border-border shadow-sm">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Keamanan</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ubah password akun kamu
          </p>
        </div>
        <div className="px-6 py-6">
          <ChangePasswordForm />
        </div>
      </section>

      {/* ── Account info (read-only) ────────────────────────── */}
      <section className="rounded-2xl bg-white border border-border shadow-sm">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Info Akun</h2>
        </div>
        <div className="px-6 py-5 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Kode Referral</span>
            <span className="font-mono font-medium text-foreground">
              {profile.referral_code ?? '—'}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Bergabung Sejak</span>
            <span className="text-foreground">
              {new Date(profile.created_at).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
