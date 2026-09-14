import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/atoms';

export function ForbiddenTemplate() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <div className="flex max-w-lg flex-col items-center justify-center gap-4 text-center">
        <div className="bg-destructive/10 rounded-full p-4">
          <ShieldAlert className="text-destructive size-10" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Acceso denegado</h1>
        <p className="text-muted-foreground max-w-md text-sm leading-6">
          Tu cuenta no tiene los permisos necesarios para acceder a esta sección.
          Esta acción requiere rol de administrador.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/categories">Ver categorías</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
