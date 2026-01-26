export type Theme = 'dark' | 'light' | 'auto';

export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
  accentHover: string;
  border: string;
  wordDisplay: string;
  wordORP: string;
  wordBefore: string;
}

const themes: Record<'dark' | 'light', ThemeColors> = {
  dark: {
    background: '#0a0a0a',
    surface: '#1a1a1a',
    text: '#e0e0e0',
    textSecondary: '#aaa',
    accent: '#4a9eff',
    accentHover: '#5fb0ff',
    border: '#333',
    wordDisplay: '#fff',
    wordORP: '#4a9eff',
    wordBefore: '#888',
  },
  light: {
    background: '#ffffff',
    surface: '#f5f5f5',
    text: '#1a1a1a',
    textSecondary: '#666',
    accent: '#0066cc',
    accentHover: '#0052a3',
    border: '#ddd',
    wordDisplay: '#000',
    wordORP: '#0066cc',
    wordBefore: '#666',
  },
};

export function getThemeColors(theme: Theme): ThemeColors {
  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return themes[prefersDark ? 'dark' : 'light'];
  }
  return themes[theme];
}

export function applyTheme(theme: Theme): void {
  const colors = getThemeColors(theme);
  const root = document.documentElement;
  
  root.style.setProperty('--bg-primary', colors.background);
  root.style.setProperty('--bg-surface', colors.surface);
  root.style.setProperty('--text-primary', colors.text);
  root.style.setProperty('--text-secondary', colors.textSecondary);
  root.style.setProperty('--accent', colors.accent);
  root.style.setProperty('--accent-hover', colors.accentHover);
  root.style.setProperty('--border', colors.border);
  root.style.setProperty('--word-display', colors.wordDisplay);
  root.style.setProperty('--word-orp', colors.wordORP);
  root.style.setProperty('--word-before', colors.wordBefore);
  
  root.setAttribute('data-theme', theme === 'auto' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme
  );
}
