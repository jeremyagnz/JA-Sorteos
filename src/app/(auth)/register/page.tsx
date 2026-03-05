import type { Metadata } from 'next';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Registrarse - EnduroCommunity',
};

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-bold text-gray-900">Crear cuenta</h1>
      </CardHeader>
      <CardBody>
        <p className="text-gray-600 text-sm">
          Usa el botón <strong>Registrarse</strong> en la cabecera de la página
          para crear tu cuenta con Netlify Identity.
        </p>
      </CardBody>
    </Card>
  );
}
