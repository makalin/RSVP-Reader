export interface ReaderSettings {
  // Display
  theme: 'dark' | 'light' | 'auto';
  fontSize: number;
  fontFamily: string;
  showORP: boolean;
  orpColor: string;
  
  // Reading
  wpm: number;
  chunkSize: number;
  punctuationPause: number;
  shortWordFactor: number;
  
  // Advanced
  autoPauseOnPunctuation: boolean;
  highlightCurrentWord: boolean;
  showProgress: boolean;
  showStats: boolean;
  
  // UI
  minimalMode: boolean;
  showControls: boolean;
  compactControls: boolean;
}

export const DEFAULT_SETTINGS: ReaderSettings = {
  theme: 'dark',
  fontSize: 4,
  fontFamily: 'system-ui',
  showORP: true,
  orpColor: '#4a9eff',
  wpm: 300,
  chunkSize: 1,
  punctuationPause: 0.5,
  shortWordFactor: 0.8,
  autoPauseOnPunctuation: false,
  highlightCurrentWord: true,
  showProgress: true,
  showStats: true,
  minimalMode: false,
  showControls: true,
  compactControls: false,
};

const SETTINGS_KEY = 'rsvp-reader-settings';

export function loadSettings(): ReaderSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings: ReaderSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}
