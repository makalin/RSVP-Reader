export interface ReaderSettings {
  // Language
  language: 'en' | 'tr' | 'auto';

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
  uiHidden: boolean;
}

export const DEFAULT_SETTINGS: ReaderSettings = {
  language: 'auto',
  theme: 'dark',
  fontSize: 4,
  fontFamily: 'system-ui',
  showORP: true,
  orpColor: '#e53935',
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
  uiHidden: false,
};

const SETTINGS_KEY = 'rsvp-reader-settings';

const LEGACY_BLUE_ORP = '#4a9eff';

export function loadSettings(): ReaderSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const loaded = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      if (loaded.orpColor?.toLowerCase() === LEGACY_BLUE_ORP) {
        loaded.orpColor = DEFAULT_SETTINGS.orpColor;
      }
      return loaded;
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
