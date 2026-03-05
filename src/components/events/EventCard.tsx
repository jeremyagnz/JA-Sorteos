import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, Tag, ChevronRight } from 'lucide-react';
import { Event } from '@/types';
import { formatDate, formatPrice, getDifficultyColor, getDifficultyLabel } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const spotsLeft =
    event.max_participants !== null
      ? event.max_participants - (event.registrations_count || 0)
      : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  return (
    <Link href={`/events/${event.id}`} className="group block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
          {event.image_url ? (
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-600 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm opacity-50">Sin imagen</p>
              </div>
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-orange-500 text-white shadow-sm">
              <Tag className="h-3 w-3 mr-1" />
              {event.category}
            </Badge>
          </div>
          {/* Price badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-gray-900 text-white shadow-sm">
              {formatPrice(event.price)}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-base leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
              {event.title}
            </h3>
            <Badge className={getDifficultyColor(event.difficulty)}>
              {getDifficultyLabel(event.difficulty)}
            </Badge>
          </div>

          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Calendar className="h-3.5 w-3.5 text-orange-500 shrink-0" />
              <span>{formatDate(event.event_date)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <MapPin className="h-3.5 w-3.5 text-orange-500 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
            {event.max_participants !== null && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Users className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                <span>
                  {isFull ? (
                    <span className="text-red-600 font-medium">Completo</span>
                  ) : (
                    <>
                      <span className="font-medium">{spotsLeft}</span> plazas disponibles
                    </>
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 truncate max-w-[60%]">
              {event.organizer?.full_name || 'Organizador'}
            </p>
            <span className="flex items-center gap-1 text-orange-600 text-xs font-medium">
              Ver más <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
