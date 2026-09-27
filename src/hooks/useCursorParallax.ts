import { useEffect } from 'react';

// Cursor position -> --mx / --my (-1..1) on <html>, used by parallax shapes in CSS.
export function useCursorParallax() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const r = document.documentElement.style;
      r.setProperty('--mx', String((e.clientX / innerWidth - 0.5) * 2));
      r.setProperty('--my', String((e.clientY / innerHeight - 0.5) * 2));
    };
    addEventListener('mousemove', onMove, { passive: true });
    return () => removeEventListener('mousemove', onMove);
  }, []);
}
