import { useState } from 'react';
import { Layout } from '../components/Layout';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { DISCORD_URL } from '../data';
import { cx } from '../lib/util';

const TOPICS = [
  { name: 'Quick questions', desc: 'Simple, non-sensitive questions. The community answers fastest.', handle: '#help', role: 'Risen Discord' },
  { name: 'Private matters', desc: 'Anything sensitive or needing a back-and-forth with staff.', handle: '#open-a-ticket', role: 'Server admins' },
  { name: 'Draft & Teambuilder', desc: 'Schedules, rules and rosters for community leagues.', handle: '@Draconic · @Wantmarriage', role: 'Community Operations' },
  { name: 'Premade leagues', desc: 'Rosters, registration and operations for premade leagues.', handle: '@Dobby | Premade', role: 'Premade Operations' },
  { name: 'Mythical', desc: 'Anything specific to the Mythical league.', handle: '@Chappy - Mythical', role: 'Mythical Operations' },
  { name: 'Casting & production', desc: 'Joining the broadcast team as a caster or producer.', handle: '@Mayo - Stream Badmin', role: 'Stream Management' },
  { name: 'Moderation & community', desc: 'Reports, conduct and community issues.', handle: '@The Slaw', role: 'Head of Moderation' },
  { name: 'Website & stats', desc: 'Risen Stats, the website and the API.', handle: '@Earleking', role: 'Website & API Wizard' },
  { name: 'Partnerships & the org', desc: 'Sponsorships, partnerships and anything about Risen itself.', handle: '@The Balgrog of Pouria', role: 'Co-Owner & Founder' },
];

const STAFF = [
  {
    group: 'Leadership',
    people: [
      { name: '@The Balgrog of Pouria', role: 'Co-Owner, Founder, and Super President' },
      { name: '@The Slaw', role: 'Co-Owner, Head of Moderation & Community Management' },
    ],
  },
  {
    group: 'Premade Admin',
    people: [
      { name: '@Dobby | Premade', role: 'Premade Operations' },
      { name: '@Chappy - Mythical', role: 'Mythical Operations' },
    ],
  },
  {
    group: 'Community Admin',
    people: [
      { name: '@Draconic', role: 'Community Operations' },
      { name: '@Wantmarriage', role: 'Community Operations' },
    ],
  },
  {
    group: 'Technical Admin',
    people: [
      { name: '@Earleking', role: 'Website & API Wizard' },
      { name: '@Ubys', role: 'Sheets Mastermind' },
    ],
  },
  {
    group: 'Stream Admin',
    people: [
      { name: '@Matt | Stream', role: 'Production Director' },
      { name: '@Kaddie | Stream', role: 'Stream Management' },
      { name: '@FridayAgain', role: 'Stream Management' },
      { name: '@Mayo - Stream Badmin', role: 'Stream Management' },
    ],
  },
];

function TopicList() {
  // Hover-fill list: hovering a row opens it and closes the others.
  const [open, setOpen] = useState(0);
  return (
    <div className="fill-list">
      {TOPICS.map((t, i) => (
        <Reveal key={t.name} className={cx('fill-row', i === open && 'is-open')} onMouseEnter={() => setOpen(i)}>
          <div className="topic__row">
            <span className="topic__name">{t.name}</span>
            <span className="topic__desc">{t.desc}</span>
            <div className="topic__who"><span className="topic__handle">{t.handle}</span><span className="topic__role">{t.role}</span></div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function ContactPage() {
  return (
    <Layout page="contact">
      <PageHero
        blueShard
        kicker="Contact"
        title="Who to"
        accent="ask."
        lede="Everything runs through the Risen Discord. Find your topic below and message the right person there."
      />

      <main>
        <section className="section light">
          <Reveal className="section__title">
            <span className="kicker">01 — By question</span>
            <h2 className="h2">What do you need?</h2>
          </Reveal>
          <TopicList />
        </section>

        <section className="section light" style={{ paddingTop: 0, paddingBottom: '16vh' }}>
          <Reveal className="section__title">
            <span className="kicker">02 — The team</span>
            <h2 className="h2">Risen staff</h2>
          </Reveal>
          {STAFF.map(g => (
            <div className="staff-group" key={g.group}>
              <Reveal as="span" className="staff-group__title">{g.group}</Reveal>
              {g.people.map(p => (
                <Reveal className="staff" delay={80} key={p.name}>
                  <div className="staff__pfp"></div>
                  <div><div className="staff__name">{p.name}</div><div className="staff__role">{p.role}</div></div>
                </Reveal>
              ))}
            </div>
          ))}
        </section>

        <section className="discord-band">
          <div className="discord-band__main">
            <Reveal as="h2" className="display">More info on the Discord.</Reveal>
            <Reveal delay={100}><a className="btn btn--dark btn--lg" href={DISCORD_URL}>Join the Risen Discord →</a></Reveal>
          </div>
          <div className="discord-band__aside">
            <span className="mono" style={{ fontSize: 11, color: 'var(--dim)' }}>Before you message staff</span>
            <p>Check #risen-info and #announcements first. Most schedule, format and eligibility questions are answered there.</p>
            <p>Ask simple questions in #help. Only open a ticket for sensitive matters or anything that needs a private conversation with staff.</p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
