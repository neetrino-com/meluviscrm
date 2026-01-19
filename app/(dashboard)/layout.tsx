import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/components/layout/LogoutButton';

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
    { href: '/apartments', label: 'Apartments', icon: '🏠' },
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    ...(isAdmin
      ? [
          { href: '/admin/districts', label: 'Districts', icon: '📍' },
          { href: '/admin/buildings', label: 'Buildings', icon: '🏢' },
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
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User info */}
          <div className="border-t border-gray-200 p-4">
            <div className="mb-3 rounded-lg bg-gray-50 px-3 py-2">
              <p className="text-xs font-medium text-gray-500">Logged in as</p>
              <p className="text-sm font-semibold text-gray-900">{session.user.email}</p>
              <p className="text-xs text-gray-500">{session.user.role}</p>
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
