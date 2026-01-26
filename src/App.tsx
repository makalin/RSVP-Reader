import React, { useState } from 'react';
import { Reader } from './reader/Reader';
import { readFile } from './utils/fileReaders';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [inputText, setInputText] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoadText = () => {
    if (inputText.trim()) {
      setText(inputText.trim());
      setTitle('Pasted Text');
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

  return (
    <div className="app">
      <div className="app-container">
        <h1>RSVP Reader</h1>
        <p className="app-subtitle">
          Rapid Serial Visual Presentation reader. Read any document one word at a time.
        </p>

        <div className="app-input-section">
          {error && (
            <div className="app-error">
              ⚠️ {error}
            </div>
          )}
          
          <textarea
            className="app-textarea"
            placeholder="Paste your text here or upload a file below..."
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
              Start Reading
            </button>

            <label className="app-button app-button-secondary">
              {loading ? 'Loading...' : 'Upload File'}
              <input
                type="file"
                accept=".txt,.md,.html,.pdf,.epub"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                disabled={loading}
              />
            </label>
          </div>
        </div>

        <div className="app-info">
          <h3>Keyboard Shortcuts</h3>
          <div className="app-shortcuts">
            <div><kbd>Space</kbd> Play / Pause</div>
            <div><kbd>←</kbd> / <kbd>→</kbd> Seek</div>
            <div><kbd>Shift</kbd> + <kbd>←</kbd> / <kbd>→</kbd> Large seek</div>
            <div><kbd>↑</kbd> / <kbd>↓</kbd> Adjust WPM</div>
            <div><kbd>F</kbd> Fullscreen</div>
            <div><kbd>H</kbd> Toggle UI</div>
            <div><kbd>R</kbd> Restart</div>
            <div><kbd>Shift</kbd> + <kbd>S</kbd> Settings</div>
            <div><kbd>Shift</kbd> + <kbd>T</kbd> Statistics</div>
            <div><kbd>B</kbd> Bookmark</div>
          </div>
        </div>

        <div className="app-features">
          <h3>Supported Formats</h3>
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
