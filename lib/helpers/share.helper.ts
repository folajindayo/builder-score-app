/**
 * Share Helper
 */

export function shareOnTwitter(text: string, url?: string) {
  const twitterUrl = new URL('https://twitter.com/intent/tweet');
  twitterUrl.searchParams.set('text', text);
  
  if (url) {
    twitterUrl.searchParams.set('url', url);
  }
  
  window.open(twitterUrl.toString(), '_blank');
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (!navigator?.clipboard) {
    return Promise.resolve(false);
  }
  
  return navigator.clipboard.writeText(text)
    .then(() => true)
    .catch(() => false);
}

export function shareProfile(address: string, score: number) {
  const text = `Check out my Builder Score: ${score}/100! 🚀`;
  const url = `${window.location.origin}/profile/${address}`;
  
  shareOnTwitter(text, url);
}

