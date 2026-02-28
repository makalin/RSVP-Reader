import React, { useState } from 'react';
import { Bookmark, updateBookmark } from '../utils/bookmarks';
import { Locale, t as tt } from '../utils/i18n';
import './BookmarksPanel.css';

interface BookmarksPanelProps {
  bookmarks: Bookmark[];
  onClose: () => void;
  onJumpToBookmark: (position: number) => void;
  onDeleteBookmark: (id: string) => void;
  locale: Locale;
}

export const BookmarksPanel: React.FC<BookmarksPanelProps> = ({
  bookmarks,
  onClose,
  onJumpToBookmark,
  onDeleteBookmark,
  locale,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');

  const t = (key: Parameters<typeof tt>[1]) => tt(locale, key);

  const handleEdit = (bookmark: Bookmark) => {
    setEditingId(bookmark.id);
    setEditNote(bookmark.note || '');
  };

  const handleSaveEdit = (id: string) => {
    updateBookmark(id, { note: editNote });
    setEditingId(null);
    setEditNote('');
  };

  return (
    <div className="bookmarks-overlay" onClick={onClose}>
      <div className="bookmarks-panel" onClick={(e) => e.stopPropagation()}>
        <div className="bookmarks-header">
          <h2>{t('bookmarks.title')} ({bookmarks.length})</h2>
          <button className="bookmarks-close" onClick={onClose}>×</button>
        </div>

        <div className="bookmarks-content">
          {bookmarks.length === 0 ? (
            <div className="bookmarks-empty">
              <p>{t('bookmarks.empty')}</p>
              <p className="bookmarks-hint">{t('bookmarks.hint')}</p>
            </div>
          ) : (
            <div className="bookmarks-list">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="bookmark-item">
                  <div className="bookmark-header">
                    <div className="bookmark-title">{bookmark.title}</div>
                    <div className="bookmark-actions">
                      <button
                        className="bookmark-action"
                        onClick={() => onJumpToBookmark(bookmark.position)}
                        title={t('bookmarks.jump')}
                      >
                        →
                      </button>
                      <button
                        className="bookmark-action"
                        onClick={() => onDeleteBookmark(bookmark.id)}
                        title={t('bookmarks.delete')}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div className="bookmark-preview">
                    {bookmark.text.substring(0, 100)}
                    {bookmark.text.length > 100 ? '...' : ''}
                  </div>
                  {editingId === bookmark.id ? (
                    <div className="bookmark-edit">
                      <textarea
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        placeholder={`${t('bookmarks.addNote')}...`}
                        rows={2}
                      />
                      <div className="bookmark-edit-actions">
                        <button onClick={() => handleSaveEdit(bookmark.id)}>{t('bookmarks.save')}</button>
                        <button onClick={() => setEditingId(null)}>{t('bookmarks.cancel')}</button>
                      </div>
                    </div>
                  ) : (
                    bookmark.note && (
                      <div className="bookmark-note">{bookmark.note}</div>
                    )
                  )}
                  {editingId !== bookmark.id && (
                    <button
                      className="bookmark-edit-btn"
                      onClick={() => handleEdit(bookmark)}
                    >
                      {bookmark.note ? t('bookmarks.editNote') : t('bookmarks.addNote')}
                    </button>
                  )}
                  <div className="bookmark-meta">
                    {t('bookmarks.position')}: {bookmark.position} • {new Date(bookmark.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
