import { useState, useEffect, useRef } from 'react';
import type { RefObject } from 'react';

export function useIsClient() {
  return typeof window !== 'undefined';
}