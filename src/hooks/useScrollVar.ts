import { useEffect, useRef } from 'react';
import { clamp01 } from '../lib/util';

// Writes a scroll-derived CSS variable onto the element on every animation frame that scrolls/resizes.
// Set directly on the style rather than through React state so scrolling never re-renders.
function useScrollVar<T extends HTMLElement>(name: string, compute: (rect: DOMRect, vh: number) => number) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        el.style.setProperty(name, String(compute(el.getBoundingClientRect(), innerHeight)));
      });
    };
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
    return () => {
      removeEventListener('scroll', update);
      removeEventListener('resize', update);
      cancelAnimationFrame(frame);
    };
    // compute is a fixed function per wrapper below, so name is the only real dependency.
  }, [name]);
  return ref;
}

/** --p: 0 at the top of the page, 1 after scrolling one viewport past the element's top. */
export const useHeroScroll = <T extends HTMLElement>() => useScrollVar<T>('--p', (r, vh) => clamp01(-r.top / vh));

/** --c: 0 → 1 while the element crosses the viewport. */
export const useDriftScroll = <T extends HTMLElement>() => useScrollVar<T>('--c', (r, vh) => clamp01((vh - r.top) / (vh + r.height)));
