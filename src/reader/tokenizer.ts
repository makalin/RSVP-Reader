export interface Token {
  text: string;
  isPunctuation: boolean;
  isShortWord: boolean;
  length: number;
}

const PUNCTUATION = /[.,!?;:—–\-'"()[\]{}]/;
const SHORT_WORD_THRESHOLD = 3;

export function tokenize(text: string): Token[] {
  // Remove extra whitespace and normalize
  const normalized = text.replace(/\s+/g, ' ').trim();
  
  if (!normalized) return [];

  const tokens: Token[] = [];
  const words = normalized.split(/\s+/);

  for (const word of words) {
    if (!word) continue;

    // Check if word ends with punctuation
    const hasPunctuation = PUNCTUATION.test(word);
    const isShortWord = word.replace(PUNCTUATION, '').length <= SHORT_WORD_THRESHOLD;

    tokens.push({
      text: word,
      isPunctuation: hasPunctuation,
      isShortWord,
      length: word.length
    });
  }

  return tokens;
}

export function createChunks(tokens: Token[], chunkSize: number): Token[][] {
  if (chunkSize <= 1) {
    return tokens.map(token => [token]);
  }

  const chunks: Token[][] = [];
  for (let i = 0; i < tokens.length; i += chunkSize) {
    chunks.push(tokens.slice(i, i + chunkSize));
  }
  return chunks;
}
