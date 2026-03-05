import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllEvents } from '@/lib/db/blobs';
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

async function getEvents(params: SearchParams): Promise<Event[]> {
  try {
    let events = await getAllEvents();
    const now = new Date().toISOString();
    events = events.filter(
      (e) => e.status === 'published' && e.event_date >= now
    );
    if (params.category) {
      events = events.filter((e) => e.category === params.category);
    }
    if (params.difficulty) {
      events = events.filter((e) => e.difficulty === params.difficulty);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      events = events.filter((e) => e.title.toLowerCase().includes(q));
    }
    events = events.sort(
      (a, b) =>
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
    );
    return events as unknown as Event[];
  } catch {
    return [];
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category, difficulty, search } = await searchParams;
  const events = await getEvents({ category, difficulty, search });

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
      {events.length === 0 && (
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
