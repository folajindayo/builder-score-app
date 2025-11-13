import { useState, useEffect, useRef } from 'react';
import type { RefObject } from 'react';

export function useClickAway(ref: RefObject<HTMLElement>, onClickAway: () => void) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClickAway();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, onClickAway]);
}