'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 text-sm">
        Usa el botón <strong>Iniciar sesión</strong> en la cabecera de la página
        para acceder con tu cuenta de Netlify Identity.
      </p>
      <p className="text-center text-sm text-gray-600">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="text-orange-600 hover:text-orange-700 font-medium">
          Regístrate aquí
        </Link>
      </p>
      <Button
        variant="primary"
        className="w-full"
        onClick={() => window.netlifyIdentity?.open('login')}
      >
        Abrir pantalla de inicio de sesión
      </Button>
    </div>
  );
}
