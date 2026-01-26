import React from 'react';
import { ReadingStats } from '../utils/stats';
import './StatsPanel.css';

interface StatsPanelProps {
  stats: ReadingStats;
  currentWPM: number;
  currentProgress: number;
  wordsInDocument: number;
  onClose: () => void;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  stats,
  currentWPM,
  currentProgress,
  wordsInDocument,
  onClose,
}) => {
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
          <h2>Reading Statistics</h2>
          <button className="stats-close" onClick={onClose}>×</button>
        </div>

        <div className="stats-content">
          <section className="stats-section">
            <h3>Current Session</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Current WPM</div>
                <div className="stat-value">{currentWPM}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Progress</div>
                <div className="stat-value">{Math.round(currentProgress * 100)}%</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Words Remaining</div>
                <div className="stat-value">
                  {Math.round(wordsInDocument * (1 - currentProgress))}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Time Remaining</div>
                <div className="stat-value">
                  {formatTime(estimatedTimeRemaining)}
                </div>
              </div>
            </div>
          </section>

          <section className="stats-section">
            <h3>All Time</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Total Words Read</div>
                <div className="stat-value">{stats.wordsRead.toLocaleString()}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Total Time</div>
                <div className="stat-value">{formatTime(stats.timeSpent)}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Average WPM</div>
                <div className="stat-value">{stats.averageWPM}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Sessions</div>
                <div className="stat-value">{stats.sessions}</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
