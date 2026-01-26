export interface ReadingStats {
  wordsRead: number;
  timeSpent: number; // in seconds
  averageWPM: number;
  startTime: number;
  sessions: number;
}

const STATS_KEY = 'rsvp-reader-stats';

export function loadStats(): ReadingStats {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load stats:', e);
  }
  return {
    wordsRead: 0,
    timeSpent: 0,
    averageWPM: 0,
    startTime: Date.now(),
    sessions: 0,
  };
}

export function saveStats(stats: ReadingStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
}

export function updateStats(
  stats: ReadingStats,
  wordsRead: number,
  timeSpent: number
): ReadingStats {
  const newStats = {
    ...stats,
    wordsRead: stats.wordsRead + wordsRead,
    timeSpent: stats.timeSpent + timeSpent,
  };
  
  if (newStats.timeSpent > 0) {
    newStats.averageWPM = Math.round(
      (newStats.wordsRead / newStats.timeSpent) * 60
    );
  }
  
  return newStats;
}
