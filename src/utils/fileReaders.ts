import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface FileReadResult {
  text: string;
  title?: string;
  metadata?: Record<string, any>;
}

export async function readTextFile(file: File): Promise<FileReadResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve({ text, title: file.name });
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export async function readPDFFile(file: File): Promise<FileReadResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    const metadata = await pdf.getMetadata();
    const info = metadata?.info as { Title?: string; [key: string]: unknown } | undefined;
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: unknown) => (item && typeof item === 'object' && 'str' in item ? (item as { str: string }).str : ''))
        .join(' ');
      fullText += pageText + '\n\n';
    }
    
    return {
      text: fullText.trim(),
      title: info?.Title || file.name,
      metadata: {
        pages: pdf.numPages,
        ...info,
      },
    };
  } catch (error) {
    throw new Error(`Failed to read PDF: ${error}`);
  }
}

export async function readEPUBFile(file: File): Promise<FileReadResult> {
  try {
    // Dynamic import for epubjs
    const { default: ePub } = await import('epubjs');
    const arrayBuffer = await file.arrayBuffer();
    const book = ePub(arrayBuffer);
    
    await book.ready;
    const metadata = await book.loaded.metadata;
    
    let fullText = '';
    const spine = await book.loaded.spine;
    const spineItems = Array.isArray(spine) ? spine : (spine as { items: unknown[] }).items ?? [];
    
    for (const item of spineItems) {
      try {
        const section = await (item as { load: (fn: (url: string) => Promise<unknown>) => Promise<unknown> }).load(book.load.bind(book));
        if (section && typeof section === 'object' && 'querySelector' in section) {
          const doc = section as Document;
          const body = doc.querySelector('body');
          if (body) {
            fullText += body.innerText || body.textContent || '';
          } else {
            fullText += (doc as Document & { innerText?: string }).innerText || doc.textContent || '';
          }
          fullText += '\n\n';
        }
      } catch (err) {
        console.warn('Failed to load EPUB section:', err);
        // Continue with next section
      }
    }
    
    return {
      text: fullText.trim() || 'Failed to extract text from EPUB',
      title: metadata?.title || file.name,
      metadata: {
        author: metadata?.creator,
        ...metadata,
      },
    };
  } catch (error) {
    throw new Error(`Failed to read EPUB: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function readHTMLFile(file: File): Promise<FileReadResult> {
  const text = await file.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  
  // Remove script and style elements
  const scripts = doc.querySelectorAll('script, style');
  scripts.forEach(el => el.remove());
  
  const bodyText = doc.body?.innerText || text;
  
  return {
    text: bodyText.trim(),
    title: doc.title || file.name,
  };
}

export async function readMarkdownFile(file: File): Promise<FileReadResult> {
  const text = await file.text();
  // Basic markdown to text conversion (remove markdown syntax)
  const plainText = text
    .replace(/^#+\s+/gm, '') // Remove headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
    .replace(/`(.+?)`/g, '$1') // Remove code
    .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
    .replace(/^\s*\d+\.\s+/gm, ''); // Remove numbered list markers
  
  return {
    text: plainText.trim(),
    title: file.name,
  };
}

export async function readFile(file: File): Promise<FileReadResult> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return readPDFFile(file);
    case 'epub':
      return readEPUBFile(file);
    case 'html':
    case 'htm':
      return readHTMLFile(file);
    case 'md':
    case 'markdown':
      return readMarkdownFile(file);
    case 'txt':
    default:
      return readTextFile(file);
  }
}
