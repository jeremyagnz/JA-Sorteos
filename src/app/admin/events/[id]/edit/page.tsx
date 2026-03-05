import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Card, CardBody } from '@/components/ui/Card';
import { EditEventForm } from './EditEventForm';

interface EditEventPageProps {
  params: { id: string };
}

export const metadata: Metadata = {
  title: 'Editar Evento - Admin EnduroCommunity',
};

export default async function EditEventPage({ params }: EditEventPageProps) {
  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !event) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/events"
          className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 mb-4 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a eventos
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Editar evento</h1>
        <p className="text-gray-500 text-sm mt-1 truncate max-w-md">
          {event.title}
        </p>
      </div>

      <Card>
        <CardBody>
          <EditEventForm event={event} />
        </CardBody>
      </Card>
    </div>
  );
}
