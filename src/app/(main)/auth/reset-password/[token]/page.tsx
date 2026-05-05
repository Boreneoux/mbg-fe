import { AuthBackground } from '@/features/auth/components/AuthBackground';
import { ResetPasswordCard } from '@/features/auth/components/ResetPasswordCard';

type Props = {
  params: Promise<{ token: string }>;
};

export default async function ResetPasswordPage({ params }: Props) {
  const { token } = await params;

  return (
    <AuthBackground className="flex items-center justify-center">
      <ResetPasswordCard token={token} />
    </AuthBackground>
  );
}
