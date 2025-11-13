import { useState, useEffect, useRef } from 'react';
import type { RefObject } from 'react';

export function useFocus<T extends HTMLElement>() {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<T>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    node.addEventListener('focus', handleFocus);
    node.addEventListener('blur', handleBlur);
    return () => {
      node.removeEventListener('focus', handleFocus);
      node.removeEventListener('blur', handleBlur);
    };
  }, []);
  return [ref, isFocused] as const;
}