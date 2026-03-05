'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { EventForm } from '@/components/events/EventForm';
import { EventFormData } from '@/types';

export function CreateEventForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: EventFormData) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return { error: 'No autenticado' };

      let imageUrl: string | null = null;

      // Upload image if provided
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

        const { data: urlData } = supabase.storage
          .from('event-images')
          .getPublicUrl(uploadData.path);

        imageUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from('events').insert({
        title: data.title.trim(),
        description: data.description.trim(),
        location: data.location.trim(),
        event_date: data.event_date,
        end_date: data.end_date || null,
        category: data.category,
        difficulty: data.difficulty,
        max_participants: data.max_participants ? parseInt(data.max_participants) : null,
        price: parseFloat(data.price) || 0,
        image_url: imageUrl,
        status: data.status,
        organizer_id: user.id,
      });

      if (error) return { error: error.message };

      router.push('/admin/events');
      router.refresh();
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  return <EventForm onSubmit={handleSubmit} isLoading={isLoading} />;
}
