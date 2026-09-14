import Link from 'next/link';
import { Badge, EventImage } from '@/components/atoms';
import {
  Card,
  CardContent,
  CardFooter,
  FavoriteButton,
} from '@/components/molecules';
import { formatPrice } from '@/utils';
import type { Event } from '@/types';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const imageUrl = event.images?.[0]?.url;

  return (
    <Link
      href={`/events/${event.id}`}
      className="group animate-in fade-in block duration-200 ease-out motion-reduce:animate-none"
    >
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative">
          <EventImage
            src={imageUrl}
            alt={event.name}
            className="aspect-square w-full"
          />
          <div className="absolute top-2 right-2">
            <FavoriteButton eventId={event.id} />
          </div>
          <Badge variant="secondary" className="absolute top-2 left-2">
            {event.category?.name}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="line-clamp-1 font-semibold">{event.name}</h3>
          <p className="text-primary mt-1 text-lg font-bold">
            {formatPrice(event.price)}
          </p>
          <p className="text-muted-foreground text-xs">
            {event.capacity > 0 ? `${event.capacity} plazas` : 'Sin capacidad'}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0" />
      </Card>
    </Link>
  );
}
