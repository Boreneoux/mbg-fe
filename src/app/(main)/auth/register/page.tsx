import { AuthBackground } from '@/features/auth/components/AuthBackground';
import { RegisterBrandPanel } from '@/features/auth/components/RegisterBrandPanel';
import { RegisterFormCard } from '@/features/auth/components/RegisterFormCard';

export default function RegisterPage() {
  return (
    <AuthBackground>
      <div className="flex min-h-screen">
        <RegisterBrandPanel />
        <RegisterFormCard />
      </div>
    </AuthBackground>
  );
}
