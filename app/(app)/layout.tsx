import { AuthProvider } from '@/app/_components/AuthProvider';
import AppShell from '@/app/_components/AppShell';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
