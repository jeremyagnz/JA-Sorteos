'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EventForm } from '@/components/events/EventForm';
import { Event, EventFormData } from '@/types';

interface EditEventFormProps {
  event: Event;
}

export function EditEventForm({ event }: EditEventFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: EventFormData) => {
    setIsLoading(true);
    try {
      const token =
        window.netlifyIdentity?.currentUser()?.token?.access_token ?? '';

      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          location: data.location,
          event_date: data.event_date,
          end_date: data.end_date || null,
          category: data.category,
          difficulty: data.difficulty,
          max_participants: data.max_participants
            ? parseInt(data.max_participants)
            : null,
          price: parseFloat(data.price) || 0,
          image_url: event.image_url,
          status: data.status,
        }),
      });

      if (!res.ok) {
        const err = await res.json() as { error?: string };
        return { error: err.error || 'Error al actualizar el evento' };
      }

      router.push('/admin/events');
      router.refresh();
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EventForm
      initialData={{
        ...event,
        max_participants: event.max_participants?.toString() || '',
        price: event.price?.toString() || '0',
        end_date: event.end_date || '',
      }}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
}
