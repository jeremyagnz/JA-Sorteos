import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { EditEventForm } from './EditEventForm';
import { Event } from '@/types';

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Editar Evento - Admin EnduroCommunity',
};

async function getEvent(id: string): Promise<Event | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/events/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json() as { event: Event };
    return data.event ?? null;
  } catch {
    return null;
  }
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
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
