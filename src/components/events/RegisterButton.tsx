'use client';

import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface RegisterButtonProps {
  eventId: string;
  isRegistered: boolean;
  isFull: boolean;
  userId: string | null;
}

export function RegisterButton({
  isFull,
  userId,
}: RegisterButtonProps) {
  if (isFull && !userId) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
        Evento completo
      </div>
    );
  }

  if (!userId) {
    return (
      <Button
        variant="primary"
        className="w-full"
        size="lg"
        onClick={() => window.netlifyIdentity?.open('login')}
      >
        <CheckCircle className="h-4 w-4" />
        Iniciar sesión para inscribirme
      </Button>
    );
  }

  return (
    <p className="text-sm text-gray-500 text-center">
      Las inscripciones estarán disponibles próximamente.
    </p>
  );
}
