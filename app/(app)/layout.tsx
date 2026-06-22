import { AuthProvider } from "@/app/_components/AuthProvider";
import { AppShell } from "@/app/_components/AppShell";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
