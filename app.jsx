// Main app — nav, routing, cursor, scroll reveal

const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;

const TABS = [
  { id: 'overview',  label: 'Overview' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'lodging',   label: 'Lodging' },
  { id: 'spots',     label: 'Spots' },
  { id: 'expenses',  label: 'Expenses' },
  { id: 'flights',   label: 'Flights' },
  { id: 'packing',   label: 'Packing' },
];

function App() {
  const [tab, setTab] = useStateA('overview');
  const [scrolled, setScrolled] = useStateA(false);
  const [spotFilter, setSpotFilter] = useStateA(null);
  const isOverview = tab === 'overview';

  useEffectA(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffectA(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [tab]);

  useEffectA(() => {
    const onGoto = (e) => {
      setSpotFilter(e.detail || null);
      setTab('spots');
    };
    window.addEventListener('trip:gotoSpots', onGoto);
    return () => window.removeEventListener('trip:gotoSpots', onGoto);
  }, []);

  return (
    <>
      <CustomCursor />
      <div className="gridlines" />
      <Nav
        active={tab}
        onTab={setTab}
        scrolled={scrolled || !isOverview}
        forceLight={isOverview && !scrolled}
      />
      <main>
        {tab === 'overview'  && <><window.Hero /><window.Overview onNav={setTab} /></>}
        {tab === 'itinerary' && <PageWrap><window.Itinerary /></PageWrap>}
        {tab === 'lodging'   && <PageWrap><window.Lodging /></PageWrap>}
        {tab === 'spots'     && <PageWrap><window.Spots initialFilter={spotFilter} /></PageWrap>}
        {tab === 'expenses'  && <PageWrap><window.Expenses /></PageWrap>}
        {tab === 'flights'   && <PageWrap><window.Flights /></PageWrap>}
        {tab === 'packing'   && <PageWrap><window.Packing /></PageWrap>}
      </main>
      <Footer />
      <window.TripTweaks />
    </>
  );
}

function PageWrap({ children }) {
  return <div style={{ paddingTop: 80 }}>{children}</div>;
}

function Nav({ active, onTab, scrolled, forceLight }) {
  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`} style={{
      color: forceLight ? 'var(--cream)' : (scrolled ? 'var(--ink)' : 'var(--cream)'),
    }}>
      <button onClick={() => onTab('overview')} className="nav-mark" data-cursor="hover" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
        <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>Turkey</span>
        <span aria-hidden="true" style={{ width: 1, height: 18, background: 'currentColor', opacity: 0.45 }} />
        <em style={{ fontStyle: 'italic', fontWeight: 400 }}>2026</em>
      </button>
      <div className="nav-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`nav-tab ${active === t.id ? 'active' : ''}`} onClick={() => onTab(t.id)} data-cursor="hover">
            {t.label}
          </button>
        ))}
      </div>
      <div className="nav-meta">Aug 20–29</div>
    </nav>
  );
}

function CustomCursor() {
  const dot = useRefA(null);
  const ring = useRefA(null);

  useEffectA(() => {
    let dx = window.innerWidth / 2, dy = window.innerHeight / 2;
    let rx = dx, ry = dy;
    let raf;

    const onMove = (e) => { dx = e.clientX; dy = e.clientY; };
    const tick = () => {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    const onOver = (e) => {
      const t = e.target;
      const isClickable = t.closest && (t.closest('button, a, [data-cursor="hover"], input, select, textarea, label'));
      if (isClickable) {
        dot.current?.classList.add('hovering');
        ring.current?.classList.add('hovering');
      } else {
        dot.current?.classList.remove('hovering');
        ring.current?.classList.remove('hovering');
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" />
      <div ref={dot} className="cursor-dot" />
    </>
  );
}

function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--rule)',
      padding: '64px 36px 48px',
      background: 'var(--ink)',
      color: 'oklch(85% 0.02 70)',
    }}>
      <div style={{ maxWidth: 1480, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }}>
        <div>
          <div className="display" style={{ fontSize: 48, color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.01em' }}>Turkey</span>
            <span aria-hidden="true" style={{ width: 1, height: 36, background: 'currentColor', opacity: 0.4 }} />
            <em style={{ fontStyle: 'italic', fontWeight: 300 }}>2026</em>
          </div>
          <p style={{ marginTop: 16, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18, opacity: 0.75, maxWidth: '40ch' }}>
            A field guide for six. Bookmark, share, edit. The plan is a living document.
          </p>
        </div>
        <FooterCol title="Cities" items={['Bodrum', 'Istanbul']} />
        <FooterCol title="Crew" items={window.TRIP.crew.map(c => c.name)} />
        <FooterCol title="Status" items={['Volume 01', 'Aug 20 — 29', '6 travelers', '113 days out']} />
      </div>
      <div style={{ maxWidth: 1480, margin: '48px auto 0', paddingTop: 24, borderTop: '1px solid oklch(35% 0.02 60)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.6 }}>
        <span>© TURKEY | 2026 · Issue No. 01</span>
        <span>Made for friends · Aegean → Bosphorus</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <div className="eyebrow" style={{ color: 'oklch(70% 0.04 70)', marginBottom: 16 }}>{title}</div>
      <div style={{ display: 'grid', gap: 8 }}>
        {items.map(i => <div key={i} style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 16, opacity: 0.85 }}>{i}</div>)}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
