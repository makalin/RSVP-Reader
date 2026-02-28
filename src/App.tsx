import React, { useEffect, useMemo, useState } from 'react';
import { Reader } from './reader/Reader';
import { readFile } from './utils/fileReaders';
import { loadSettings, saveSettings, ReaderSettings } from './utils/settings';
import { resolveLocale, t as tt } from './utils/i18n';
import './App.css';

function App() {
  const [settings, setSettings] = useState<ReaderSettings>(() => loadSettings());
  const [text, setText] = useState('');
  const [inputText, setInputText] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const locale = useMemo(() => resolveLocale(settings.language), [settings.language]);
  const t = (key: Parameters<typeof tt>[1]) => tt(locale, key);

  const handleLoadText = () => {
    if (inputText.trim()) {
      setText(inputText.trim());
      setTitle(locale === 'tr' ? 'Yapıştırılan Metin' : 'Pasted Text');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const result = await readFile(file);
      setText(result.text);
      setTitle(result.title || file.name);
      setInputText(result.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read file');
      console.error('File read error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (text) {
    return <Reader text={text} title={title} />;
  }

  const loadSample = async (filename: 'sample_en.txt' | 'sample_tr.txt') => {
    setLoading(true);
    setError(null);
    try {
      const base = import.meta.env.BASE_URL || '/';
      const res = await fetch(`${base}${filename}`);
      if (!res.ok) throw new Error(`Failed to load sample (${res.status})`);
      const sample = await res.text();
      setInputText(sample);
      setTitle(filename === 'sample_tr.txt' ? 'Türkçe Örnek' : 'English Sample');
    } catch (err) {
      setError(err instanceof Error ? err.message : (locale === 'tr' ? 'Örnek yüklenemedi' : 'Failed to load sample'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="app-container">
        <div className="app-header">
          <h1>{t('app.title')}</h1>
          <select
            className="app-lang"
            value={settings.language}
            onChange={(e) => setSettings((s) => ({ ...s, language: e.target.value as any }))}
            aria-label="Language"
          >
            <option value="auto">{t('settings.auto')}</option>
            <option value="en">English</option>
            <option value="tr">Türkçe</option>
          </select>
        </div>
        <p className="app-subtitle">
          {t('app.subtitle')}
        </p>

        <div className="app-input-section">
          {error && (
            <div className="app-error">
              ⚠️ {error}
            </div>
          )}
          
          <textarea
            className="app-textarea"
            placeholder={t('app.placeholder')}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={12}
            disabled={loading}
          />

          <div className="app-actions">
            <button
              className="app-button app-button-primary"
              onClick={handleLoadText}
              disabled={!inputText.trim()}
            >
              {t('app.startReading')}
            </button>

            <label className="app-button app-button-secondary">
              {loading ? t('app.loading') : t('app.uploadFile')}
              <input
                type="file"
                accept=".txt,.md,.html,.pdf,.epub"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                disabled={loading}
              />
            </label>
          </div>

          <div className="app-samples">
            <button
              className="app-button app-button-secondary"
              onClick={() => loadSample('sample_en.txt')}
              disabled={loading}
              type="button"
            >
              {t('app.sampleEnglish')}
            </button>
            <button
              className="app-button app-button-secondary"
              onClick={() => loadSample('sample_tr.txt')}
              disabled={loading}
              type="button"
            >
              {t('app.sampleTurkish')}
            </button>
          </div>
        </div>

        <div className="app-info">
          <h3>{t('app.keyboardShortcuts')}</h3>
          <div className="app-shortcuts">
            <div><kbd>Space</kbd> {locale === 'tr' ? 'Oynat / Duraklat' : 'Play / Pause'}</div>
            <div><kbd>←</kbd> / <kbd>→</kbd> {locale === 'tr' ? 'Geri / İleri sar' : 'Seek'}</div>
            <div><kbd>Shift</kbd> + <kbd>←</kbd> / <kbd>→</kbd> {locale === 'tr' ? 'Büyük sarma' : 'Large seek'}</div>
            <div><kbd>↑</kbd> / <kbd>↓</kbd> {locale === 'tr' ? 'DKM ayarla' : 'Adjust WPM'}</div>
            <div><kbd>F</kbd> {locale === 'tr' ? 'Tam ekran' : 'Fullscreen'}</div>
            <div><kbd>H</kbd> {locale === 'tr' ? 'Arayüzü aç/kapat' : 'Toggle UI'}</div>
            <div><kbd>R</kbd> {locale === 'tr' ? 'Baştan' : 'Restart'}</div>
            <div><kbd>Shift</kbd> + <kbd>S</kbd> {locale === 'tr' ? 'Ayarlar' : 'Settings'}</div>
            <div><kbd>Shift</kbd> + <kbd>T</kbd> {locale === 'tr' ? 'İstatistik' : 'Statistics'}</div>
            <div><kbd>B</kbd> {locale === 'tr' ? 'Yer imi' : 'Bookmark'}</div>
          </div>
        </div>

        <div className="app-features">
          <h3>{t('app.supportedFormats')}</h3>
          <div className="app-formats">
            <span className="format-badge">📄 TXT</span>
            <span className="format-badge">📝 Markdown</span>
            <span className="format-badge">🌐 HTML</span>
            <span className="format-badge">📕 PDF</span>
            <span className="format-badge">📚 EPUB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
