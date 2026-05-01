// Lodging tab

function Lodging() {
  return (
    <div className="page">
      <section className="section" style={{ paddingTop: 120 }}>
        <div className="container">
          <SectionHeader num="III" title="Where we sleep" />
          <div style={{ display: 'grid', gap: 56 }}>
            {window.LODGING.map((l, i) => {
              const statusMeta = l.status === 'decided'
                ? { label: '✓ Booked', cls: '' }
                : l.status === 'alternate'
                ? { label: '◇ Alternate', cls: 'terra' }
                : { label: '○ Deciding', cls: 'terra' };
              return (
                <article key={l.city + l.name} style={{
                  display: 'grid',
                  gridTemplateColumns: i % 2 === 0 ? '1.2fr 1fr' : '1fr 1.2fr',
                  gap: 48,
                  alignItems: 'center',
                  padding: '24px 0',
                  borderTop: '1px solid var(--rule)',
                  paddingTop: 48,
                  opacity: l.status === 'alternate' ? 0.78 : 1,
                }}>
                  <div className="photo" style={{ aspectRatio: '4/3', order: i % 2 === 0 ? 1 : 2 }}>
                    <img src={l.photo} alt={l.city} />
                  </div>
                  <div style={{ order: i % 2 === 0 ? 2 : 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                      <span className="eyebrow">{l.city} · {l.dates} · {l.nights} nights</span>
                      <span className={`tag ${statusMeta.cls}`}>{statusMeta.label}</span>
                    </div>
                    <h3 className="display" style={{ fontSize: 'clamp(34px, 4.4vw, 56px)', lineHeight: 1.05 }}>{l.name}</h3>
                    <div className="rule" style={{ margin: '24px 0' }} />
                    <div style={{ display: 'grid', gap: 16 }}>
                      <Row label="Price" value={l.pricing} />
                      <Row label="Notes" value={l.notes} />
                    </div>
                    <a href={l.link} target="_blank" rel="noreferrer" className="btn" style={{ marginTop: 24, display: 'inline-flex' }}>
                      Open booking ↗
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24, paddingBottom: 16, borderBottom: '1px solid var(--rule-soft)' }}>
      <div className="eyebrow">{label}</div>
      <div style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

window.Lodging = Lodging;
