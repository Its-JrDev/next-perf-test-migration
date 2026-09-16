'use client';
import { Moon, Sun } from 'lucide-react';
import { useApp } from '@/hooks';
import { Button } from '@/components/atoms';

export function ThemeToggle() {
  const { theme, setTheme } = useApp();
  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Button>
  );
}
