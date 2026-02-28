export type Locale = 'en' | 'tr';
export type LanguageSetting = Locale | 'auto';

export type I18nKey =
  | 'app.title'
  | 'app.subtitle'
  | 'app.placeholder'
  | 'app.startReading'
  | 'app.uploadFile'
  | 'app.loading'
  | 'app.keyboardShortcuts'
  | 'app.supportedFormats'
  | 'app.sampleEnglish'
  | 'app.sampleTurkish'
  | 'reader.pause'
  | 'reader.play'
  | 'reader.restart'
  | 'reader.back'
  | 'reader.forward'
  | 'reader.fullscreen'
  | 'reader.exitFullscreen'
  | 'reader.settings'
  | 'reader.stats'
  | 'reader.bookmarks'
  | 'reader.hideUi'
  | 'reader.showUi'
  | 'settings.title'
  | 'settings.themeAndDisplay'
  | 'settings.language'
  | 'settings.theme'
  | 'settings.dark'
  | 'settings.light'
  | 'settings.auto'
  | 'settings.fontSize'
  | 'settings.fontFamily'
  | 'settings.showOrp'
  | 'settings.orpColor'
  | 'settings.readingSpeed'
  | 'settings.wpm'
  | 'settings.chunkSize'
  | 'settings.punctuationPause'
  | 'settings.shortWordFactor'
  | 'settings.advancedOptions'
  | 'settings.autoPauseOnPunctuation'
  | 'settings.highlightCurrentWord'
  | 'settings.showProgress'
  | 'settings.showReadingStats'
  | 'settings.uiPreferences'
  | 'settings.minimalMode'
  | 'settings.showControls'
  | 'settings.compactControls'
  | 'stats.title'
  | 'stats.currentSession'
  | 'stats.allTime'
  | 'stats.currentWpm'
  | 'stats.progress'
  | 'stats.wordsRemaining'
  | 'stats.timeRemaining'
  | 'stats.totalWordsRead'
  | 'stats.totalTime'
  | 'stats.averageWpm'
  | 'stats.sessions'
  | 'bookmarks.title'
  | 'bookmarks.empty'
  | 'bookmarks.hint'
  | 'bookmarks.jump'
  | 'bookmarks.delete'
  | 'bookmarks.addNote'
  | 'bookmarks.editNote'
  | 'bookmarks.save'
  | 'bookmarks.cancel'
  | 'bookmarks.position';

const strings: Record<Locale, Record<I18nKey, string>> = {
  en: {
    'app.title': 'RSVP Reader',
    'app.subtitle': 'Rapid Serial Visual Presentation reader. Read any document one word at a time.',
    'app.placeholder': 'Paste your text here or upload a file below...',
    'app.startReading': 'Start Reading',
    'app.uploadFile': 'Upload File',
    'app.loading': 'Loading...',
    'app.keyboardShortcuts': 'Keyboard Shortcuts',
    'app.supportedFormats': 'Supported Formats',
    'app.sampleEnglish': 'Load English sample',
    'app.sampleTurkish': 'Load Turkish sample',

    'reader.pause': '⏸ Pause',
    'reader.play': '▶ Play',
    'reader.restart': '↻ Restart',
    'reader.back': '← Back',
    'reader.forward': 'Forward →',
    'reader.fullscreen': '⤢ Fullscreen',
    'reader.exitFullscreen': '⤓ Exit',
    'reader.settings': '⚙ Settings',
    'reader.stats': '📊 Stats',
    'reader.bookmarks': '🔖 Bookmarks',
    'reader.hideUi': 'Hide UI',
    'reader.showUi': 'Show UI (H)',

    'settings.title': 'Settings',
    'settings.themeAndDisplay': 'Theme & Display',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.dark': 'Dark',
    'settings.light': 'Light',
    'settings.auto': 'Auto',
    'settings.fontSize': 'Font Size',
    'settings.fontFamily': 'Font Family',
    'settings.showOrp': 'Show ORP (Optimal Recognition Point)',
    'settings.orpColor': 'ORP Color',
    'settings.readingSpeed': 'Reading Speed',
    'settings.wpm': 'Words Per Minute (WPM)',
    'settings.chunkSize': 'Chunk Size',
    'settings.punctuationPause': 'Punctuation Pause',
    'settings.shortWordFactor': 'Short Word Factor',
    'settings.advancedOptions': 'Advanced Options',
    'settings.autoPauseOnPunctuation': 'Auto-pause on punctuation',
    'settings.highlightCurrentWord': 'Highlight current word',
    'settings.showProgress': 'Show progress bar',
    'settings.showReadingStats': 'Show reading statistics',
    'settings.uiPreferences': 'UI Preferences',
    'settings.minimalMode': 'Minimal mode',
    'settings.showControls': 'Show controls',
    'settings.compactControls': 'Compact controls',

    'stats.title': 'Reading Statistics',
    'stats.currentSession': 'Current Session',
    'stats.allTime': 'All Time',
    'stats.currentWpm': 'Current WPM',
    'stats.progress': 'Progress',
    'stats.wordsRemaining': 'Words Remaining',
    'stats.timeRemaining': 'Time Remaining',
    'stats.totalWordsRead': 'Total Words Read',
    'stats.totalTime': 'Total Time',
    'stats.averageWpm': 'Average WPM',
    'stats.sessions': 'Sessions',

    'bookmarks.title': 'Bookmarks',
    'bookmarks.empty': 'No bookmarks yet.',
    'bookmarks.hint': "Press 'B' to bookmark your current position.",
    'bookmarks.jump': 'Jump to position',
    'bookmarks.delete': 'Delete bookmark',
    'bookmarks.addNote': 'Add note',
    'bookmarks.editNote': 'Edit note',
    'bookmarks.save': 'Save',
    'bookmarks.cancel': 'Cancel',
    'bookmarks.position': 'Position',
  },
  tr: {
    'app.title': 'RSVP Okuyucu',
    'app.subtitle': 'Hızlı Seri Görsel Sunum (RSVP) okuyucu. Belgeleri tek kelime halinde okuyun.',
    'app.placeholder': 'Metni buraya yapıştırın veya aşağıdan dosya yükleyin...',
    'app.startReading': 'Okumayı Başlat',
    'app.uploadFile': 'Dosya Yükle',
    'app.loading': 'Yükleniyor...',
    'app.keyboardShortcuts': 'Klavye Kısayolları',
    'app.supportedFormats': 'Desteklenen Formatlar',
    'app.sampleEnglish': 'İngilizce örnek yükle',
    'app.sampleTurkish': 'Türkçe örnek yükle',

    'reader.pause': '⏸ Duraklat',
    'reader.play': '▶ Oynat',
    'reader.restart': '↻ Baştan',
    'reader.back': '← Geri',
    'reader.forward': 'İleri →',
    'reader.fullscreen': '⤢ Tam ekran',
    'reader.exitFullscreen': '⤓ Çık',
    'reader.settings': '⚙ Ayarlar',
    'reader.stats': '📊 İstatistik',
    'reader.bookmarks': '🔖 Yer İmleri',
    'reader.hideUi': 'Arayüzü Gizle',
    'reader.showUi': 'Arayüzü Göster (H)',

    'settings.title': 'Ayarlar',
    'settings.themeAndDisplay': 'Tema ve Görünüm',
    'settings.language': 'Dil',
    'settings.theme': 'Tema',
    'settings.dark': 'Koyu',
    'settings.light': 'Açık',
    'settings.auto': 'Otomatik',
    'settings.fontSize': 'Yazı Boyutu',
    'settings.fontFamily': 'Yazı Tipi',
    'settings.showOrp': 'ORP Göster (Optimal Tanıma Noktası)',
    'settings.orpColor': 'ORP Rengi',
    'settings.readingSpeed': 'Okuma Hızı',
    'settings.wpm': 'DKM (Dakikada Kelime)',
    'settings.chunkSize': 'Blok Boyutu',
    'settings.punctuationPause': 'Noktalama Duraklaması',
    'settings.shortWordFactor': 'Kısa Kelime Çarpanı',
    'settings.advancedOptions': 'Gelişmiş Seçenekler',
    'settings.autoPauseOnPunctuation': 'Noktalama işaretinde otomatik duraklat',
    'settings.highlightCurrentWord': 'Mevcut kelimeyi vurgula',
    'settings.showProgress': 'İlerleme çubuğunu göster',
    'settings.showReadingStats': 'Okuma istatistiklerini göster',
    'settings.uiPreferences': 'Arayüz Tercihleri',
    'settings.minimalMode': 'Minimal mod',
    'settings.showControls': 'Kontrolleri göster',
    'settings.compactControls': 'Kompakt kontroller',

    'stats.title': 'Okuma İstatistikleri',
    'stats.currentSession': 'Bu Oturum',
    'stats.allTime': 'Tüm Zamanlar',
    'stats.currentWpm': 'Anlık DKM',
    'stats.progress': 'İlerleme',
    'stats.wordsRemaining': 'Kalan Kelime',
    'stats.timeRemaining': 'Kalan Süre',
    'stats.totalWordsRead': 'Toplam Okunan Kelime',
    'stats.totalTime': 'Toplam Süre',
    'stats.averageWpm': 'Ortalama DKM',
    'stats.sessions': 'Oturum',

    'bookmarks.title': 'Yer İmleri',
    'bookmarks.empty': 'Henüz yer imi yok.',
    'bookmarks.hint': "Bulunduğun yeri kaydetmek için 'B' tuşuna bas.",
    'bookmarks.jump': 'Konuma git',
    'bookmarks.delete': 'Yer imini sil',
    'bookmarks.addNote': 'Not ekle',
    'bookmarks.editNote': 'Notu düzenle',
    'bookmarks.save': 'Kaydet',
    'bookmarks.cancel': 'İptal',
    'bookmarks.position': 'Konum',
  },
};

export function resolveLocale(language: LanguageSetting): Locale {
  if (language !== 'auto') return language;
  const nav = (navigator.language || '').toLowerCase();
  return nav.startsWith('tr') ? 'tr' : 'en';
}

export function t(locale: Locale, key: I18nKey): string {
  return strings[locale][key] ?? strings.en[key] ?? key;
}

