import type { Metadata } from 'next';
import { Card } from '@/components/ui/Card';
import { ClipboardList } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Inscripciones - Admin EnduroCommunity',
};

export default function AdminRegistrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inscripciones</h1>
        <p className="text-gray-500 text-sm mt-1">
          Todas las inscripciones a eventos
        </p>
      </div>

      <Card>
        <div className="px-6 py-12 text-center">
          <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            Gestión de inscripciones próximamente
          </p>
        </div>
      </Card>
    </div>
  );
}
