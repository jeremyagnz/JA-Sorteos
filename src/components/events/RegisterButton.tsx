'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

interface RegisterButtonProps {
  eventId: string;
  isRegistered: boolean;
  isFull: boolean;
  userId: string | null;
}

export function RegisterButton({
  eventId,
  isRegistered,
  isFull,
  userId,
}: RegisterButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(isRegistered);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!userId) {
      router.push(`/login?redirect=/events/${eventId}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      if (registered) {
        // Cancel registration
        const { error: cancelError } = await supabase
          .from('registrations')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', userId);

        if (cancelError) throw cancelError;
        setRegistered(false);
      } else {
        // Register
        const { error: regError } = await supabase.from('registrations').insert({
          event_id: eventId,
          user_id: userId,
          status: 'confirmed',
        });

        if (regError) {
          if (regError.code === '23505') {
            setError('Ya estás inscrito en este evento');
          } else {
            throw regError;
          }
          return;
        }
        setRegistered(true);
      }

      router.refresh();
    } catch {
      setError('Error al procesar la inscripción');
    } finally {
      setLoading(false);
    }
  };

  if (isFull && !registered) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
        Evento completo
      </div>
    );
  }

  return (
    <div>
      <Button
        onClick={handleRegister}
        variant={registered ? 'outline' : 'primary'}
        isLoading={loading}
        className="w-full"
        size="lg"
      >
        {registered ? (
          <>
            <XCircle className="h-4 w-4" />
            Cancelar inscripción
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4" />
            {userId ? 'Inscribirme' : 'Iniciar sesión para inscribirme'}
          </>
        )}
      </Button>
      {registered && (
        <p className="text-center text-sm text-green-600 mt-2">
          ✓ Estás inscrito en este evento
        </p>
      )}
      {error && (
        <p className="text-center text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  );
}
