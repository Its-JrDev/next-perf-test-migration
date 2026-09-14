/* eslint-disable react-refresh/only-export-components */
import type { Metadata } from 'next';
import { RootProviders } from './root-providers';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Gestión de eventos',
  description:
    'Explora el catálogo de eventos y categorías. Crea una cuenta para guardar tus favoritos y, si eres administrador, administra el contenido.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}