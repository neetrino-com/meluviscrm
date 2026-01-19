import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ApartmentCard from '@/components/apartments/ApartmentCard';

export default async function ApartmentPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const id = parseInt(params.id);

  if (isNaN(id)) {
    redirect('/apartments');
  }

  return <ApartmentCard apartmentId={id} />;
}
