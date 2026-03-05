'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
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
      const supabase = createClient();

      let imageUrl = event.image_url;

      // Upload new image if provided
      if (data.image) {
        const fileExt = data.image.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(fileName, data.image, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          return { error: 'Error al subir la imagen: ' + uploadError.message };
        }

        // Delete old image if exists
        if (event.image_url) {
          const oldPath = event.image_url.split('/').pop();
          if (oldPath) {
            await supabase.storage.from('event-images').remove([oldPath]);
          }
        }

        const { data: urlData } = supabase.storage
          .from('event-images')
          .getPublicUrl(uploadData.path);

        imageUrl = urlData.publicUrl;
      }

      // If image was removed
      if (!data.image && !event.image_url) {
        imageUrl = null;
      }

      const { error } = await supabase
        .from('events')
        .update({
          title: data.title.trim(),
          description: data.description.trim(),
          location: data.location.trim(),
          event_date: data.event_date,
          end_date: data.end_date || null,
          category: data.category,
          difficulty: data.difficulty,
          max_participants: data.max_participants
            ? parseInt(data.max_participants)
            : null,
          price: parseFloat(data.price) || 0,
          image_url: imageUrl,
          status: data.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', event.id);

      if (error) return { error: error.message };

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
