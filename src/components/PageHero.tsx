import { useHeroScroll } from '../hooks/useScrollVar';
import { cx } from '../lib/util';

interface PageHeroProps {
  kicker: string;
  /** First title line. */
  title: string;
  /** Second title line, in the accent color. */
  accent: string;
  lede: string;
  withTabs?: boolean;
  blueShard?: boolean;
}

export function PageHero({ kicker, title, accent, lede, withTabs, blueShard }: PageHeroProps) {
  const ref = useHeroScroll<HTMLElement>();
  return (
    <section className={cx('page-hero', withTabs && 'page-hero--tabs')} ref={ref}>
      <div className="page-hero__ring"><div className="ring"></div></div>
      <div className={cx('page-hero__shard', blueShard && 'page-hero__shard--blue')}>
        <div className={cx('shard', blueShard && 'shard--b')}></div>
      </div>
      <div className="page-hero__copy">
        <span className="kicker anim-fade" style={{ '--d': '.5s' }}>{kicker}</span>
        <h1 className="display page-hero__title">
          <span className="line"><span style={{ '--d': '.2s' }}>{title}</span></span>
          <span className="line"><span className="accent" style={{ '--d': '.3s' }}>{accent}</span></span>
        </h1>
      </div>
      <p className="lede anim-fade" style={{ '--d': '.6s' }}>{lede}</p>
    </section>
  );
}
