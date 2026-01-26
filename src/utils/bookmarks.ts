export interface Bookmark {
  id: string;
  title: string;
  text: string;
  position: number;
  timestamp: number;
  note?: string;
}

const BOOKMARKS_KEY = 'rsvp-reader-bookmarks';

export function loadBookmarks(): Bookmark[] {
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load bookmarks:', e);
  }
  return [];
}

export function saveBookmarks(bookmarks: Bookmark[]): void {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch (e) {
    console.error('Failed to save bookmarks:', e);
  }
}

export function addBookmark(bookmark: Omit<Bookmark, 'id' | 'timestamp'>): Bookmark {
  const bookmarks = loadBookmarks();
  const newBookmark: Bookmark = {
    ...bookmark,
    id: Date.now().toString(),
    timestamp: Date.now(),
  };
  bookmarks.push(newBookmark);
  saveBookmarks(bookmarks);
  return newBookmark;
}

export function removeBookmark(id: string): void {
  const bookmarks = loadBookmarks();
  const filtered = bookmarks.filter(b => b.id !== id);
  saveBookmarks(filtered);
}

export function updateBookmark(id: string, updates: Partial<Bookmark>): void {
  const bookmarks = loadBookmarks();
  const index = bookmarks.findIndex(b => b.id === id);
  if (index !== -1) {
    bookmarks[index] = { ...bookmarks[index], ...updates };
    saveBookmarks(bookmarks);
  }
}
