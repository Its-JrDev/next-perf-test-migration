'use client';
import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '@/utils/cn';

interface EventImageProps {
  src?: string;
  alt: string;
  className?: string;
}

export function EventImage({ src, alt, className }: EventImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | undefined>();

  if (!src || failedSrc === src) {
    return (
      <div
        className={cn(
          'bg-muted text-muted-foreground flex items-center justify-center',
          className,
        )}
      >
        <ImageOff className="size-8" />
      </div>
    );
  }

  return (
    // Imágenes remotas arbitrarias con fallback propio: no se usa next/image
    // por la configuración dinámica de dominios y dimensiones.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      className={cn('object-cover', className)}
    />
  );
}
