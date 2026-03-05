'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function RegisterForm() {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 text-sm">
        Usa el botón <strong>Registrarse</strong> en la cabecera de la página
        para crear tu cuenta con Netlify Identity.
      </p>
      <p className="text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-orange-600 hover:text-orange-700 font-medium">
          Inicia sesión aquí
        </Link>
      </p>
      <Button
        variant="primary"
        className="w-full"
        onClick={() => window.netlifyIdentity?.open('signup')}
      >
        Abrir pantalla de registro
      </Button>
    </div>
  );
}
