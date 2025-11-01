import mammoth from 'mammoth';

/**
 * Parse a .txt file and convert to editor content
 */
export async function parseTxtFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read text file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Parse a .docx file and extract text content using mammoth
 */
export async function parseDocxFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        
        // Use mammoth to extract text from docx
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value || 'Document is empty.');
      } catch (error) {
        console.error('Error parsing docx:', error);
        reject(new Error('Failed to parse docx file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read docx file'));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Convert plain text to Tiptap JSON content
 */
export function textToTiptapContent(text: string): any {
  const lines = text.split('\n').filter((line) => line.trim() !== '');
  
  const content = lines.map((line) => ({
    type: 'paragraph',
    content: [
      {
        type: 'text',
        text: line,
      },
    ],
  }));

  return {
    type: 'doc',
    content: content.length > 0 ? content : [{ type: 'paragraph' }],
  };
}

/**
 * Main function to import a document file
 */
export async function importDocument(file: File): Promise<any> {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  let text = '';

  if (fileExtension === 'txt') {
    text = await parseTxtFile(file);
  } else if (fileExtension === 'docx') {
    text = await parseDocxFile(file);
  } else {
    throw new Error('Unsupported file format. Please use .txt or .docx files.');
  }

  return textToTiptapContent(text);
}

