import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ApartmentsList from '@/components/apartments/ApartmentsList';

export default async function ApartmentsPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Apartments</h1>
      </div>
      <ApartmentsList />
    </div>
  );
}
