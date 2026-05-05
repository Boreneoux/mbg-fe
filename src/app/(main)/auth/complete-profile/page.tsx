import { AuthBackground } from '@/features/auth/components/AuthBackground';
import { CompleteProfileCard } from '@/features/auth/components/CompleteProfileCard';

export default function CompleteProfilePage() {
  return (
    <AuthBackground className="flex items-center justify-center">
      <CompleteProfileCard />
    </AuthBackground>
  );
}
