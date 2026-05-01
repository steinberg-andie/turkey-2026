// Interactive Leaflet map of all spots — embedded at the bottom of the Spots tab.

const { useState: useStateSM, useEffect: useEffectSM, useRef: useRefSM, useMemo: useMemoSM } = React;

function SpotsMap({ spots, activeName, onActivate }) {
  const elRef = useRefSM(null);
  const mapRef = useRefSM(null);
  const layerRef = useRefSM(null);
  const markersRef = useRefSM({});
  const [view, setView] = useStateSM('all'); // 'all' | 'bodrum' | 'istanbul'

  const VIEWS = {
    all:      { center: [39.0, 32.0], zoom: 5 },
    bodrum:   { center: [37.05, 27.32], zoom: 11 },
    istanbul: { center: [41.025, 28.99], zoom: 12 },
  };

  // Init map once
  useEffectSM(() => {
    if (!elRef.current || mapRef.current) return;
    const L = window.L;
    const map = L.map(elRef.current, {
      center: VIEWS.all.center,
      zoom: VIEWS.all.zoom,
      scrollWheelZoom: true,
      zoomControl: true,
      attributionControl: true,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);
    mapRef.current = map;

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Build markers when spots change
  useEffectSM(() => {
    const L = window.L;
    const map = mapRef.current;
    if (!map) return;
    if (layerRef.current) {
      layerRef.current.clearLayers();
    } else {
      layerRef.current = L.layerGroup().addTo(map);
    }
    markersRef.current = {};

    spots.forEach(s => {
      const co = window.SPOT_COORDS[s.name];
      if (!co) return;
      const color = categoryHex(s.category);
      const isPriority = s.priority === 'must';
      const icon = L.divIcon({
        className: 'spot-pin',
        html: `<span class="spot-pin-dot" style="background:${color}; ${isPriority ? 'box-shadow: 0 0 0 4px ' + color + '33;' : ''}"></span>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      const m = L.marker(co, { icon, title: s.name });
      m.bindTooltip(`<b>${s.name}</b><br><span style="opacity:.7">${s.city} · ${s.category}</span>`, {
        direction: 'top',
        offset: [0, -8],
        className: 'spot-tooltip',
      });
      m.on('click', () => {
        onActivate && onActivate(s.name);
        map.flyTo(co, Math.max(map.getZoom(), 14), { duration: 0.7 });
      });
      m.addTo(layerRef.current);
      markersRef.current[s.name] = { marker: m, coords: co };
    });
  }, [spots]);

  // React to active spot — fly + open tooltip
  useEffectSM(() => {
    const map = mapRef.current;
    if (!map || !activeName) return;
    const entry = markersRef.current[activeName];
    if (!entry) return;
    map.flyTo(entry.coords, Math.max(map.getZoom(), 14), { duration: 0.7 });
    entry.marker.openTooltip();
  }, [activeName]);

  // View buttons
  const goView = (v) => {
    setView(v);
    const map = mapRef.current;
    if (!map) return;
    map.flyTo(VIEWS[v].center, VIEWS[v].zoom, { duration: 0.8 });
  };

  return (
    <div style={{ marginTop: 56 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Fig. B · The Atlas</div>
          <div className="display" style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}>
            <em>Every spot,</em> plotted.
          </div>
          <div style={{ fontSize: 14, color: 'var(--ink-mute)', marginTop: 8, maxWidth: '52ch' }}>
            Scroll to zoom, drag to pan, click a pin or a card to fly to it. Filters above shape the map.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[['all','All'],['bodrum','Bodrum'],['istanbul','Istanbul']].map(([k, label]) => (
            <button key={k} onClick={() => goView(k)} style={{
              padding: '8px 14px',
              fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
              background: view === k ? 'var(--ink)' : 'transparent',
              color: view === k ? 'var(--cream)' : 'var(--ink-soft)',
              border: '1px solid ' + (view === k ? 'var(--ink)' : 'var(--rule)'),
              transition: 'all 200ms',
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', border: '1px solid var(--rule)', background: 'var(--paper-warm)' }}>
        <div ref={elRef} style={{ height: 560, width: '100%' }} />
        {/* Legend */}
        <div style={{
          position: 'absolute', bottom: 14, left: 14, zIndex: 400,
          background: 'var(--cream)', padding: '12px 14px',
          border: '1px solid var(--rule)',
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
          display: 'grid', gap: 6,
        }}>
          {[
            ['Beach Club', 'var(--sea)'],
            ['Food', 'var(--terra)'],
            ['Bar', 'var(--plum)'],
            ['Sight', 'var(--ochre-deep)'],
            ['Activity', 'var(--ochre-deep)'],
            ['Shop', 'var(--olive)'],
            ['Neighborhood', 'var(--ink-soft)'],
          ].map(([l, c]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />
              <span style={{ color: 'var(--ink-soft)' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .spot-pin { background: transparent; border: none; }
        .spot-pin-dot {
          display: block;
          width: 14px; height: 14px;
          border-radius: 50%;
          border: 2px solid var(--cream);
          box-shadow: 0 1px 4px oklch(20% 0.05 60 / 0.4);
          transition: transform 180ms;
          cursor: pointer;
        }
        .spot-pin:hover .spot-pin-dot { transform: scale(1.4); }
        .spot-tooltip {
          background: var(--ink);
          color: var(--cream);
          border: none;
          padding: 8px 12px;
          font-family: var(--sans);
          font-size: 12px;
          box-shadow: 0 4px 16px oklch(20% 0.05 60 / 0.3);
          border-radius: 0;
        }
        .spot-tooltip:before { display: none; }
        .leaflet-container { font-family: var(--sans); background: var(--paper-warm); }
        .leaflet-control-attribution { font-size: 9px !important; background: var(--cream) !important; color: var(--ink-mute) !important; }
        .leaflet-control-zoom a {
          background: var(--cream) !important; color: var(--ink) !important;
          border: 1px solid var(--rule) !important; font-family: var(--serif) !important;
        }
        .leaflet-control-zoom a:hover { background: var(--paper-warm) !important; }
      `}</style>
    </div>
  );
}

function categoryHex(cat) {
  // resolved hex equivalents (Leaflet markers can't read CSS vars)
  return ({
    'Beach Club':   '#3a8aa3',
    'Food':         '#c45a3a',
    'Bar':          '#7a4870',
    'Sight':        '#a37222',
    'Activity':     '#a37222',
    'Shop':         '#6b7339',
    'Neighborhood': '#7a7468',
  })[cat] || '#3a3530';
}

window.SpotsMap = SpotsMap;
