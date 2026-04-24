import { ManagerProvider, ManagerShell } from '@/components/manager';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ManagerProvider>
      <ManagerShell>{children}</ManagerShell>
    </ManagerProvider>
  );
}

