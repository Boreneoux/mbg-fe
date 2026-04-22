'use client';

import React from 'react';
import { useParams } from 'next/navigation';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Order Details</h1>
      <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
        <p className="text-muted-foreground mb-4">
          This is a placeholder for the store admin order details page.
        </p>
        <p className="font-semibold">
          Order ID: {id}
        </p>
      </div>
    </div>
  );
}
