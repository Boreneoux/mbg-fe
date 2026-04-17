'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { UserProfile } from '../types';
import { useUpdateProfile } from '../hooks/useUpdateProfile';

const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

interface Props {
  profile: UserProfile;
  onUpdated: (updated: UserProfile) => void;
}

function getInitials(profile: UserProfile) {
  const first = profile.first_name?.[0] ?? '';
  const last = profile.last_name?.[0] ?? '';
  return (first + last).toUpperCase() || profile.email[0].toUpperCase();
}

export function ProfilePhotoUpload({ profile, onUpdated }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { updateProfile, isSubmitting } = useUpdateProfile(onUpdated);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Hanya file JPG, JPEG, PNG, atau GIF yang diizinkan');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error('Ukuran foto maksimal 1 MB');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    updateProfile({ photo: file }).catch(() => {
      setPreview(null);
    });

    e.target.value = '';
  }

  function handleRemove() {
    setPreview(null);
    toast.info('Unggah foto baru untuk mengganti yang lama');
  }

  const avatarSrc = preview ?? profile.profile_image ?? undefined;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        <Avatar className="h-24 w-24 ring-4 ring-white shadow-md">
          <AvatarImage src={avatarSrc} alt={profile.first_name} />
          <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
            {getInitials(profile)}
          </AvatarFallback>
        </Avatar>

        <button
          type="button"
          aria-label="Ganti foto profil"
          className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
          onClick={() => inputRef.current?.click()}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 text-white animate-spin" />
          ) : (
            <Camera className="h-5 w-5 text-white" />
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() => inputRef.current?.click()}
          disabled={isSubmitting}
        >
          <Camera className="h-3.5 w-3.5" />
          {isSubmitting ? 'Mengunggah…' : 'Ganti Foto'}
        </Button>
        {(preview || profile.profile_image) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-destructive"
            onClick={handleRemove}
            disabled={isSubmitting}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Hapus
          </Button>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground">JPG, JPEG, PNG, GIF · maks. 1 MB</p>
    </div>
  );
}
