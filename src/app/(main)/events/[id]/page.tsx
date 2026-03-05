import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Calendar,
  MapPin,
  Users,
  Tag,
  Euro,
  ArrowLeft,
  Clock,
  User,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/Badge';
import { RegisterButton } from '@/components/events/RegisterButton';
import {
  formatDateTime,
  formatPrice,
  getDifficultyColor,
  getDifficultyLabel,
} from '@/lib/utils';

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from('events')
    .select('title, description')
    .eq('id', id)
    .single();

  if (!event) return { title: 'Evento no encontrado' };

  return {
    title: `${event.title} - EnduroCommunity`,
    description: event.description?.slice(0, 160),
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: eventData }, { data: { user } }] = await Promise.all([
    supabase
      .from('events')
      .select(
        `
        *,
        organizer:profiles!events_organizer_id_fkey(id, full_name, email),
        registrations_count:registrations(count)
      `
      )
      .eq('id', id)
      .single(),
    supabase.auth.getUser(),
  ]);

  if (!eventData || eventData.status !== 'published') {
    notFound();
  }

  const registrationsCount =
    Array.isArray(eventData.registrations_count)
      ? (eventData.registrations_count[0] as { count: number })?.count || 0
      : 0;

  let isRegistered = false;
  if (user) {
    const { data: reg } = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', id)
      .eq('user_id', user.id)
      .single();
    isRegistered = !!reg;
  }

  const spotsLeft =
    eventData.max_participants !== null
      ? eventData.max_participants - registrationsCount
      : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href="/"
        className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 mb-6 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a eventos
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
            {eventData.image_url ? (
              <Image
                src={eventData.image_url}
                alt={eventData.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Calendar className="h-20 w-20 text-gray-600" />
              </div>
            )}
          </div>

          {/* Title & Badges */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className="bg-orange-100 text-orange-700">
                <Tag className="h-3 w-3 mr-1" />
                {eventData.category}
              </Badge>
              <Badge className={getDifficultyColor(eventData.difficulty)}>
                {getDifficultyLabel(eventData.difficulty)}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {eventData.title}
            </h1>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Descripción
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {eventData.description}
              </p>
            </div>
          </div>

          {/* Organizer */}
          {eventData.organizer && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="bg-orange-100 rounded-full p-2">
                <User className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Organizado por</p>
                <p className="font-medium text-gray-900">
                  {eventData.organizer.full_name || eventData.organizer.email}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Detalles del evento</h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Fecha de inicio</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateTime(eventData.event_date)}
                  </p>
                </div>
              </div>

              {eventData.end_date && (
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Fecha de fin</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDateTime(eventData.end_date)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Ubicación</p>
                  <p className="text-sm font-medium text-gray-900">
                    {eventData.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Euro className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Precio de inscripción</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(eventData.price)}
                  </p>
                </div>
              </div>

              {eventData.max_participants !== null && (
                <div className="flex items-start gap-3">
                  <Users className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Plazas</p>
                    <p className="text-sm font-medium text-gray-900">
                      {registrationsCount} / {eventData.max_participants} inscritos
                    </p>
                    {spotsLeft !== null && spotsLeft > 0 && (
                      <p className="text-xs text-green-600">
                        {spotsLeft} plazas disponibles
                      </p>
                    )}
                    {isFull && (
                      <p className="text-xs text-red-600 font-medium">
                        Evento completo
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-gray-100">
              <RegisterButton
                eventId={id}
                isRegistered={isRegistered}
                isFull={isFull}
                userId={user?.id || null}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
