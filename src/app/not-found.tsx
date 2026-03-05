import Link from 'next/link';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="bg-orange-100 rounded-full p-4 w-fit mx-auto mb-6">
          <Trophy className="h-12 w-12 text-orange-500" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Página no encontrada
        </h2>
        <p className="text-gray-500 mb-8">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link href="/">
          <Button variant="primary" size="lg">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
