import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { brutalTheme } from '@/theme/theme';
import { zenTheme } from '@/theme/zenTheme';
import { classicTheme } from '@/theme/classicTheme';

export type ThemeMode = 'brutal' | 'classic' | 'zen';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEMES = { brutal: brutalTheme, classic: classicTheme, zen: zenTheme };

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('vk-theme');
    return (saved as ThemeMode | null) ?? 'brutal';
  });

  function setMode(next: ThemeMode) {
    localStorage.setItem('vk-theme', next);
    setModeState(next);
  }

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={THEMES[mode]}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used within AppThemeProvider');
  return ctx;
}
