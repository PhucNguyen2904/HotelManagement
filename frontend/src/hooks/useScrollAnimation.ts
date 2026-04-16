'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

interface UseScrollAnimationOptions {
  /** IntersectionObserver threshold (0–1). Default 0.15 */
  threshold?: number;
  /** Root margin string. Default '0px 0px -60px 0px' */
  rootMargin?: string;
  /** Only trigger once. Default true */
  triggerOnce?: boolean;
}

/**
 * Custom hook that returns a ref and an `isVisible` boolean.
 * Attach the ref to any element and it will flip `isVisible` to true
 * the first time it scrolls into view (configurable via options).
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
): [RefObject<T>, boolean] {
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', triggerOnce = true } = options;
  const ref = useRef<T>(null!);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) observer.unobserve(el);
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
}
