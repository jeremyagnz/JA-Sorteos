import type { Metadata } from 'next';
import { Card } from '@/components/ui/Card';
import { Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Usuarios - Admin EnduroCommunity',
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
        <p className="text-gray-500 text-sm mt-1">
          Todos los usuarios registrados en la plataforma
        </p>
      </div>

      <Card>
        <div className="px-6 py-12 text-center">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            Gestión de usuarios próximamente
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Para asignar roles de admin, usa el endpoint{' '}
            <code className="bg-gray-100 px-1 rounded">
              PUT /api/admin/users/:id/role
            </code>{' '}
            con un Bearer JWT de administrador.
          </p>
        </div>
      </Card>
    </div>
  );
}
