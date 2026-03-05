'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

interface DeleteEventButtonProps {
  eventId: string;
  eventTitle: string;
}

export function DeleteEventButton({ eventId, eventTitle }: DeleteEventButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar el evento "${eventTitle}"? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();

      // Delete registrations first
      await supabase.from('registrations').delete().eq('event_id', eventId);

      // Delete event
      const { error } = await supabase.from('events').delete().eq('id', eventId);

      if (error) throw error;

      router.refresh();
    } catch {
      alert('Error al eliminar el evento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      isLoading={isLoading}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
}
