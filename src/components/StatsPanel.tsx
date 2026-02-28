import React from 'react';
import { ReadingStats } from '../utils/stats';
import { Locale, t as tt } from '../utils/i18n';
import './StatsPanel.css';

interface StatsPanelProps {
  stats: ReadingStats;
  currentWPM: number;
  currentProgress: number;
  wordsInDocument: number;
  onClose: () => void;
  locale: Locale;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  stats,
  currentWPM,
  currentProgress,
  wordsInDocument,
  onClose,
  locale,
}) => {
  const t = (key: Parameters<typeof tt>[1]) => tt(locale, key);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const estimatedTimeRemaining = wordsInDocument > 0 && currentWPM > 0
    ? ((wordsInDocument * (1 - currentProgress)) / currentWPM) * 60
    : 0;

  return (
    <div className="stats-overlay" onClick={onClose}>
      <div className="stats-panel" onClick={(e) => e.stopPropagation()}>
        <div className="stats-header">
          <h2>{t('stats.title')}</h2>
          <button className="stats-close" onClick={onClose}>×</button>
        </div>

        <div className="stats-content">
          <section className="stats-section">
            <h3>{t('stats.currentSession')}</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">{t('stats.currentWpm')}</div>
                <div className="stat-value">{currentWPM}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">{t('stats.progress')}</div>
                <div className="stat-value">{Math.round(currentProgress * 100)}%</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">{t('stats.wordsRemaining')}</div>
                <div className="stat-value">
                  {Math.round(wordsInDocument * (1 - currentProgress))}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">{t('stats.timeRemaining')}</div>
                <div className="stat-value">
                  {formatTime(estimatedTimeRemaining)}
                </div>
              </div>
            </div>
          </section>

          <section className="stats-section">
            <h3>{t('stats.allTime')}</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">{t('stats.totalWordsRead')}</div>
                <div className="stat-value">{stats.wordsRead.toLocaleString()}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">{t('stats.totalTime')}</div>
                <div className="stat-value">{formatTime(stats.timeSpent)}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">{t('stats.averageWpm')}</div>
                <div className="stat-value">{stats.averageWPM}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">{t('stats.sessions')}</div>
                <div className="stat-value">{stats.sessions}</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
