import type { Metadata } from 'next';
import { NetlifyIdentityProvider } from '@/components/auth/NetlifyIdentityProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'EnduroCommunity - Eventos de Deportes de Motor',
  description:
    'La comunidad de eventos deportivos de motor todo terreno. Enduro, motocross, trial, cross country y mucho más.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <NetlifyIdentityProvider>{children}</NetlifyIdentityProvider>
      </body>
    </html>
  );
}
