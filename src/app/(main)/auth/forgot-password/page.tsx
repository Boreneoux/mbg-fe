import { AuthBackground } from '@/features/auth/components/AuthBackground';
import { ForgotPasswordCard } from '@/features/auth/components/ForgotPasswordCard';

export default function ForgotPasswordPage() {
  return (
    <AuthBackground className="flex items-center justify-center">
      <ForgotPasswordCard />
    </AuthBackground>
  );
}
