import { ReactNode } from 'react';
import { AuthProvider } from '@/app/_components/AuthProvider';
import { AppShell } from '@/app/_components/AppShell';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
