import type { Metadata } from 'next';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Iniciar sesión - EnduroCommunity',
};

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-bold text-gray-900">Iniciar sesión</h1>
        <p className="text-sm text-gray-500 mt-1">
          Accede a tu cuenta para inscribirte en eventos
        </p>
      </CardHeader>
      <CardBody>
        <LoginForm />
      </CardBody>
    </Card>
  );
}
