import { useRef, useState, type MouseEvent, type PointerEvent } from 'react';
import { Layout } from '../components/Layout';
import { Logo3D } from '../components/Logo3D';
import { Reveal } from '../components/Reveal';
import { DISCORD_URL, FORMATS, FORMAT_SUMMARY, leagueSlug } from '../data';
import { useDriftScroll, useHeroScroll } from '../hooks/useScrollVar';
import { cx, pad } from '../lib/util';
import logoUrl from '../assets/risen-logo.png';

const STEPS = [
  { title: 'Join the Discord', text: 'Registration, announcements and support all run through the Risen Discord.' },
  { title: 'Pick a league', text: 'Register a full roster in a league that fits your rank, or enter the Draft League on your own.' },
  { title: 'Play weekly', text: 'Matches run on a set night each week. Results and standings post to Risen Stats.' },
];

function FormatList() {
  // Hover-fill list: with a mouse, hovering a row opens it and clicking goes to the league.
  // On touch, the first tap opens a row; tapping it again (or its Learn more button) goes through.
  const [open, setOpen] = useState(0);
  const pointer = useRef('');

  const onClick = (e: MouseEvent, i: number) => {
    const touch = pointer.current !== '' && pointer.current !== 'mouse';
    pointer.current = '';
    if (touch && i !== open) {
      e.preventDefault();
      setOpen(i);
    }
  };

  return (
    <div className="fill-list">
      {FORMAT_SUMMARY.map((f, i) => (
        <Reveal
          as="a"
          key={f.name}
          className={cx('fill-row', i === open && 'is-open')}
          href={`./leagues?league=${leagueSlug(FORMATS[i])}`}
          onPointerDown={(e: PointerEvent) => { pointer.current = e.pointerType; }}
          onPointerEnter={(e: PointerEvent) => { if (e.pointerType === 'mouse') setOpen(i); }}
          onClick={(e: MouseEvent) => onClick(e, i)}
        >
          <div className="format-row__head">
            <span className="format-row__idx">{pad(i + 1)}</span>
            <span className="format-row__name">{f.name}</span>
            <span className="format-row__ranks">{f.ranks}</span>
            <span className="format-row__arrow">→</span>
          </div>
          <div className="format-row__body"><div>
            <div className="format-row__facts">
              <div className="fact-sm"><span className="fact-sm__label">Format</span><span className="fact-sm__value">{f.format}</span></div>
              <div className="fact-sm"><span className="fact-sm__label">Match nights</span><span className="fact-sm__value">{f.nights}</span></div>
              <div className="fact-sm"><span className="fact-sm__label">Entry</span><span className="fact-sm__value">{f.fee}</span></div>
              <div className="fact-sm"><span className="fact-sm__label">Prize pool</span><span className="fact-sm__value fact-sm__value--accent">{f.pool}</span></div>
              <div className="fact-sm"><span className="fact-sm__label">Season</span><span className="fact-sm__value">{f.season}</span></div>
              <div className="fact-sm fact-sm--cta"><span className="btn btn--primary">Learn more →</span></div>
            </div>
          </div></div>
        </Reveal>
      ))}
    </div>
  );
}

export function HomePage() {
  const heroRef = useHeroScroll<HTMLElement>();
  const ctaRef = useDriftScroll<HTMLElement>();

  return (
    <Layout page="home">
      <main>
        <section className="hero" ref={heroRef}>
          <div className="hero__copy">
            <span className="kicker anim-fade" style={{ '--d': '.9s' }}>Amateur League of Legends</span>
            <h1 className="display hero__title">
              <span className="line"><span style={{ '--d': '.7s' }}>Compete</span></span>
              <span className="line"><span style={{ '--d': '.8s' }}>at every</span></span>
              <span className="line"><span className="accent" style={{ '--d': '.9s' }}>rank.</span></span>
            </h1>
            <p className="lede anim-fade" style={{ '--d': '1.1s' }}>Four league formats, weekly matches and a community that plays together. Compete solo or with a full team.</p>
            <div className="btn-row anim-fade" style={{ '--d': '1.2s' }}>
              <a className="btn btn--primary" href="./leagues">See the leagues</a>
              <a className="btn btn--ghost" href={DISCORD_URL}>Join Discord</a>
            </div>
          </div>
          <div className="hero__art">
            <div className="tilt">
              <div className="hero__ring"><div className="ring"></div></div>
              <div className="hero__diamond"><div></div></div>
              <div className="hero__pip"><div></div></div>
            </div>
            <Logo3D src={logoUrl} />
            <div className="tilt tilt--front">
              <div className="hero__shard1"><div className="shard"></div></div>
              <div className="hero__shard2"><div className="shard shard--b"></div></div>
            </div>
          </div>
        </section>

        <section className="section light" style={{ paddingTop: '16vh', paddingBottom: '16vh' }}>
          <Reveal className="section__head">
            <div className="section__title">
              <span className="kicker">01 — The leagues</span>
              <h2 className="h2">Four formats.<br />Every rank.</h2>
            </div>
            <p className="lede">Hover or tap a format for its ranks, match nights and entry. Full details are on the Leagues page.</p>
          </Reveal>
          <FormatList />
        </section>

        <section className="section light" style={{ borderTop: '1px solid rgba(10,20,40,0.1)', gap: 64, paddingBottom: '18vh' }}>
          <Reveal className="section__title">
            <span className="kicker">02 — How to join</span>
            <h2 className="h2" style={{ maxWidth: 1100 }}>Three steps to your first match.</h2>
          </Reveal>
          <div className="steps">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} className="step" delay={i * 120}>
                <span className="step__n">{pad(i + 1)}</span>
                <span className="step__title">{s.title}</span>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="cta" ref={ctaRef}>
          <div className="cta__mark"><img src={logoUrl} alt="" /></div>
          <Reveal as="span" className="kicker">03 — Community</Reveal>
          <Reveal as="h2" className="display cta__title">Rise with<br /><span className="accent">us.</span></Reveal>
          <Reveal as="p" className="lede" delay={100}>Find a team, meet the staff and get every announcement first in the Risen Discord.</Reveal>
          <Reveal className="btn-row" delay={160}>
            <a className="btn btn--primary btn--lg" href={DISCORD_URL}>Join the Risen Discord</a>
            <a className="btn btn--ghost btn--lg" href="./contact">Who to contact</a>
          </Reveal>
        </section>
      </main>
    </Layout>
  );
}
