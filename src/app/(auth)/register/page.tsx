import type { Metadata } from 'next';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Registrarse - EnduroCommunity',
};

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-bold text-gray-900">Crear cuenta</h1>
        <p className="text-sm text-gray-500 mt-1">
          Únete a la comunidad y accede a todos los eventos
        </p>
      </CardHeader>
      <CardBody>
        <RegisterForm />
      </CardBody>
    </Card>
  );
}
