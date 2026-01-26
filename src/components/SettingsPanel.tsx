import React from 'react';
import { ReaderSettings } from '../utils/settings';
import { Slider } from '../ui/Slider';
import './SettingsPanel.css';

interface SettingsPanelProps {
  settings: ReaderSettings;
  onSettingsChange: (settings: ReaderSettings) => void;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
  onClose,
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

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="settings-close" onClick={onClose}>×</button>
        </div>

        <div className="settings-content">
          <section className="settings-section">
            <h3>Theme & Display</h3>
            <div className="settings-group">
              <label>
                Theme:
                <select
                  value={settings.theme}
                  onChange={(e) => updateSetting('theme', e.target.value as any)}
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto</option>
                </select>
              </label>
            </div>
            <Slider
              label="Font Size"
              value={settings.fontSize}
              min={2}
              max={8}
              step={0.5}
              onChange={(v) => updateSetting('fontSize', v)}
            />
            <div className="settings-group">
              <label>
                Font Family:
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
                Show ORP (Optimal Recognition Point)
              </label>
            </div>
            <div className="settings-group">
              <label>
                ORP Color:
                <input
                  type="color"
                  value={settings.orpColor}
                  onChange={(e) => updateSetting('orpColor', e.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="settings-section">
            <h3>Reading Speed</h3>
            <Slider
              label="Words Per Minute (WPM)"
              value={settings.wpm}
              min={100}
              max={1200}
              step={50}
              onChange={(v) => updateSetting('wpm', v)}
            />
            <Slider
              label="Chunk Size"
              value={settings.chunkSize}
              min={1}
              max={4}
              step={1}
              onChange={(v) => updateSetting('chunkSize', v)}
            />
            <Slider
              label="Punctuation Pause"
              value={settings.punctuationPause}
              min={0}
              max={2}
              step={0.1}
              onChange={(v) => updateSetting('punctuationPause', v)}
            />
            <Slider
              label="Short Word Factor"
              value={settings.shortWordFactor}
              min={0.5}
              max={1.2}
              step={0.1}
              onChange={(v) => updateSetting('shortWordFactor', v)}
            />
          </section>

          <section className="settings-section">
            <h3>Advanced Options</h3>
            <div className="settings-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.autoPauseOnPunctuation}
                  onChange={(e) => updateSetting('autoPauseOnPunctuation', e.target.checked)}
                />
                Auto-pause on punctuation
              </label>
            </div>
            <div className="settings-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.highlightCurrentWord}
                  onChange={(e) => updateSetting('highlightCurrentWord', e.target.checked)}
                />
                Highlight current word
              </label>
            </div>
            <div className="settings-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.showProgress}
                  onChange={(e) => updateSetting('showProgress', e.target.checked)}
                />
                Show progress bar
              </label>
            </div>
            <div className="settings-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.showStats}
                  onChange={(e) => updateSetting('showStats', e.target.checked)}
                />
                Show reading statistics
              </label>
            </div>
          </section>

          <section className="settings-section">
            <h3>UI Preferences</h3>
            <div className="settings-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.minimalMode}
                  onChange={(e) => updateSetting('minimalMode', e.target.checked)}
                />
                Minimal mode
              </label>
            </div>
            <div className="settings-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.showControls}
                  onChange={(e) => updateSetting('showControls', e.target.checked)}
                />
                Show controls
              </label>
            </div>
            <div className="settings-group">
              <label>
                <input
                  type="checkbox"
                  checked={settings.compactControls}
                  onChange={(e) => updateSetting('compactControls', e.target.checked)}
                />
                Compact controls
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
