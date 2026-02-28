import React from 'react';
import { ReaderSettings } from '../utils/settings';
import { Slider } from '../ui/Slider';
import { Locale, t as tt } from '../utils/i18n';
import './SettingsPanel.css';

interface SettingsPanelProps {
  settings: ReaderSettings;
  onSettingsChange: (settings: ReaderSettings) => void;
  onClose: () => void;
  locale: Locale;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
  onClose,
  locale,
}) => {
  const updateSetting = <K extends keyof ReaderSettings>(
    key: K,
    value: ReaderSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const fontFamilies = [
    'system-ui',
    'Georgia',
    'Times New Roman',
    'Arial',
    'Helvetica',
    'Courier New',
    'Verdana',
    'Palatino',
  ];

  const t = (key: Parameters<typeof tt>[1]) => tt(locale, key);

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>{t('settings.title')}</h2>
          <button className="settings-close" onClick={onClose}>×</button>
        </div>

        <div className="settings-content">
          <section className="settings-section">
            <h3>{t('settings.themeAndDisplay')}</h3>
            <div className="settings-group">
              <label>
                {t('settings.language')}:
                <select
                  value={settings.language}
                  onChange={(e) => updateSetting('language', e.target.value as any)}
                >
                  <option value="auto">{t('settings.auto')}</option>
                  <option value="en">English</option>
                  <option value="tr">Türkçe</option>
                </select>
              </label>
            </div>
            <div className="settings-group">
              <label>
                {t('settings.theme')}:
                <select
                  value={settings.theme}
                  onChange={(e) => updateSetting('theme', e.target.value as any)}
                >
                  <option value="dark">{t('settings.dark')}</option>
                  <option value="light">{t('settings.light')}</option>
                  <option value="auto">{t('settings.auto')}</option>
                </select>
              </label>
            </div>
            <Slider
              label={t('settings.fontSize')}
              value={settings.fontSize}
              min={2}
              max={8}
              step={0.5}
              onChange={(v) => updateSetting('fontSize', v)}
            />
            <div className="settings-group">
              <label>
                {t('settings.fontFamily')}:
                <select
                  value={settings.fontFamily}
                  onChange={(e) => updateSetting('fontFamily', e.target.value)}
                >
                  {fontFamilies.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="settings-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.showORP}
                  onChange={(e) => updateSetting('showORP', e.target.checked)}
                />
                {t('settings.showOrp')}
              </label>
            </div>
            <div className="settings-group">
              <label>
                {t('settings.orpColor')}:
                <input
                  type="color"
                  value={settings.orpColor}
                  onChange={(e) => updateSetting('orpColor', e.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="settings-section">
            <h3>{t('settings.readingSpeed')}</h3>
            <Slider
              label={t('settings.wpm')}
              value={settings.wpm}
              min={100}
              max={1200}
              step={50}
              onChange={(v) => updateSetting('wpm', v)}
            />
            <Slider
              label={t('settings.chunkSize')}
              value={settings.chunkSize}
              min={1}
              max={4}
              step={1}
              onChange={(v) => updateSetting('chunkSize', v)}
            />
            <Slider
              label={t('settings.punctuationPause')}
              value={settings.punctuationPause}
              min={0}
              max={2}
              step={0.1}
              onChange={(v) => updateSetting('punctuationPause', v)}
            />
            <Slider
              label={t('settings.shortWordFactor')}
              value={settings.shortWordFactor}
              min={0.5}
              max={1.2}
              step={0.1}
              onChange={(v) => updateSetting('shortWordFactor', v)}
            />
          </section>

          <section className="settings-section">
            <h3>{t('settings.advancedOptions')}</h3>
            <div className="settings-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.autoPauseOnPunctuation}
                  onChange={(e) => updateSetting('autoPauseOnPunctuation', e.target.checked)}
                />
                {t('settings.autoPauseOnPunctuation')}
              </label>
            </div>
            <div className="settings-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.highlightCurrentWord}
                  onChange={(e) => updateSetting('highlightCurrentWord', e.target.checked)}
                />
                {t('settings.highlightCurrentWord')}
              </label>
            </div>
            <div className="settings-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.showProgress}
                  onChange={(e) => updateSetting('showProgress', e.target.checked)}
                />
                {t('settings.showProgress')}
              </label>
            </div>
            <div className="settings-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.showStats}
                  onChange={(e) => updateSetting('showStats', e.target.checked)}
                />
                {t('settings.showReadingStats')}
              </label>
            </div>
          </section>

          <section className="settings-section">
            <h3>{t('settings.uiPreferences')}</h3>
            <div className="settings-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.minimalMode}
                  onChange={(e) => updateSetting('minimalMode', e.target.checked)}
                />
                {t('settings.minimalMode')}
              </label>
            </div>
            <div className="settings-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.showControls}
                  onChange={(e) => updateSetting('showControls', e.target.checked)}
                />
                {t('settings.showControls')}
              </label>
            </div>
            <div className="settings-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.compactControls}
                  onChange={(e) => updateSetting('compactControls', e.target.checked)}
                />
                {t('settings.compactControls')}
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
