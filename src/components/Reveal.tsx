import { useRef, type ComponentPropsWithoutRef, type CSSProperties, type ElementType } from 'react';
import { useInView } from '../hooks/useInView';
import { cx } from '../lib/util';

type RevealProps<T extends ElementType> = {
  as?: T;
  /** Transition delay in ms once the element scrolls into view. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'style'>;

/** Fades/slides its content up the first time it scrolls into view (styles: [data-reveal] in styles.css). */
export function Reveal<T extends ElementType = 'div'>({ as, delay = 0, className, style, ...rest }: RevealProps<T>) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const Tag: ElementType = as ?? 'div';
  return (
    <Tag
      {...rest}
      ref={ref}
      data-reveal={delay}
      className={cx(className, inView && 'is-in') || undefined}
      style={{ ...style, '--rd': `${delay}ms` }}
    />
  );
}
