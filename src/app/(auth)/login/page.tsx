import type { Metadata } from 'next';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Iniciar sesión - EnduroCommunity',
};

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-bold text-gray-900">Iniciar sesión</h1>
      </CardHeader>
      <CardBody>
        <p className="text-gray-600 text-sm">
          Usa el botón <strong>Iniciar sesión</strong> en la cabecera de la página
          para acceder con tu cuenta de Netlify Identity.
        </p>
      </CardBody>
    </Card>
  );
}
