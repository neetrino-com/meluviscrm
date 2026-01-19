import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import DistrictsList from '@/components/districts/DistrictsList';

export default async function DistrictsPage() {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/apartments');
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Управление районами</h1>
      </div>
      <DistrictsList />
    </div>
  );
}
