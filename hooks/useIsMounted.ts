import { useState, useEffect, useRef } from 'react';
import type { RefObject } from 'react';

export function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}