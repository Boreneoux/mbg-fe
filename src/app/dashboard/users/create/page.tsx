import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CreateUserForm } from '@/features/user-management/components/CreateUserForm';

export default function CreateUserPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Create Store Admin</h1>
        <p className="text-muted-foreground">
          An invitation email will be sent so the admin can set up their own password.
        </p>
      </div>

      <CreateUserForm />
    </div>
  );
}
