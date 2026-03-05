import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Calendar, Users, ClipboardList, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard - Admin EnduroCommunity',
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalEvents },
    { count: publishedEvents },
    { count: totalUsers },
    { count: totalRegistrations },
  ] = await Promise.all([
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('registrations').select('*', { count: 'exact', head: true }),
  ]);

  const stats = [
    {
      label: 'Total Eventos',
      value: totalEvents || 0,
      icon: Calendar,
      color: 'bg-blue-500',
      href: '/admin/events',
    },
    {
      label: 'Eventos Publicados',
      value: publishedEvents || 0,
      icon: TrendingUp,
      color: 'bg-green-500',
      href: '/admin/events',
    },
    {
      label: 'Usuarios',
      value: totalUsers || 0,
      icon: Users,
      color: 'bg-purple-500',
      href: '/admin/users',
    },
    {
      label: 'Inscripciones',
      value: totalRegistrations || 0,
      icon: ClipboardList,
      color: 'bg-orange-500',
      href: '/admin/registrations',
    },
  ];

  // Recent events
  const { data: recentEvents } = await supabase
    .from('events')
    .select('id, title, status, event_date, category')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Resumen general de la plataforma
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardBody className="flex items-center gap-3 p-4">
                <div className={`${stat.color} rounded-lg p-2.5 shrink-0`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Eventos recientes</h2>
          <Link
            href="/admin/events"
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Ver todos
          </Link>
        </CardHeader>
        <div className="divide-y divide-gray-100">
          {recentEvents && recentEvents.length > 0 ? (
            recentEvents.map((event) => (
              <div
                key={event.id}
                className="px-6 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-500">{event.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      event.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : event.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {event.status === 'published'
                      ? 'Publicado'
                      : event.status === 'cancelled'
                      ? 'Cancelado'
                      : 'Borrador'}
                  </span>
                  <Link
                    href={`/admin/events/${event.id}/edit`}
                    className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500 text-sm">
              No hay eventos aún.{' '}
              <Link
                href="/admin/events/new"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Crear el primero
              </Link>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
