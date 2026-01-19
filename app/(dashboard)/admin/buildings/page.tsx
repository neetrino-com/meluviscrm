import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import BuildingsList from '@/components/buildings/BuildingsList';

export default async function BuildingsPage() {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/apartments');
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Управление зданиями</h1>
      </div>
      <BuildingsList />
    </div>
  );
}
