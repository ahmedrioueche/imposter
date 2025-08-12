'use client';

import { SettingsProvider } from '@/context/SettingsContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
          <SidebarProvider>{children}</SidebarProvider>
    </NextThemesProvider>
  );  
}
