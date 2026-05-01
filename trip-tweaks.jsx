// Tweaks panel — font pairings + accent color

const FONT_PAIRINGS = /*EDITMODE-BEGIN*/{
  "pairing": "fraunces",
  "accent": "terra"
}/*EDITMODE-END*/;

// Pairings — each defines the loaded Google fonts + the CSS-var stack
const PAIRINGS = {
  fraunces: {
    label: "Fraunces × Inter Tight",
    sub: "Editorial · the current default",
    googleHref: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=Inter+Tight:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
    serif: '"Fraunces", "Cormorant Garamond", Georgia, serif',
    sans:  '"Inter Tight", "Inter", system-ui, sans-serif',
    mono:  '"JetBrains Mono", ui-monospace, monospace',
    displayPreview: "Aegean",
    bodyPreview: "A field guide for six.",
  },
  playfair: {
    label: "Playfair × Manrope",
    sub: "Glamorous · high-contrast serif",
    googleHref: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
    serif: '"Playfair Display", "Cormorant Garamond", Georgia, serif',
    sans:  '"Manrope", system-ui, sans-serif',
    mono:  '"JetBrains Mono", ui-monospace, monospace',
    displayPreview: "Aegean",
    bodyPreview: "A field guide for six.",
  },
  cormorant: {
    label: "Cormorant × Söhne",
    sub: "Quiet luxury · low-contrast serif",
    googleHref: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
    serif: '"Cormorant Garamond", Georgia, serif',
    sans:  '"Inter", system-ui, sans-serif',
    mono:  '"JetBrains Mono", ui-monospace, monospace',
    displayPreview: "Aegean",
    bodyPreview: "A field guide for six.",
  },
  dmserif: {
    label: "DM Serif × DM Sans",
    sub: "Modern travel-mag energy",
    googleHref: "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
    serif: '"DM Serif Display", Georgia, serif',
    sans:  '"DM Sans", system-ui, sans-serif',
    mono:  '"JetBrains Mono", ui-monospace, monospace',
    displayPreview: "Aegean",
    bodyPreview: "A field guide for six.",
  },
  ibmplex: {
    label: "IBM Plex Serif × IBM Plex Sans",
    sub: "Reportage · Monocle / NYT-ish",
    googleHref: "https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,300;0,400;0,500;0,600;1,400&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap",
    serif: '"IBM Plex Serif", Georgia, serif',
    sans:  '"IBM Plex Sans", system-ui, sans-serif',
    mono:  '"IBM Plex Mono", ui-monospace, monospace',
    displayPreview: "Aegean",
    bodyPreview: "A field guide for six.",
  },
};

const ACCENTS = {
  terra:    { label: "Terracotta", color: "oklch(58% 0.14 38)",  deep: "oklch(46% 0.13 35)",  soft: "oklch(78% 0.08 40)" },
  ochre:    { label: "Ochre",      color: "oklch(64% 0.13 70)",  deep: "oklch(52% 0.12 65)",  soft: "oklch(82% 0.09 75)" },
  sea:      { label: "Aegean",     color: "oklch(48% 0.10 220)", deep: "oklch(36% 0.08 225)", soft: "oklch(82% 0.05 220)" },
  olive:    { label: "Olive",      color: "oklch(52% 0.07 110)", deep: "oklch(40% 0.06 110)", soft: "oklch(82% 0.05 110)" },
  plum:     { label: "Plum",       color: "oklch(42% 0.10 20)",  deep: "oklch(32% 0.09 20)",  soft: "oklch(78% 0.06 20)" },
};

// Apply pairing — inject Google font link + override CSS vars
function applyPairing(key) {
  const p = PAIRINGS[key];
  if (!p) return;
  let link = document.getElementById('__pairing-fonts');
  if (!link) {
    link = document.createElement('link');
    link.id = '__pairing-fonts';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== p.googleHref) link.href = p.googleHref;

  const root = document.documentElement;
  root.style.setProperty('--serif', p.serif);
  root.style.setProperty('--sans', p.sans);
  root.style.setProperty('--mono', p.mono);
}

function applyAccent(key) {
  const a = ACCENTS[key];
  if (!a) return;
  const root = document.documentElement;
  root.style.setProperty('--terra', a.color);
  root.style.setProperty('--terra-deep', a.deep);
  root.style.setProperty('--terra-soft', a.soft);
}

function TripTweaks() {
  const [tweaks, setTweak] = useTweaks(FONT_PAIRINGS);

  React.useEffect(() => { applyPairing(tweaks.pairing); }, [tweaks.pairing]);
  React.useEffect(() => { applyAccent(tweaks.accent); }, [tweaks.accent]);

  const current = PAIRINGS[tweaks.pairing] || PAIRINGS.fraunces;

  return (
    <TweaksPanel title="Type & color">
      <TweakSection title="Type pairing" subtitle="Pick a system. Applies live.">
        <div style={{ display: 'grid', gap: 8 }}>
          {Object.entries(PAIRINGS).map(([key, p]) => {
            const active = tweaks.pairing === key;
            return (
              <button
                key={key}
                onClick={() => setTweak('pairing', key)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '14px 16px',
                  border: active ? '1.5px solid var(--terra, oklch(58% 0.14 38))' : '1px solid oklch(85% 0.02 70)',
                  background: active ? 'oklch(96% 0.025 70)' : 'oklch(99% 0.008 75)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 180ms',
                }}
              >
                <div style={{
                  fontFamily: p.serif,
                  fontWeight: 300,
                  fontStyle: 'italic',
                  fontSize: 28,
                  lineHeight: 1,
                  color: 'oklch(18% 0.015 60)',
                  letterSpacing: '-0.02em',
                }}>{p.displayPreview}</div>
                <div style={{
                  fontFamily: p.sans,
                  fontSize: 13,
                  color: 'oklch(32% 0.02 60)',
                  marginTop: 6,
                }}>{p.bodyPreview}</div>
                <div style={{
                  fontFamily: p.mono,
                  fontSize: 9,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  marginTop: 10,
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'oklch(48% 0.025 60)',
                }}>
                  <span>{p.label}</span>
                  <span style={{ color: active ? 'var(--terra, oklch(58% 0.14 38))' : 'transparent' }}>● selected</span>
                </div>
              </button>
            );
          })}
        </div>
      </TweakSection>

      <TweakSection title="Accent color">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {Object.entries(ACCENTS).map(([key, a]) => {
            const active = tweaks.accent === key;
            return (
              <button
                key={key}
                onClick={() => setTweak('accent', key)}
                title={a.label}
                style={{
                  aspectRatio: '1',
                  background: a.color,
                  border: active ? '2px solid oklch(18% 0.015 60)' : '1px solid oklch(85% 0.02 70)',
                  outline: active ? '2px solid oklch(99% 0.008 75)' : 'none',
                  outlineOffset: -4,
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {active && <span style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'oklch(99% 0.008 75)', fontSize: 14,
                }}>✓</span>}
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 8, fontFamily: current.mono, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'oklch(48% 0.025 60)' }}>
          {ACCENTS[tweaks.accent]?.label || 'Terracotta'}
        </div>
      </TweakSection>
    </TweaksPanel>
  );
}

window.TripTweaks = TripTweaks;
