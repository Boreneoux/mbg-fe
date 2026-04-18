'use client';

import { useState } from 'react';
import { MapPin, Phone, Pencil, Trash2, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UserAddress } from '../types';

type Props = {
  address: UserAddress;
  onEdit: (address: UserAddress) => void;
  onDelete: (id: number) => void;
  onSetPrimary: (id: number) => void;
};

export function AddressCard({ address, onEdit, onDelete, onSetPrimary }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const cityLabel = [address.city.type, address.city.name].filter(Boolean).join(' ');
  const regionLine = [address.district.name, cityLabel, address.province.name]
    .filter(Boolean)
    .join(', ');

  return (
    <>
      <div className="rounded-lg border bg-card p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {address.label && (
              <span className="font-semibold text-sm">{address.label}</span>
            )}
            {address.is_primary && (
              <Badge variant="default" className="text-xs">Utama</Badge>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(address)}
              aria-label="Edit alamat"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => setConfirmDelete(true)}
              aria-label="Hapus alamat"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Recipient */}
        <div>
          <p className="font-medium text-sm">{address.recipient_name}</p>
          <p className="flex items-center gap-1 text-muted-foreground text-sm mt-0.5">
            <Phone className="h-3 w-3" />
            {address.phone}
          </p>
        </div>

        {/* Address */}
        <div className="flex items-start gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
          <span>
            {address.address}
            {regionLine && `, ${regionLine}`}
            {address.postal_code && ` ${address.postal_code}`}
          </span>
        </div>

        {/* Set Primary */}
        {!address.is_primary && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => onSetPrimary(address.id)}
          >
            <Star className="h-3 w-3" />
            Jadikan Utama
          </Button>
        )}
      </div>

      {/* Delete Confirmation */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Alamat?</DialogTitle>
            <DialogDescription>
              Alamat {address.label ? `"${address.label}"` : 'ini'} akan dihapus permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmDelete(false);
                onDelete(address.id);
              }}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
