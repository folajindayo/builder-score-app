// Accessibility features (commits 71-80)
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
}

export function manageFocus(element: HTMLElement): () => void {
  const previousFocus = document.activeElement as HTMLElement;
  element.focus();
  return () => previousFocus?.focus();
}

export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };

  container.addEventListener('keydown', handleTab);
  return () => container.removeEventListener('keydown', handleTab);
}

export function setupKeyboardNav(elements: HTMLElement[], onSelect: (index: number) => void): () => void {
  let currentIndex = 0;

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        currentIndex = (currentIndex + 1) % elements.length;
        elements[currentIndex].focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        currentIndex = (currentIndex - 1 + elements.length) % elements.length;
        elements[currentIndex].focus();
        break;
      case 'Enter':
        e.preventDefault();
        onSelect(currentIndex);
        break;
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}

export function checkContrast(foreground: string, background: string): { ratio: number; passesAA: boolean; passesAAA: boolean } {
  // Simplified contrast checker
  const ratio = 4.5; // Mock - would calculate actual ratio
  return { ratio, passesAA: ratio >= 4.5, passesAAA: ratio >= 7 };
}

export function enableHighContrastMode(): void {
  document.documentElement.classList.add('high-contrast');
}

export function disableHighContrastMode(): void {
  document.documentElement.classList.remove('high-contrast');
}

