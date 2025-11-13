import { useState } from 'react';

export function useCopyToClipboard(): [string | null, (text: string) => Promise<void>] {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
    } catch (error) {
      console.error('Failed to copy:', error);
      setCopiedText(null);
    }
  };

  return [copiedText, copy];
}
