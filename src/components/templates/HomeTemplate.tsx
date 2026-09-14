import Link from 'next/link';
import { CalendarRange } from 'lucide-react';
import { Button } from '@/components/atoms';

export function HomeTemplate() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
      <div className="bg-primary/10 rounded-full p-4">
        <CalendarRange className="text-primary size-10" />
      </div>
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight">
        Gestión de eventos
      </h1>
      <p className="text-muted-foreground max-w-xl">
        Explora el catálogo de eventos y categorías. Crea una cuenta para
        guardar tus favoritos y, si eres administrador, crea categorías y
        administra el contenido.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/events">Ver eventos</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/categories">Ver categorías</Link>
        </Button>
      </div>
    </div>
  );
}
