/**
 * Image storage utilities
 */

const IMAGE_STORAGE_KEY = 'profile-images';

export async function uploadProfileImage(address: string, file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const base64 = reader.result as string;
      try {
        localStorage.setItem(`${IMAGE_STORAGE_KEY}:${address}`, base64);
        resolve(base64);
      } catch (error) {
        reject(new Error('Failed to store image'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function getProfileImage(address: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(`${IMAGE_STORAGE_KEY}:${address}`);
}

export function deleteProfileImage(address: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`${IMAGE_STORAGE_KEY}:${address}`);
}

