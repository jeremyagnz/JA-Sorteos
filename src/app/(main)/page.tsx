import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { EventCard } from '@/components/events/EventCard';
import { Event } from '@/types';
import { Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Eventos - EnduroCommunity',
};

interface SearchParams {
  category?: string;
  difficulty?: string;
  search?: string;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category, difficulty, search } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('events')
    .select(
      `
      *,
      organizer:profiles!events_organizer_id_fkey(id, full_name, email),
      registrations_count:registrations(count)
    `
    )
    .eq('status', 'published')
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true });

  if (category) {
    query = query.eq('category', category);
  }

  if (difficulty) {
    query = query.eq('difficulty', difficulty);
  }

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  const { data: eventsData, error } = await query;

  const events: Event[] = (eventsData || []).map((e: Record<string, unknown>) => ({
    ...e,
    registrations_count: Array.isArray(e.registrations_count)
      ? (e.registrations_count[0] as { count: number })?.count || 0
      : 0,
  })) as Event[];

  const categories = [
    'Enduro', 'Motocross', 'Trial', 'Cross Country', 'Rally',
    'Supermoto', 'Endurance', 'Hard Enduro',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          🏍️ Próximos eventos deportivos
        </h1>
        <p className="text-gray-300">
          Encuentra y participa en los mejores eventos de enduro, motocross, trial y más.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          href="/"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !category
              ? 'bg-orange-500 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300'
          }`}
        >
          Todos
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/?category=${encodeURIComponent(cat)}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300'
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Events Grid */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Error al cargar los eventos. Por favor, inténtalo de nuevo.
        </div>
      )}

      {!error && events.length === 0 && (
        <div className="text-center py-16">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No hay eventos disponibles
          </h2>
          <p className="text-gray-500">
            {category || search
              ? 'No se encontraron eventos con estos filtros'
              : 'Próximamente habrá nuevos eventos'}
          </p>
        </div>
      )}

      {events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
