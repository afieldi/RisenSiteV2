import { useEffect, useState, type RefObject } from 'react';

/** Becomes true the first time the element is ≥10% visible, then stops observing. */
export function useInView(ref: RefObject<Element | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, inView]);
  return inView;
}
