import type { ReactNode } from 'react';
import { useCursorParallax } from '../hooks/useCursorParallax';
import { Footer } from './Footer';
import { Nav, type Page } from './Nav';

export function Layout({ page, children }: { page: Page; children: ReactNode }) {
  useCursorParallax();
  return (
    <>
      <Nav active={page} />
      {children}
      <Footer active={page} />
    </>
  );
}
