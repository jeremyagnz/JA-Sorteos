import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ClipboardList } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Inscripciones - Admin EnduroCommunity',
};

export default async function AdminRegistrationsPage() {
  const supabase = await createClient();

  const { data: registrations, error } = await supabase
    .from('registrations')
    .select(
      `
      *,
      event:events(id, title, event_date, category),
      user:profiles(id, full_name, email)
    `
    )
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inscripciones</h1>
        <p className="text-gray-500 text-sm mt-1">
          Todas las inscripciones a eventos
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          Error al cargar las inscripciones
        </div>
      )}

      <Card>
        {!registrations || registrations.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No hay inscripciones aún</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Usuario
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide hidden sm:table-cell">
                    Evento
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide hidden md:table-cell">
                    Fecha Evento
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Estado
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide hidden lg:table-cell">
                    Inscrito el
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {reg.user?.full_name || 'Sin nombre'}
                      </p>
                      <p className="text-xs text-gray-500">{reg.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-sm text-gray-900 truncate max-w-[180px]">
                        {reg.event?.title}
                      </p>
                      <p className="text-xs text-gray-500">{reg.event?.category}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-gray-600">
                        {reg.event?.event_date ? formatDate(reg.event.event_date) : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          reg.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : reg.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }
                      >
                        {reg.status === 'confirmed'
                          ? 'Confirmado'
                          : reg.status === 'cancelled'
                          ? 'Cancelado'
                          : 'Pendiente'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-gray-600">
                        {formatDate(reg.created_at)}
                      </span>
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
