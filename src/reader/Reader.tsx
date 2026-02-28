import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { RSVPEngine, RSVPEvent } from './rsvpEngine';
import { Slider } from '../ui/Slider';
import { SettingsPanel } from '../components/SettingsPanel';
import { StatsPanel } from '../components/StatsPanel';
import { BookmarksPanel } from '../components/BookmarksPanel';
import { ReaderSettings, loadSettings, saveSettings } from '../utils/settings';
import { applyTheme, getThemeColors } from '../utils/theme';
import { addBookmark, loadBookmarks, removeBookmark, Bookmark } from '../utils/bookmarks';
import { loadStats, saveStats, updateStats, ReadingStats } from '../utils/stats';
import { resolveLocale, t as tt } from '../utils/i18n';
import './styles/reader.css';

interface ReaderProps {
  text: string;
  title?: string;
  onBackToHome?: () => void;
}

export const Reader: React.FC<ReaderProps> = ({ text, title, onBackToHome }) => {
  const initialSettings = useMemo(() => loadSettings(), []);
  const [settings, setSettings] = useState<ReaderSettings>(initialSettings);
  const [engine, setEngine] = useState<RSVPEngine | null>(null);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showUI, setShowUI] = useState(() => !initialSettings.uiHidden && !initialSettings.minimalMode);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showJumpDialog, setShowJumpDialog] = useState(false);
  const [jumpInput, setJumpInput] = useState('');
  const [showMoreControls, setShowMoreControls] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(loadBookmarks());
  const [stats, setStats] = useState<ReadingStats>(loadStats());
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [wordsReadThisSession, setWordsReadThisSession] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);

  const locale = useMemo(() => resolveLocale(settings.language), [settings.language]);
  const t = (key: Parameters<typeof tt>[1]) => tt(locale, key);

  // Apply theme
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  // Lock page scrolling while reader is mounted
  useEffect(() => {
    document.body.classList.add('reader-mode');
    return () => {
      document.body.classList.remove('reader-mode');
    };
  }, []);

  // Save settings when they change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Keep UI visibility in sync with persisted settings
  useEffect(() => {
    setShowUI(!settings.uiHidden && !settings.minimalMode);
  }, [settings.uiHidden, settings.minimalMode]);

  // Initialize engine
  useEffect(() => {
    if (!text.trim()) return;

    const newEngine = new RSVPEngine(text, {
      wpm: settings.wpm,
      chunkSize: settings.chunkSize,
      punctuationPause: settings.punctuationPause,
      shortWordFactor: settings.shortWordFactor,
    });
    
    newEngine.setOnEvent((event: RSVPEvent) => {
      setCurrentWord(event.content);
      setCurrentIndex(event.index);
      setTotal(event.total);
      setProgress(event.index / event.total);
      
      if (event.type === 'word' || event.type === 'chunk') {
        setWordsReadThisSession(prev => prev + 1);
      }
    });

    setEngine(newEngine);
    setCurrentIndex(0);
    setTotal(newEngine.getTotal());
    setProgress(0);
    setSessionStartTime(Date.now());
    setWordsReadThisSession(0);

    return () => {
      newEngine.stop();
    };
  }, [text]);

  // Update engine config when settings change
  useEffect(() => {
    if (engine) {
      const wasPlaying = engine.isActive();
      engine.updateConfig({
        wpm: settings.wpm,
        chunkSize: settings.chunkSize,
        punctuationPause: settings.punctuationPause,
        shortWordFactor: settings.shortWordFactor,
      });
      if (wasPlaying && !isPlaying) {
        engine.play();
        setIsPlaying(true);
      }
    }
  }, [settings.wpm, settings.chunkSize, settings.punctuationPause, settings.shortWordFactor, engine, isPlaying]);

  // Update stats periodically
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const timeSpent = (Date.now() - sessionStartTime) / 1000;
      const newStats = updateStats(stats, wordsReadThisSession, timeSpent);
      setStats(newStats);
      saveStats(newStats);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, sessionStartTime, wordsReadThisSession, stats]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!engine) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (isPlaying) {
            engine.pause();
            setIsPlaying(false);
          } else {
            engine.play();
            setIsPlaying(true);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (e.shiftKey) {
            engine.seek(-10);
          } else {
            engine.seek(-1);
          }
          const chunkLeft = engine.getCurrentChunk();
          setCurrentWord(chunkLeft ? chunkLeft.map(t => t.text).join(' ') : '');
          setCurrentIndex(engine.getCurrentIndex());
          setProgress(engine.getProgress());
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (e.shiftKey) {
            engine.seek(10);
          } else {
            engine.seek(1);
          }
          const chunkRight = engine.getCurrentChunk();
          setCurrentWord(chunkRight ? chunkRight.map(t => t.text).join(' ') : '');
          setCurrentIndex(engine.getCurrentIndex());
          setProgress(engine.getProgress());
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSettings(prev => ({ ...prev, wpm: Math.min(1200, prev.wpm + 50) }));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSettings(prev => ({ ...prev, wpm: Math.max(100, prev.wpm - 50) }));
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'h':
        case 'H':
          e.preventDefault();
          setSettings(prev => ({ ...prev, uiHidden: !prev.uiHidden }));
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          engine.restart();
          setIsPlaying(false);
          setCurrentWord('');
          setProgress(0);
          setCurrentIndex(0);
          setWordsReadThisSession(0);
          setSessionStartTime(Date.now());
          break;
        case 's':
        case 'S':
          e.preventDefault();
          if (e.ctrlKey || e.metaKey) handleAddBookmark();
          else if (e.shiftKey) setShowSettings(true);
          break;
        case 't':
        case 'T':
          if (!e.shiftKey) break;
          e.preventDefault();
          setShowStats(true);
          break;
        case 'b':
        case 'B':
          e.preventDefault();
          handleAddBookmark();
          break;
        case 'g':
        case 'G':
          e.preventDefault();
          setShowJumpDialog(true);
          break;
        case 'Escape':
          setShowSettings(false);
          setShowStats(false);
          setShowBookmarks(false);
          setShowJumpDialog(false);
          setSettings(prev => ({ ...prev, uiHidden: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [engine, isPlaying, settings]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleAddBookmark = () => {
    if (!engine || !text) return;
    
    addBookmark({
      title: title || 'Untitled',
      text: currentWord || text.substring(0, 100),
      position: currentIndex,
      note: '',
    });
    
    setBookmarks(loadBookmarks());
  };

  const handleDeleteBookmark = (id: string) => {
    removeBookmark(id);
    setBookmarks(loadBookmarks());
  };

  const handleJumpToBookmark = (position: number) => {
    if (!engine) return;
    engine.seekTo(position);
    const chunk = engine.getCurrentChunk();
    setCurrentWord(chunk ? chunk.map(t => t.text).join(' ') : '');
    setCurrentIndex(engine.getCurrentIndex());
    setProgress(engine.getProgress());
    setShowBookmarks(false);
  };

  if (!text.trim()) {
    return null;
  }

  const themeColors = getThemeColors(settings.theme);
  const fontSize = `${settings.fontSize}rem`;
  
  // ORP (Optimal Recognition Point): red letter index so it stays at fixed screen position
  // With monospace + translateX(-orpIndex ch), the red letter never moves — zero eye movement
  const orpIndex = currentWord.length > 0
    ? (settings.showORP ? Math.floor(currentWord.length / 3) : Math.floor(currentWord.length / 2))
    : 0;
  const wordBeforeORP = currentWord ? currentWord.substring(0, orpIndex) : '';
  const wordAtORP = currentWord ? currentWord.substring(orpIndex, orpIndex + 1) : '';
  const wordAfterORP = currentWord ? currentWord.substring(orpIndex + 1) : '';

  const wordCount = text.split(/\s+/).length;
  const wpmLabel = locale === 'tr' ? 'DKM' : 'WPM';
  const translateCh = currentWord ? currentWord.length / 2 - orpIndex : 0;

  const remainingWords = total - currentIndex;
  const timeRemainingSec = total > 0 && settings.wpm > 0
    ? Math.ceil((remainingWords / settings.wpm) * 60)
    : 0;
  const timeRemainingStr = `${Math.floor(timeRemainingSec / 60)}:${String(timeRemainingSec % 60).padStart(2, '0')}`;

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!engine || total === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const idx = Math.floor(pct * total);
    engine.seekTo(Math.max(0, Math.min(total, idx)));
    const chunk = engine.getCurrentChunk();
    setCurrentWord(chunk ? chunk.map(c => c.text).join(' ') : '');
    setCurrentIndex(engine.getCurrentIndex());
    setProgress(engine.getProgress());
  };

  return (
    <div className={`reader-container${isPlaying ? ' reader-playing' : ''}`} ref={containerRef}>
      {/* Minimal header: logo left, icons right; hidden when playing for minimal view */}
      <header className="reader-header">
        <div className="reader-header-left">
          {onBackToHome && (
            <button type="button" className="reader-back-btn" onClick={onBackToHome} aria-label={t('reader.home')}>
              {t('reader.home')}
            </button>
          )}
          <div className="reader-logo">{t('app.title')}</div>
        </div>
        <div className="reader-header-icons">
          <button type="button" className="reader-icon-btn" onClick={() => setShowJumpDialog(true)} title={t('bookmarks.jump')} aria-label="Jump">
            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" /></svg>
          </button>
          {onBackToHome && (
            <button type="button" className="reader-icon-btn" onClick={onBackToHome} title={t('reader.home')} aria-label="Home">
              <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>
            </button>
          )}
          <button type="button" className="reader-icon-btn" onClick={() => setShowBookmarks(true)} title={t('bookmarks.title')} aria-label="Save">
            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" /></svg>
          </button>
          <button type="button" className="reader-icon-btn" onClick={toggleFullscreen} title={isFullscreen ? t('reader.exitFullscreen') : t('reader.fullscreen')} aria-label="Fullscreen">
            {isFullscreen ? (
              <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16v3a2 2 0 002 2h3" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" /></svg>
            )}
          </button>
          <button type="button" className="reader-icon-btn" onClick={() => setShowSettings(true)} title={t('reader.settings')} aria-label="Settings">
            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
          </button>
        </div>
      </header>

      <div className="reader-display">
        <div
          className="word-display word-display-focal"
          ref={wordRef}
          style={settings.showORP ? { ['--focal-line-color' as string]: settings.orpColor } : undefined}
        >
          {settings.showORP && <div className="focal-line focal-line-above" />}
          {currentWord && (
            <div
              className="word-focal-wrapper"
              style={{
                transform: `translateX(${translateCh}ch)`,
                fontFamily: '"SF Mono", "Cascadia Code", "IBM Plex Mono", Consolas, "Liberation Mono", "Courier New", ui-monospace, monospace',
                fontSize,
              }}
            >
              <span
                className="word-content"
                style={{ color: themeColors.wordDisplay }}
              >
                {settings.showORP ? (
                  <>
                    <span className="word-before" style={{ color: themeColors.wordBefore }}>
                      {wordBeforeORP}
                    </span>
                    <span
                      className="word-orp"
                      style={{
                        color: settings.orpColor,
                        textShadow: `0 0 10px ${settings.orpColor}40`,
                      }}
                    >
                      {wordAtORP}
                    </span>
                    <span className="word-after">{wordAfterORP}</span>
                  </>
                ) : (
                  <span>{currentWord}</span>
                )}
              </span>
            </div>
          )}
          {settings.showORP && <div className="focal-line focal-line-below" />}
        </div>
      </div>

      {showUI && settings.showControls && (
        <div className="reader-controls reader-controls-minimal">
          <div className="progress-bar-minimal" onClick={handleProgressBarClick}>
            <span className="progress-bar-left">{currentIndex} / {total}</span>
            <span className="progress-bar-right">{timeRemainingStr}</span>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress * 100}%`, background: themeColors.accent }} />
            </div>
          </div>
          <div className="wpm-display" style={{ color: themeColors.accent }}>{settings.wpm} {wpmLabel}</div>
          <div className="controls-play-row">
            <button
              type="button"
              className="control-btn control-btn-play"
              onClick={() => {
                if (isPlaying) { engine?.pause(); setIsPlaying(false); } else { engine?.play(); setIsPlaying(true); }
              }}
              aria-label={isPlaying ? t('reader.pause') : t('reader.play')}
            >
              {isPlaying ? t('reader.pause') : t('reader.play')}
            </button>
            <button
              type="button"
              className="control-btn control-btn-stop"
              onClick={() => {
                engine?.pause();
                setIsPlaying(false);
              }}
              aria-label={t('reader.stop')}
            >
              {t('reader.stop')}
            </button>
            <button
              type="button"
              className="control-btn control-btn-restart"
              onClick={() => {
                engine?.restart();
                setIsPlaying(false);
                setCurrentWord('');
                setProgress(0);
                setCurrentIndex(0);
                setWordsReadThisSession(0);
                setSessionStartTime(Date.now());
              }}
              aria-label={t('reader.restart')}
            >
              {t('reader.restart')}
            </button>
          </div>
          <div className="shortcut-hints">
            <span>{t('reader.shortcutPlay')}</span>
            <span>{t('reader.shortcutExit')}</span>
            <span>{t('reader.shortcutSpeed')}</span>
            <span>{t('reader.shortcutSkip')}</span>
            <span>{t('reader.shortcutJump')}</span>
            <span>{t('reader.shortcutSave')}</span>
          </div>
          <button type="button" className="control-more-btn" onClick={() => setShowMoreControls(v => !v)} aria-label="More">
            {showMoreControls ? '▲' : '···'}
          </button>
          {showMoreControls && (
            <div className="controls-extra">
              <Slider label={wpmLabel} value={settings.wpm} min={100} max={1200} step={50} onChange={(v) => setSettings(prev => ({ ...prev, wpm: v }))} disabled={!engine} />
              <button type="button" className="control-button control-button-small" onClick={() => { setShowStats(true); setShowMoreControls(false); }}>{t('reader.stats')}</button>
              <button type="button" className="control-button control-button-small" onClick={() => setSettings(prev => ({ ...prev, uiHidden: true }))}>{t('reader.hideUi')}</button>
            </div>
          )}
        </div>
      )}

      {!showUI && (
        <button
          className="show-ui-button"
          onClick={() => setSettings(prev => ({ ...prev, uiHidden: false }))}
        >
          {t('reader.showUi')}
        </button>
      )}

      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setShowSettings(false)}
          locale={locale}
        />
      )}

      {showStats && (
        <StatsPanel
          stats={stats}
          currentWPM={settings.wpm}
          currentProgress={progress}
          wordsInDocument={wordCount}
          onClose={() => setShowStats(false)}
          locale={locale}
        />
      )}

      {showBookmarks && (
        <BookmarksPanel
          bookmarks={bookmarks}
          onClose={() => setShowBookmarks(false)}
          onJumpToBookmark={handleJumpToBookmark}
          onDeleteBookmark={handleDeleteBookmark}
          locale={locale}
        />
      )}

      {showJumpDialog && engine && (
        <div className="reader-modal-overlay" onClick={() => setShowJumpDialog(false)}>
          <div className="reader-modal" onClick={e => e.stopPropagation()}>
            <h3>{locale === 'tr' ? 'Konuma git' : 'Jump to position'}</h3>
            <input
              type="text"
              className="reader-jump-input"
              placeholder={locale === 'tr' ? 'Kelime no veya %50' : 'Word number or 50%'}
              value={jumpInput}
              onChange={e => setJumpInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const v = jumpInput.trim();
                  if (v.endsWith('%')) {
                    const pct = Math.max(0, Math.min(100, parseFloat(v) || 0));
                    const idx = Math.floor((pct / 100) * total);
                    engine.seekTo(idx);
                  } else {
                    const idx = Math.max(0, Math.min(total, parseInt(v, 10) || 0));
                    engine.seekTo(idx);
                  }
                  const chunk = engine.getCurrentChunk();
                  setCurrentWord(chunk ? chunk.map(c => c.text).join(' ') : '');
                  setCurrentIndex(engine.getCurrentIndex());
                  setProgress(engine.getProgress());
                  setShowJumpDialog(false);
                  setJumpInput('');
                }
              }}
            />
            <div className="reader-modal-actions">
              <button type="button" className="control-button" onClick={() => setShowJumpDialog(false)}>{t('bookmarks.cancel')}</button>
              <button
                type="button"
                className="control-button control-btn-play"
                onClick={() => {
                  const v = jumpInput.trim();
                  if (v.endsWith('%')) {
                    const pct = Math.max(0, Math.min(100, parseFloat(v) || 0));
                    engine.seekTo(Math.floor((pct / 100) * total));
                  } else {
                    engine.seekTo(Math.max(0, Math.min(total, parseInt(v, 10) || 0)));
                  }
                  const chunk = engine.getCurrentChunk();
                  setCurrentWord(chunk ? chunk.map(c => c.text).join(' ') : '');
                  setCurrentIndex(engine.getCurrentIndex());
                  setProgress(engine.getProgress());
                  setShowJumpDialog(false);
                  setJumpInput('');
                }}
              >
                {locale === 'tr' ? 'Git' : 'Go'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
