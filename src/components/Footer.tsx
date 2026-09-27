import { DISCORD_URL, STATS_URL } from '../data';
import { PAGES, type Page } from './Nav';
import logoUrl from '../assets/risen-logo.png';

export function Footer({ active }: { active: Page }) {
  return (
    <footer className="footer">
      <div className="footer__brand"><img src={logoUrl} alt="Risen eSports" /><span>© 2026 Risen eSports · Not affiliated with Riot Games</span></div>
      <div className="footer__links">
        {PAGES.filter(p => p.page !== active).map(p => <a key={p.page} href={p.href}>{p.label}</a>)}
        <a href={STATS_URL} target="_blank" rel="noopener">Risen Stats ↗</a>
        <a href={DISCORD_URL}>Discord ↗</a>
      </div>
    </footer>
  );
}
