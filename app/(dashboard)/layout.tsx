import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/layout/LogoutButton';
import SidebarNav from '@/components/layout/SidebarNav';
import { 
  Home, 
  LayoutDashboard, 
  MapPin, 
  Building2 
} from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const isAdmin = session.user.role === 'ADMIN';

  const navItems = [
    { href: '/apartments', label: 'Apartments', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(isAdmin
      ? [
          { href: '/admin/districts', label: 'Districts', icon: MapPin },
          { href: '/admin/buildings', label: 'Buildings', icon: Building2 },
        ]
      : []),
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-gray-200 px-6">
            <h1 className="text-xl font-bold text-gray-900">Meluvis CRM</h1>
          </div>

          {/* Navigation */}
          <SidebarNav navItems={navItems} />

          {/* User info */}
          <div className="border-t border-gray-200 p-4">
            <div className="mb-3 rounded-lg bg-gray-50 px-3 py-2.5">
              <p className="text-xs font-medium text-gray-500">Logged in as</p>
              <p className="text-sm font-semibold text-gray-900">{session.user.email}</p>
              <p className="text-xs text-gray-500 capitalize">{session.user.role.toLowerCase()}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-64 flex-1">
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
