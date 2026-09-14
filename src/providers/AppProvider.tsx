import { useEffect, useState, type ReactNode } from 'react';
import { AppContext } from '@/contexts';

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const stored =
      typeof window !== 'undefined'
        ? localStorage.getItem('theme')
        : null;
    if (stored === 'dark' || stored === 'light') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', 'desert-sands');
    document.documentElement.style.colorScheme =
      theme === 'dark' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <AppContext.Provider value={{ theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}