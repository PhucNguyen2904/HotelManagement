import { AdminShell } from '@/components/admin/AdminShell';
import { ManagerProvider } from '@/components/manager';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ManagerProvider>
      <AdminShell>{children}</AdminShell>
    </ManagerProvider>
  );
}

