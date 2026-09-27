import { useRef, useState, type CSSProperties } from 'react';
import { Layout } from '../components/Layout';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { DISCORD_URL, FORMATS, STATS_URL, TIERS, type CompareRow, type Format } from '../data';
import { cx, pad } from '../lib/util';

function initialSelection() {
  const q = Number(new URLSearchParams(location.search).get('league'));
  return q > 0 && q < FORMATS.length ? q : 0;
}

function compareRows(f: Format): CompareRow[] {
  if (!f.divs.length) return f.compare ?? [];
  return f.divs.map(d => [d.name, d.capType === 'Points cap' ? `${d.cap} cap` : `${d.cap} ${d.capType.toLowerCase()}`, d.when, d.fee]);
}

function Detail({ index }: { index: number }) {
  const f = FORMATS[index];
  const [lo, hi] = f.range;
  // "Gold – Master 250 LP" / "Up to Master 500 LP" -> "Master 250 LP" / "Master 500 LP"
  const capLabel = f.ranks.split(' – ').pop()!.replace(/^Up to /, '');
  const [divSel, setDivSel] = useState(0);
  const div = f.divs[divSel];
  const schedule = div ? div.schedule : f.schedule!;
  // Staggered entry animation: each [data-anim] element gets the next delay, capped after 8.
  let a = 0;
  const anim = () => ({ 'data-anim': true, style: { '--ad': `${Math.min(a++, 8) * 45}ms` } as CSSProperties });

  return (
    <>
      <section className="detail__intro">
        <div className="detail__copy">
          <span className="kicker" {...anim()}>Format {pad(index + 1)} of {pad(FORMATS.length)} · {f.kicker}</span>
          <h2 className="display detail__title" {...anim()}>{f.title}</h2>
          <p className="detail__desc" {...anim()}>{f.desc}</p>
          <div className="btn-row" {...anim()}>
            <a className="btn btn--primary" href={DISCORD_URL}>Register on Discord</a>
            <a className="btn btn--ghost" href={STATS_URL} target="_blank" rel="noopener">Standings ↗</a>
          </div>
        </div>
        <div className="facts" {...anim()}>
          {f.facts.map(([label, value]) => (
            <div className="fact" key={label}>
              <span className="fact__label">{label}</span>
              <span className={cx('fact__value', label === 'Prize pool' && 'fact__value--accent')}>{value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="ranks" {...anim()}>
        <div className="ranks__head"><span>Eligible ranks</span><strong>{f.ranks}</strong></div>
        <div className="range" style={{ '--lo': lo, '--hi': hi + 1 } as CSSProperties}>
          <div className="range__labels">
            <span className="range__from">{TIERS[lo]}</span>
            <span className="range__to">{capLabel}</span>
          </div>
          <div className="range__track"><div className="range__fill"></div><div className="range__cap"></div></div>
          <div className="range__tiers">
            {TIERS.map((t, i) => (
              <span key={t} className={cx('range__tier', i >= lo && i <= hi && 'is-in')}>{t}</span>
            ))}
          </div>
        </div>
        <span className="ranks__note">{f.rankNote}</span>
      </section>

      {f.divs.length > 0 && (
        <section className="divs">
          <div className="divs__head" {...anim()}>
            <h3 className="divs__title">{f.divTitle}</h3>
            <span className="divs__note">{f.divNote}</span>
          </div>
          <div className="divs__grid">
            {f.divs.map((d, i) => (
              <div className="div-card" key={d.name} {...anim()}>
                <div className="div-card__top"><span className="div-card__idx">{pad(i + 1)}</span><span className="pill">{d.when}</span></div>
                <div className="div-card__mid">
                  <span className="div-card__name">{d.name}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span className="div-card__captype">{d.capType}</span>
                    <span className="div-card__cap">{d.cap}</span>
                  </div>
                  <span className="div-card__note">{d.note}</span>
                </div>
                <div className="div-card__foot">
                  <div className="fact-sm"><span className="fact-sm__label">Entry</span><span className="fact-sm__value">{d.fee}</span></div>
                  <div className="fact-sm"><span className="fact-sm__label">Prize pool</span><span className="fact-sm__value fact-sm__value--accent">{d.pool}</span></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="panels">
        <div className="panel" {...anim()}>
          <span className="panel__label">How it works</span>
          <div>
            {f.steps.map((s, i) => (
              <div className="how" key={s}><span className="how__n">{pad(i + 1)}</span><span className="how__t">{s}</span></div>
            ))}
          </div>
        </div>
        <div className="panel panel--dark" {...anim()}>
          <span className="panel__label">Fall 2026 split · {div ? div.name : f.title}</span>
          {f.divs.length > 0 && (
            <div className="sched-picks">
              {f.divs.map((d, i) => (
                <button key={d.name} className={cx('sched-pick', i === divSel && 'is-active')} onClick={() => setDivSel(i)}>{d.name}</button>
              ))}
            </div>
          )}
          <div>
            {schedule.map(([label, date]) => (
              <div className="sched" key={label}><span className="sched__dot"></span><span className="sched__label">{label}</span><span className="sched__date">{date}</span></div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function LeaguesPage() {
  const [sel, setSel] = useState(initialSelection);
  const detailRef = useRef<HTMLElement>(null);

  const select = (i: number, forceScroll: boolean) => {
    setSel(i);
    // The detail's top doesn't move when its content changes, so it can be measured before re-render.
    const y = detailRef.current!.getBoundingClientRect().top + scrollY - 90;
    if (forceScroll || scrollY > y) scrollTo({ top: y, behavior: 'smooth' });
    history.replaceState(null, '', `?league=${i}`);
  };

  return (
    <Layout page="leagues">
      <PageHero
        withTabs
        kicker="Four formats · Ten leagues"
        title="The"
        accent="Leagues"
        lede="From casual solo drafts to rank-capped premade play. Pick a format to see its leagues, eligibility and match nights."
      />

      <div className="tabs">
        <div className="tabs__row">
          {FORMATS.map((f, i) => (
            <button key={f.name} className={cx('tab', i === sel && 'is-active')} onClick={() => select(i, false)}>
              <span className="tab__meta">{pad(i + 1)} · {f.nights}</span>
              <span className="tab__name">{f.name}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="detail light" ref={detailRef}>
        {/* Keyed so the entry animations replay when switching formats. */}
        <Detail key={sel} index={sel} />
      </main>

      <section className="compare light">
        <Reveal as="h2" className="h2" style={{ fontSize: 'clamp(44px,5.4vw,90px)' }}>Every league</Reveal>
        <Reveal className="compare__scroll" delay={80}>
          <div className="compare__table">
            <div className="compare__row compare__row--head"><span>League</span><span>Format</span><span>Cap / ranks</span><span>Match night</span><span>Entry</span></div>
            {FORMATS.flatMap((f, fi) => compareRows(f).map(r => (
              <button key={r[0]} className={cx('compare__row', fi === sel && 'is-active')} onClick={() => select(fi, true)}>
                <span className="compare__name">{r[0]}</span><span className="compare__type">{f.name}</span><span>{r[1]}</span><span>{r[2]}</span><span>{r[3]}</span>
              </button>
            )))}
          </div>
        </Reveal>
      </section>

      <section className="cta" style={{ padding: '18vh 4vw', gap: 36 }}>
        <Reveal as="h2" className="display" style={{ fontSize: 'clamp(64px,10vw,190px)', lineHeight: 0.82, fontStretch: '72%' }}>
          Ready to<br /><span className="accent">compete?</span>
        </Reveal>
        <Reveal as="p" className="lede" delay={80}>Registration for every league runs through the Risen Discord.</Reveal>
        <Reveal className="btn-row" delay={140}>
          <a className="btn btn--primary btn--lg" href={DISCORD_URL}>Join the Risen Discord</a>
          <a className="btn btn--ghost btn--lg" href="./contact.html">Who to contact</a>
        </Reveal>
      </section>
    </Layout>
  );
}
