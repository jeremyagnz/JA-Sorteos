import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Calendar, Users, ClipboardList, TrendingUp } from 'lucide-react';
import { getAllEvents } from '@/lib/db/blobs';

export const metadata: Metadata = {
  title: 'Dashboard - Admin EnduroCommunity',
};

export default async function AdminDashboard() {
  let totalEvents = 0;
  let publishedEvents = 0;
  try {
    const events = await getAllEvents();
    totalEvents = events.length;
    publishedEvents = events.filter((e) => e.status === 'published').length;
  } catch {
    // Blobs unavailable (e.g. local dev without netlify CLI)
  }

  const stats = [
    {
      label: 'Total Eventos',
      value: totalEvents,
      icon: Calendar,
      color: 'bg-blue-500',
      href: '/admin/events',
    },
    {
      label: 'Eventos Publicados',
      value: publishedEvents,
      icon: TrendingUp,
      color: 'bg-green-500',
      href: '/admin/events',
    },
    {
      label: 'Usuarios',
      value: '—',
      icon: Users,
      color: 'bg-purple-500',
      href: '/admin/users',
    },
    {
      label: 'Inscripciones',
      value: '—',
      icon: ClipboardList,
      color: 'bg-orange-500',
      href: '/admin/registrations',
    },
  ];

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

      {/* Quick links */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Accesos rápidos</h2>
        </CardHeader>
        <div className="px-6 py-4 flex flex-wrap gap-3">
          <Link
            href="/admin/events/new"
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            + Nuevo evento
          </Link>
          <Link
            href="/admin/events"
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Ver todos los eventos
          </Link>
        </div>
      </Card>
    </div>
  );
}
