'use client';

import { useRouter } from 'next/navigation';
import { Heart, LogOut, Shield, User } from 'lucide-react';
import { useAuth } from '@/hooks';
import { Badge, Button, Separator } from '@/components/atoms';
import { Avatar, AvatarFallback } from './avatar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function ProfileMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // El shell solo se renderiza con sesión activa (AuthGuard); si por alguna
  // transición de estado no hay usuario, no se muestra nada provisional.
  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-accent size-10 rounded-full p-0"
          aria-label="Abrir menú de perfil"
        >
          <Avatar>
            <AvatarFallback className="text-sm">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="data-[state=open]:animate-in w-72 p-0"
      >
        <div className="flex items-center gap-3 p-4">
          <Avatar>
            <AvatarFallback>{initials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="text-muted-foreground truncate text-xs">
              {user.email}
            </p>
            <Badge variant="secondary" className="mt-1.5 gap-1">
              {user.role === 'admin' ? (
                <Shield className="size-3" />
              ) : (
                <User className="size-3" />
              )}
              {user.role === 'admin' ? 'Administrador' : 'Usuario'}
            </Badge>
          </div>
        </div>
        <Separator />
        <div className="grid gap-1 p-2">
          <Button
            variant="ghost"
            className="justify-start gap-2"
            onClick={() => router.push('/favorites')}
          >
            <Heart className="size-4" />
            Mis favoritos
          </Button>
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
