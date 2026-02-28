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
}

export const Reader: React.FC<ReaderProps> = ({ text, title }) => {
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
          if (!e.shiftKey) break;
          e.preventDefault();
          setShowSettings(true);
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
        case 'Escape':
          setShowSettings(false);
          setShowStats(false);
          setShowBookmarks(false);
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
  const wordLabel = locale === 'tr' ? 'kelime' : 'words';
  const wpmLabel = locale === 'tr' ? 'DKM' : 'WPM';
  const translateCh = currentWord ? currentWord.length / 2 - orpIndex : 0;

  return (
    <div className="reader-container" ref={containerRef}>
      <div className="reader-display">
        <div className="word-display word-display-focal" ref={wordRef}>
          {currentWord && (
            <div
              className="word-focal-wrapper"
              style={{
                transform: `translateX(${translateCh}ch)`,
                fontFamily: '"Liberation Mono", "Courier New", Consolas, ui-monospace, monospace',
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
        </div>
      </div>

      {showUI && settings.showControls && (
        <div className={`reader-controls ${settings.compactControls ? 'compact' : ''}`}>
          <div className="controls-top">
            <button
              className="control-button"
              onClick={() => {
                if (isPlaying) {
                  engine?.pause();
                  setIsPlaying(false);
                } else {
                  engine?.play();
                  setIsPlaying(true);
                }
              }}
            >
              {isPlaying ? t('reader.pause') : t('reader.play')}
            </button>
            <button
              className="control-button"
              onClick={() => {
                engine?.restart();
                setIsPlaying(false);
                setCurrentWord('');
                setProgress(0);
                setCurrentIndex(0);
                setWordsReadThisSession(0);
                setSessionStartTime(Date.now());
              }}
            >
              {t('reader.restart')}
            </button>
            <button
              className="control-button"
              onClick={() => {
                engine?.seek(-1);
                const chunk = engine?.getCurrentChunk();
                setCurrentWord(chunk ? chunk.map(t => t.text).join(' ') : '');
                setCurrentIndex(engine?.getCurrentIndex() || 0);
                setProgress(engine?.getProgress() || 0);
              }}
            >
              {t('reader.back')}
            </button>
            <button
              className="control-button"
              onClick={() => {
                engine?.seek(1);
                const chunk = engine?.getCurrentChunk();
                setCurrentWord(chunk ? chunk.map(t => t.text).join(' ') : '');
                setCurrentIndex(engine?.getCurrentIndex() || 0);
                setProgress(engine?.getProgress() || 0);
              }}
            >
              {t('reader.forward')}
            </button>
            <button
              className="control-button"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? t('reader.exitFullscreen') : t('reader.fullscreen')}
            </button>
            <button
              className="control-button"
              onClick={() => setShowSettings(true)}
            >
              {t('reader.settings')}
            </button>
            <button
              className="control-button"
              onClick={() => setShowStats(true)}
            >
              {t('reader.stats')}
            </button>
            <button
              className="control-button"
              onClick={() => setShowBookmarks(true)}
            >
              {t('reader.bookmarks')} ({bookmarks.length})
            </button>
            <button
              className="control-button"
              onClick={() => setSettings(prev => ({ ...prev, uiHidden: true }))}
            >
              {t('reader.hideUi')}
            </button>
          </div>

          {!settings.compactControls && (
            <>
              <div className="controls-sliders">
                <Slider
                  label="WPM"
                  value={settings.wpm}
                  min={100}
                  max={1200}
                  step={50}
                  onChange={(v) => setSettings(prev => ({ ...prev, wpm: v }))}
                  disabled={!engine}
                />
                <Slider
                  label="Chunk Size"
                  value={settings.chunkSize}
                  min={1}
                  max={4}
                  step={1}
                  onChange={(v) => setSettings(prev => ({ ...prev, chunkSize: v }))}
                  disabled={!engine || isPlaying}
                />
              </div>

              {settings.showProgress && (
                <div className="controls-info">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${progress * 100}%`,
                        background: `linear-gradient(90deg, ${themeColors.accent}, ${themeColors.accentHover})`,
                      }}
                    />
                  </div>
                  <div className="progress-text">
                    {currentIndex} / {total} ({Math.round(progress * 100)}%)
                    {settings.showStats && ` • ${settings.wpm} ${wpmLabel} • ${wordCount} ${wordLabel}`}
                  </div>
                </div>
              )}
            </>
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
    </div>
  );
};
