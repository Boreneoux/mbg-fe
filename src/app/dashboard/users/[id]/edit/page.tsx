import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { EditUserForm } from '@/features/user-management/components/EditUserForm';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditUserPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/users"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to User Management
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
        <p className="text-muted-foreground">
          Update user information and store assignments.
        </p>
      </div>

      <EditUserForm userId={id} />
    </div>
  );
}
