import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Edit, Eye, Calendar } from 'lucide-react';
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';
import { DeleteEventButton } from './DeleteEventButton';
import { Event } from '@/types';

export const metadata: Metadata = {
  title: 'Gestión de Eventos - Admin EnduroCommunity',
};

async function getAdminEvents(): Promise<Event[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/events?all=1`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json() as { events: Event[] };
    return data.events ?? [];
  } catch {
    return [];
  }
}

export default async function AdminEventsPage() {
  const events = await getAdminEvents();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestiona todos los eventos de la plataforma
          </p>
        </div>
        <Link href="/admin/events/new">
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4" />
            Nuevo evento
          </Button>
        </Link>
      </div>

      <Card>
        {events.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No hay eventos creados</p>
            <Link href="/admin/events/new" className="mt-3 inline-block">
              <Button variant="primary" size="sm">
                <Plus className="h-4 w-4" />
                Crear primer evento
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Evento
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide hidden sm:table-cell">
                    Categoría
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide hidden md:table-cell">
                    Fecha
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Estado
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 text-sm truncate max-w-[200px]">
                        {event.title}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-gray-600">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-gray-600">
                        {formatDate(event.event_date)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusColor(event.status)}>
                        {getStatusLabel(event.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {event.status === 'published' && (
                          <Link href={`/events/${event.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        )}
                        <Link href={`/admin/events/${event.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <DeleteEventButton
                          eventId={event.id}
                          eventTitle={event.title}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
