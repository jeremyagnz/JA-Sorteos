import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { CreateEventForm } from './CreateEventForm';

export const metadata: Metadata = {
  title: 'Crear Evento - Admin EnduroCommunity',
};

export default function NewEventPage() {
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
        <h1 className="text-2xl font-bold text-gray-900">Crear nuevo evento</h1>
        <p className="text-gray-500 text-sm mt-1">
          Completa la información para publicar un nuevo evento
        </p>
      </div>

      <Card>
        <CardBody>
          <CreateEventForm />
        </CardBody>
      </Card>
    </div>
  );
}
