import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { DISCORD_URL, STATS_URL } from '../data';
import { cx } from '../lib/util';
import logoUrl from '../assets/risen-logo.png';

export type Page = 'home' | 'leagues' | 'contact';

export const PAGES: { page: Page; label: string; href: string }[] = [
  { page: 'home', label: 'Home', href: './' },
  { page: 'leagues', label: 'Leagues', href: './leagues' },
  { page: 'contact', label: 'Contact', href: './contact' },
];

// Mobile nav sheet: hamburger toggles .is-open; scrim, links, Escape and widening past the breakpoint close it.
export function Nav({ active }: { active: Page }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); }
    };
    const mq = matchMedia('(max-width: 760px)');
    const onMq = (e: MediaQueryListEvent) => { if (!e.matches) setOpen(false); };
    addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [open]);

  const closeOnLink = (e: MouseEvent) => {
    if ((e.target as Element).closest('a')) setOpen(false);
  };

  return (
    <nav className={cx('nav', open && 'is-open')}>
      <a className="nav__logo" href="./"><img src={logoUrl} alt="Risen eSports" /></a>
      <button
        ref={toggleRef}
        className="nav__toggle"
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="nav-links"
        onClick={() => setOpen(o => !o)}
      >
        <span></span><span></span><span></span>
      </button>
      <div className="nav__scrim" onClick={() => setOpen(false)}></div>
      <div className="nav__links" id="nav-links" onClick={closeOnLink}>
        {PAGES.map(p => (
          <a key={p.page} className={cx('nav__link', p.page === active && 'is-active')} href={p.href}>{p.label}</a>
        ))}
        <a className="nav__link" href={STATS_URL} target="_blank" rel="noopener">Stats ↗</a>
        <a className="nav__cta" href={DISCORD_URL}>Join Discord</a>
      </div>
    </nav>
  );
}
