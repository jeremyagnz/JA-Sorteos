import type { Metadata } from 'next';
import Script from 'next/script';
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
      <head>
        {/* Netlify Identity widget — loaded early so it is available globally */}
        <Script
          src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
