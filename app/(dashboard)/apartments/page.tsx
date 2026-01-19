import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ApartmentsList from '@/components/apartments/ApartmentsList';

export default async function ApartmentsPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <ApartmentsList />;
}
