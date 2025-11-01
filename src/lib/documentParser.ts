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
 * Convert image buffer to base64 data URL
 */
function bufferToBase64(buffer: ArrayBuffer | Uint8Array, contentType: string): string {
  let bytes: Uint8Array;
  if (buffer instanceof Uint8Array) {
    bytes = buffer;
  } else {
    bytes = new Uint8Array(buffer);
  }
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return `data:${contentType};base64,${base64}`;
}

/**
 * Parse a .docx file and extract HTML with preserved formatting using mammoth
 */
export async function parseDocxFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        
        // Use mammoth to convert docx to HTML with formatting preserved
        // Also extract images and convert them to base64 data URLs
        const result = await mammoth.convertToHtml(
          { arrayBuffer },
          {
            convertImage: mammoth.images.imgElement((image) => {
              return image.read('buffer').then((imageBuffer: any) => {
                const contentType = image.contentType || 'image/png';
                // Mammoth returns a Buffer in Node or ArrayBuffer/Uint8Array in browser
                // Convert to Uint8Array if needed
                let buffer: ArrayBuffer | Uint8Array;
                if (imageBuffer instanceof ArrayBuffer) {
                  buffer = imageBuffer;
                } else if (imageBuffer instanceof Uint8Array) {
                  buffer = imageBuffer;
                } else if (imageBuffer?.buffer instanceof ArrayBuffer) {
                  // Handle Buffer objects
                  buffer = new Uint8Array(imageBuffer.buffer);
                } else {
                  // Fallback: try to create Uint8Array from the value
                  buffer = new Uint8Array(imageBuffer);
                }
                return {
                  src: bufferToBase64(buffer, contentType),
                };
              });
            }),
          }
        );
        
        resolve(result.value || '<p>Document is empty.</p>');
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
 * Convert HTML string to Tiptap JSON document structure
 */
export function htmlToTiptapContent(html: string): any {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const body = doc.body;

  const content: any[] = [];

  /**
   * Process text nodes and inline elements within a parent
   */
  function processInlineNodes(element: Node): any[] {
    const nodes: any[] = [];
    const children = Array.from(element.childNodes);

    let currentText = '';
    let marks: string[] = [];

    function flushText() {
      if (currentText.trim()) {
        const node: any = {
          type: 'text',
          text: currentText,
        };
        if (marks.length > 0) {
          node.marks = marks.map((mark) => ({ type: mark }));
        }
        nodes.push(node);
        currentText = '';
      }
    }

    for (const child of children) {
      if (child.nodeType === Node.TEXT_NODE) {
        currentText += child.textContent || '';
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as Element;
        const tagName = el.tagName.toLowerCase();

        // Handle inline elements
        if (['strong', 'b'].includes(tagName)) {
          flushText();
          const nested = processInlineNodes(el);
          nested.forEach((n) => {
            if (n.type === 'text') {
              if (!n.marks) n.marks = [];
              if (!n.marks.some((m: any) => m.type === 'bold')) {
                n.marks.push({ type: 'bold' });
              }
            }
          });
          nodes.push(...nested);
        } else if (['em', 'i'].includes(tagName)) {
          flushText();
          const nested = processInlineNodes(el);
          nested.forEach((n) => {
            if (n.type === 'text') {
              if (!n.marks) n.marks = [];
              if (!n.marks.some((m: any) => m.type === 'italic')) {
                n.marks.push({ type: 'italic' });
              }
            }
          });
          nodes.push(...nested);
        } else if (tagName === 'code') {
          flushText();
          const nested = processInlineNodes(el);
          nested.forEach((n) => {
            if (n.type === 'text') {
              if (!n.marks) n.marks = [];
              if (!n.marks.some((m: any) => m.type === 'code')) {
                n.marks.push({ type: 'code' });
              }
            }
          });
          nodes.push(...nested);
        } else if (tagName === 'img') {
          flushText();
          const img = el as HTMLImageElement;
          nodes.push({
            type: 'image',
            attrs: {
              src: img.src || img.getAttribute('src') || '',
              alt: img.alt || '',
            },
          });
        } else {
          // Other inline elements - just process their content
          flushText();
          nodes.push(...processInlineNodes(el));
        }
      }
    }

    flushText();
    return nodes;
  }

  /**
   * Process block-level elements
   */
  function processBlockElement(element: Element): any {
    const tagName = element.tagName.toLowerCase();

    // Headings
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
      const level = parseInt(tagName.charAt(1));
      const inlineContent = processInlineNodes(element);
      return {
        type: 'heading',
        attrs: { level },
        content: inlineContent.length > 0 ? inlineContent : [],
      };
    }

    // Paragraphs
    if (tagName === 'p') {
      const inlineContent = processInlineNodes(element);
      return {
        type: 'paragraph',
        content: inlineContent.length > 0 ? inlineContent : [],
      };
    }

    // Lists
    if (tagName === 'ul') {
      const items: any[] = [];
      Array.from(element.children).forEach((li) => {
        if (li.tagName.toLowerCase() === 'li') {
          const inlineContent = processInlineNodes(li);
          items.push({
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: inlineContent.length > 0 ? inlineContent : [],
              },
            ],
          });
        }
      });
      return {
        type: 'bulletList',
        content: items,
      };
    }

    if (tagName === 'ol') {
      const items: any[] = [];
      Array.from(element.children).forEach((li) => {
        if (li.tagName.toLowerCase() === 'li') {
          const inlineContent = processInlineNodes(li);
          items.push({
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: inlineContent.length > 0 ? inlineContent : [],
              },
            ],
          });
        }
      });
      return {
        type: 'orderedList',
        content: items,
      };
    }

    // Blockquote
    if (tagName === 'blockquote') {
      const paragraphs: any[] = [];
      Array.from(element.children).forEach((child) => {
        if (child.tagName.toLowerCase() === 'p') {
          const inlineContent = processInlineNodes(child);
          paragraphs.push({
            type: 'paragraph',
            content: inlineContent.length > 0 ? inlineContent : [],
          });
        }
      });
      return {
        type: 'blockquote',
        content: paragraphs.length > 0 ? paragraphs : [{ type: 'paragraph' }],
      };
    }

    // Default: treat as paragraph
    const inlineContent = processInlineNodes(element);
    return {
      type: 'paragraph',
      content: inlineContent.length > 0 ? inlineContent : [],
    };
  }

  // Process all block-level children of body
  Array.from(body.children).forEach((child) => {
    const blockNode = processBlockElement(child);
    if (blockNode) {
      content.push(blockNode);
    }
  });

  // If body has no children or only text, create a paragraph
  if (content.length === 0) {
    const text = body.textContent || '';
    if (text.trim()) {
      content.push({
        type: 'paragraph',
        content: [{ type: 'text', text: text.trim() }],
      });
    } else {
      content.push({ type: 'paragraph' });
    }
  }

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

  if (fileExtension === 'txt') {
    const text = await parseTxtFile(file);
    return textToTiptapContent(text);
  } else if (fileExtension === 'docx') {
    const html = await parseDocxFile(file);
    return htmlToTiptapContent(html);
  } else {
    throw new Error('Unsupported file format. Please use .txt or .docx files.');
  }
}

