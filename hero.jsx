// Hero — animated, parallax, countdown

const { useState, useEffect, useRef } = React;

function useCountdown(target) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s };
}

function Hero({ onTabChange }) {
  const { d, h, m, s } = useCountdown(window.TRIP.startDate);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const parallax = Math.min(scrollY, 800);

  return (
    <section ref={heroRef} className="hero" style={{
      position: 'relative',
      height: '100vh',
      minHeight: 720,
      overflow: 'hidden',
      background: 'var(--ink)',
    }}>
      {/* Photo layer with parallax */}
      <div style={{
        position: 'absolute',
        inset: '-10% 0 0 0',
        transform: `translate3d(0, ${parallax * 0.4}px, 0) scale(${1 + parallax * 0.0004})`,
        willChange: 'transform',
      }}>
        <div className="photo" style={{ width: '100%', height: '110%' }}>
          <img src={window.PHOTOS.hero} alt="Bodrum coast" />
        </div>
      </div>

      {/* Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, oklch(20% 0.04 40 / 0.45) 0%, oklch(20% 0.04 40 / 0.05) 30%, oklch(20% 0.04 40 / 0.10) 60%, oklch(15% 0.04 30 / 0.65) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Title block */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 36px 56px 36px',
        color: 'var(--cream)',
        zIndex: 2,
        transform: `translateY(${-parallax * 0.15}px)`,
        opacity: Math.max(0, 1 - parallax / 600),
      }}>
        <div style={{ maxWidth: 1480, margin: '0 auto', width: '100%' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            marginBottom: 28,
            fontFamily: 'var(--mono)',
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            opacity: 0.85,
          }}>
            <span>Volume 01</span>
            <span style={{ width: 32, height: 1, background: 'currentColor', opacity: .5 }} />
            <span>Aug 20 — 29, 2026</span>
          </div>

          <h1 className="display" style={{
            fontSize: 'clamp(72px, 14vw, 220px)',
            lineHeight: 0.88,
            letterSpacing: '-0.02em',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.18em',
            flexWrap: 'wrap',
          }}>
            <span style={{ textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Turkey</span>
            <span aria-hidden="true" style={{
              display: 'inline-block',
              width: '0.04em',
              height: '0.78em',
              background: 'currentColor',
              opacity: 0.55,
              transform: 'translateY(0.04em)',
            }} />
            <span style={{ fontStyle: 'italic', fontWeight: 300 }}>2026</span>
          </h1>

          <div style={{
            marginTop: 32,
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 36,
            alignItems: 'end',
          }}>
            <p style={{
              fontFamily: 'var(--serif)',
              fontWeight: 300,
              fontSize: 'clamp(18px, 1.6vw, 24px)',
              lineHeight: 1.4,
              maxWidth: '52ch',
              fontVariationSettings: '"opsz" 80',
              opacity: 0.95,
            }}>
              {window.TRIP.subtitle}. Six friends, two cities, <em>endless memories</em>.
            </p>
            <Countdown d={d} h={h} m={m} s={s} />
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: 'absolute',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'var(--cream)',
        fontFamily: 'var(--mono)',
        fontSize: 10,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        opacity: 0.7,
        zIndex: 3,
        animation: 'bob 2.4s ease-in-out infinite',
      }}>
        ↓ Scroll · The Issue
      </div>

      <style>{`
        @keyframes bob {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
      `}</style>
    </section>
  );
}

function Countdown({ d, h, m, s }) {
  const cell = (val, label) => (
    <div style={{ textAlign: 'left' }}>
      <div className="display" style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1, fontStyle: 'italic', fontWeight: 300 }}>
        {String(val).padStart(2, '0')}
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.7, marginTop: 6 }}>
        {label}
      </div>
    </div>
  );
  return (
    <div style={{
      display: 'flex',
      gap: 28,
      padding: '20px 28px',
      border: '1px solid currentColor',
      borderColor: 'oklch(98% 0.01 75 / 0.4)',
      background: 'oklch(20% 0.04 40 / 0.18)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
    }}>
      {cell(d, 'Days')}
      {cell(h, 'Hrs')}
      {cell(m, 'Min')}
      {cell(s, 'Sec')}
    </div>
  );
}

window.Hero = Hero;
