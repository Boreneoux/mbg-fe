import { AuthBackground } from '@/features/auth/components/AuthBackground';
import { LoginBrandPanel } from '@/features/auth/components/LoginBrandPanel';
import { LoginFormCard } from '@/features/auth/components/LoginFormCard';

export default function LoginPage() {
  return (
    <AuthBackground>
      <div className="flex min-h-screen">
        <LoginBrandPanel />
        <LoginFormCard />
      </div>
    </AuthBackground>
  );
}
