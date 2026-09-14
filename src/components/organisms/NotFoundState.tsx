'use client';

import { ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms';

export function NotFoundState() {
  const router = useRouter();

  return (
    <section className="flex min-h-[60vh] w-full items-center justify-center bg-background px-6 py-16 text-foreground">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <span
          className="text-[8rem] leading-none font-bold tracking-tighter text-foreground tabular-nums select-none sm:text-[11rem]"
          aria-hidden="true"
        >
          404
        </span>
        <h1 className="-mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Esta página tomó un camino equivocado
        </h1>
        <p className="mt-3 max-w-sm text-sm text-pretty text-muted-foreground">
          La ruta que buscas no existe o se movió de lugar. Te ayudamos a volver al inicio.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button render={<Link href="/" />} nativeButton={false}>
            <Home className="size-4" aria-hidden="true" />
            Ir al inicio
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Volver
          </Button>
        </div>
      </div>
    </section>
  );
}

export default NotFoundState;
