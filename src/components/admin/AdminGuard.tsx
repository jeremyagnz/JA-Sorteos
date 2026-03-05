'use client';

import { useEffect, useState, ReactNode } from 'react';
import { LogIn, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type Status = 'loading' | 'unauthenticated' | 'unauthorized' | 'authorized';

export function AdminGuard({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');

  const checkAccess = async (user: NetlifyIdentityUser) => {
    const token = user.token?.access_token;
    if (!token) {
      setStatus('unauthenticated');
      return;
    }
    try {
      const res = await fetch('/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setStatus('unauthorized');
        return;
      }
      const data = await res.json() as { user: { role?: string } };
      if (data.user?.role === 'admin') {
        setStatus('authorized');
      } else {
        setStatus('unauthorized');
      }
    } catch {
      setStatus('unauthorized');
    }
  };

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const tryIdentity = () => {
      if (!window.netlifyIdentity) {
        setStatus('unauthenticated');
        return;
      }
      const u = window.netlifyIdentity.currentUser();
      if (u) {
        checkAccess(u);
      } else {
        setStatus('unauthenticated');
      }

      const handleLogin = (user?: NetlifyIdentityUser) => {
        if (user) checkAccess(user);
        else setStatus('unauthenticated');
      };
      const handleLogout = () => setStatus('unauthenticated');
      window.netlifyIdentity.on('login', handleLogin);
      window.netlifyIdentity.on('logout', handleLogout);

      cleanup = () => {
        window.netlifyIdentity?.off('login', handleLogin);
        window.netlifyIdentity?.off('logout', handleLogout);
      };
    };

    if (document.readyState === 'complete') {
      tryIdentity();
    } else {
      window.addEventListener('load', tryIdentity);
    }

    return () => {
      window.removeEventListener('load', tryIdentity);
      cleanup?.();
    };
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <LogIn className="h-16 w-16 text-gray-300" />
        <h2 className="text-xl font-semibold text-gray-800">
          Inicia sesión para continuar
        </h2>
        <p className="text-gray-500 text-sm max-w-sm">
          Necesitas iniciar sesión con una cuenta de administrador para acceder
          al panel.
        </p>
        <Button
          variant="primary"
          onClick={() => window.netlifyIdentity?.open('login')}
        >
          Iniciar sesión
        </Button>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <ShieldX className="h-16 w-16 text-red-300" />
        <h2 className="text-xl font-semibold text-gray-800">Acceso denegado</h2>
        <p className="text-gray-500 text-sm max-w-sm">
          No tienes permisos de administrador para acceder a esta sección.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
