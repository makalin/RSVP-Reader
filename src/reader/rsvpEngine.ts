import { Token, tokenize, createChunks } from './tokenizer';

export interface RSVPConfig {
  wpm: number;
  chunkSize: number;
  punctuationPause: number;
  shortWordFactor: number;
}

export interface RSVPEvent {
  type: 'word' | 'chunk' | 'pause' | 'end';
  content: string;
  index: number;
  total: number;
}

const DEFAULT_CONFIG: RSVPConfig = {
  wpm: 300,
  chunkSize: 1,
  punctuationPause: 0.5,
  shortWordFactor: 0.8
};

export class RSVPEngine {
  private tokens: Token[] = [];
  private chunks: Token[][] = [];
  private config: RSVPConfig = DEFAULT_CONFIG;
  private currentIndex: number = 0;
  private isPlaying: boolean = false;
  private timeoutId: number | null = null;
  private onEvent: ((event: RSVPEvent) => void) | null = null;

  constructor(text: string, config?: Partial<RSVPConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.loadText(text);
  }

  loadText(text: string): void {
    this.stop();
    this.tokens = tokenize(text);
    this.chunks = createChunks(this.tokens, this.config.chunkSize);
    this.currentIndex = 0;
  }

  updateConfig(config: Partial<RSVPConfig>): void {
    this.config = { ...this.config, ...config };
    if (this.config.chunkSize !== config.chunkSize) {
      this.chunks = createChunks(this.tokens, this.config.chunkSize);
    }
  }

  setOnEvent(callback: (event: RSVPEvent) => void): void {
    this.onEvent = callback;
  }

  private calculateDelay(token: Token | Token[]): number {
    const tokens = Array.isArray(token) ? token : [token];
    const baseDelay = (60000 / this.config.wpm) * tokens.length;

    let delay = baseDelay;

    // Add punctuation pause
    const hasPunctuation = tokens.some(t => t.isPunctuation);
    if (hasPunctuation) {
      delay += baseDelay * this.config.punctuationPause;
    }

    // Apply short word compensation
    const hasShortWord = tokens.some(t => t.isShortWord);
    if (hasShortWord) {
      delay *= this.config.shortWordFactor;
    }

    return Math.max(delay, 50); // Minimum 50ms
  }

  private emit(event: RSVPEvent): void {
    if (this.onEvent) {
      this.onEvent(event);
    }
  }

  private processNext(): void {
    if (this.currentIndex >= this.chunks.length) {
      this.isPlaying = false;
      this.emit({
        type: 'end',
        content: '',
        index: this.currentIndex,
        total: this.chunks.length
      });
      return;
    }

    const chunk = this.chunks[this.currentIndex];
    const content = chunk.map(t => t.text).join(' ');
    const delay = this.calculateDelay(chunk);

    this.emit({
      type: this.config.chunkSize > 1 ? 'chunk' : 'word',
      content,
      index: this.currentIndex,
      total: this.chunks.length
    });

    this.currentIndex++;

    if (this.isPlaying) {
      this.timeoutId = window.setTimeout(() => {
        this.processNext();
      }, delay);
    }
  }

  play(): void {
    if (this.isPlaying) return;
    if (this.currentIndex >= this.chunks.length) {
      this.restart();
    }
    this.isPlaying = true;
    this.processNext();
  }

  pause(): void {
    this.isPlaying = false;
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  stop(): void {
    this.pause();
    this.currentIndex = 0;
  }

  restart(): void {
    this.stop();
    this.currentIndex = 0;
  }

  seek(offset: number): void {
    this.pause();
    this.currentIndex = Math.max(0, Math.min(this.chunks.length, this.currentIndex + offset));
  }

  seekTo(index: number): void {
    this.pause();
    this.currentIndex = Math.max(0, Math.min(this.chunks.length, index));
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  getTotal(): number {
    return this.chunks.length;
  }

  getProgress(): number {
    if (this.chunks.length === 0) return 0;
    return this.currentIndex / this.chunks.length;
  }

  isActive(): boolean {
    return this.isPlaying;
  }

  getCurrentChunk(): Token[] | null {
    if (this.currentIndex >= this.chunks.length) return null;
    return this.chunks[this.currentIndex];
  }
}
