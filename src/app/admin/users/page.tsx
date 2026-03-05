import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Users, Shield, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Usuarios - Admin EnduroCommunity',
};

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
        <p className="text-gray-500 text-sm mt-1">
          Todos los usuarios registrados en la plataforma
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          Error al cargar los usuarios
        </div>
      )}

      <Card>
        {!users || users.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No hay usuarios registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Usuario
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Rol
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide hidden md:table-cell">
                    Registrado el
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 rounded-full p-1.5">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.full_name || 'Sin nombre'}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-700'
                        }
                      >
                        {user.role === 'admin' ? (
                          <>
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </>
                        ) : (
                          'Usuario'
                        )}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-gray-600">
                        {formatDate(user.created_at)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
