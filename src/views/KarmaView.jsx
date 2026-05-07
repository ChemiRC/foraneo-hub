import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { fetchAllPOIs, voteKarma } from '../services/mockApi';

const getTier = (score) =>
  score >= 80 ? { label: 'Certificado', bg: '#F0FDF4', text: '#065F46', color: '#10B981' }
  : score >= 60 ? { label: 'Confiable', bg: '#FFFBEB', text: '#92400E', color: '#F59E0B' }
  : { label: 'En Revisión', bg: '#FEF2F2', text: '#991B1B', color: '#EF4444' };

const CATEGORIES = {
  comida: { icon: '🍽', label: 'Comida', color: '#FF6B35' },
  renta: { icon: '🏠', label: 'Renta', color: '#4ECDC4' },
  vivienda: { icon: '🏡', label: 'Vivienda', color: '#4ECDC4' },
  café: { icon: '☕', label: 'Café', color: '#A855F7' },
  servicio: { icon: '⚙️', label: 'Servicio', color: '#3B82F6' },
  farmacia: { icon: '💊', label: 'Farmacia', color: '#10B981' },
};

function KarmaCard({ poi, onVote, voting, voted }) {
  const tier = getTier(poi.karma);
  const cat = CATEGORIES[poi.category] || CATEGORIES.servicio;

  return (
    <div style={{
      background: 'white',
      borderRadius: '24px',
      border: '1px solid #F1F5F9',
      boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
    }}
      onMouseOver={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseOut={e => { e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ display: 'flex' }}>
        {/* Image */}
        <div style={{ width: '160px', height: '160px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
          <img src={poi.images?.[0] || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=300&q=70'} alt={poi.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.1))' }} />
          <div style={{ position: 'absolute', top: '10px', left: '10px', background: tier.bg, border: `1px solid ${tier.color}30`, borderRadius: '99px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', fontWeight: 800 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: tier.color }} />
            {tier.label}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Title + Score */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{poi.name}</h3>
                {poi.verified && <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '99px' }}>✓ Verificado</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ background: `${cat.color}15`, color: cat.color, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px' }}>
                  {cat.label}
                </span>
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>· {poi.zone?.toUpperCase()}</span>
                {poi.reportCount > 0 && <span style={{ fontSize: '11px', color: '#DC2626', background: '#FEF2F2', padding: '3px 10px', borderRadius: '99px' }}>⚠️ {poi.reportCount} reportes</span>}
              </div>
            </div>
            <div style={{ background: tier.bg, borderRadius: '16px', padding: '8px 12px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: '22px', fontWeight: 900, color: tier.text, lineHeight: 1 }}>{poi.karma}</div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: tier.text, opacity: 0.7, textTransform: 'uppercase', marginTop: '2px' }}>Score</div>
            </div>
          </div>

          {/* Description */}
          <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6, margin: 0, borderLeft: `3px solid ${tier.color}`, paddingLeft: '12px' }}>
            {poi.description}
          </p>

          {/* Progress + Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px' }}>
                <span>Veracidad</span>
                <span>{poi.karma}%</span>
              </div>
              <div style={{ height: '5px', background: '#F1F5F9', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${poi.karma}%`, height: '100%', background: `linear-gradient(90deg, ${tier.color}, ${tier.color}AA)`, borderRadius: '99px', transition: 'width 1s ease' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px', fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                <span>👍 {poi.votes}</span>
                <span>👎 {poi.downvotes}</span>
              </div>
            </div>

            {voted ? (
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#64748B', fontSize: '12px', fontWeight: 700, padding: '10px 14px', borderRadius: '12px', flexShrink: 0 }}>
                ✓ Votado
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button
                  onClick={() => onVote(poi.id, 'up')}
                  disabled={voting}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px', background: '#F0FDF4', color: '#15803D',
                    border: '1px solid #BBF7D0', padding: '8px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 700,
                    cursor: voting ? 'not-allowed' : 'pointer', opacity: voting ? 0.6 : 1, transition: 'all 0.15s ease',
                  }}
                  onMouseOver={e => { if (!voting) { e.currentTarget.style.background = '#16A34A'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#16A34A'; } }}
                  onMouseOut={e => { e.currentTarget.style.background = '#F0FDF4'; e.currentTarget.style.color = '#15803D'; e.currentTarget.style.borderColor = '#BBF7D0'; }}
                >
                  {voting ? '⏳' : '✓'} Validar
                </button>
                <button
                  onClick={() => onVote(poi.id, 'down')}
                  disabled={voting}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px', background: '#FEF2F2', color: '#DC2626',
                    border: '1px solid #FECACA', padding: '8px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 700,
                    cursor: voting ? 'not-allowed' : 'pointer', opacity: voting ? 0.6 : 1, transition: 'all 0.15s ease',
                  }}
                  onMouseOver={e => { if (!voting) { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#DC2626'; } }}
                  onMouseOut={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.borderColor = '#FECACA'; }}
                >
                  {voting ? '⏳' : '🚩'} Reportar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KarmaView() {
  const { showToast } = useAppContext();
  const [pois, setPois] = useState([]);
  const [votingId, setVotingId] = useState(null);
  const [voted, setVoted] = useState({});
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllPOIs().then(p => { setPois(p); setLoading(false); });
  }, []);

  const handleVote = async (poiId, vote) => {
    setVotingId(poiId);
    try {
      const result = await voteKarma(poiId, vote);
      setPois(prev => prev.map(p => p.id === poiId ? { ...p, karma: result.newKarma, votes: result.votes, downvotes: result.downvotes } : p));
      setVoted(prev => ({ ...prev, [poiId]: vote }));
      showToast(vote === 'up' ? '✓ Validación registrada' : '🚩 Reporte enviado', vote === 'up' ? 'success' : 'info');
    } finally {
      setVotingId(null);
    }
  };

  const certified = pois.filter(p => p.karma >= 80).length;
  const flagged = pois.filter(p => p.reportCount > 0).length;
  const inReview = pois.filter(p => p.karma < 60).length;

  const filtered = filter === 'certified' ? pois.filter(p => p.karma >= 80) : filter === 'flagged' ? pois.filter(p => p.reportCount > 0) : filter === 'review' ? pois.filter(p => p.karma < 60) : pois;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", paddingBottom: '40px' }}>
      {/* Header · Trust & Safety Center */}
      <header style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px', padding: '3px 10px', borderRadius: '99px', background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 0 3px #10B98133' }} />
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#4338CA', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Trust & Safety · Sistema activo</span>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.4px' }}>
              ⚖️ Auditoría Ciudadana
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', fontWeight: 500, marginTop: '4px' }}>
              Tu voto recalibra el algoritmo de Karma · cada validación fortalece la confianza barrial
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { label: 'Auditados', value: pois.length, bg: 'white', border: '#E2E8F0', color: '#0F172A' },
              { label: 'Certificados', value: certified, bg: '#F0FDF4', border: '#A7F3D0', color: '#15803D' },
              { label: 'Con reportes', value: flagged, bg: '#FEF2F2', border: '#FECACA', color: '#DC2626' },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '16px', padding: '10px 16px', textAlign: 'center', minWidth: '88px' }}>
                <div style={{ fontSize: '20px', fontWeight: 900, color: s.color }}>{loading ? '–' : s.value}</div>
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginTop: '3px', letterSpacing: '0.5px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Salud global de confianza */}
        {!loading && pois.length > 0 && (() => {
          const avgKarma = Math.round(pois.reduce((acc, p) => acc + p.karma, 0) / pois.length);
          const tierColor = avgKarma >= 80 ? '#10B981' : avgKarma >= 60 ? '#F59E0B' : '#EF4444';
          const tierLabel = avgKarma >= 80 ? 'Confianza Alta' : avgKarma >= 60 ? 'Confianza Media' : 'Requiere Atención';
          return (
            <div style={{ marginTop: '18px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: `${tierColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                🛡
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Salud global de confianza barrial</span>
                  <span style={{ fontSize: '14px', fontWeight: 900, color: tierColor }}>{avgKarma}/100 · {tierLabel}</span>
                </div>
                <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: `${avgKarma}%`, height: '100%', borderRadius: '99px', background: `linear-gradient(90deg, ${tierColor}, ${tierColor}AA)`, transition: 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
                </div>
              </div>
            </div>
          );
        })()}

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '18px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `Todos (${pois.length})` },
            { id: 'certified', label: `✓ Certificados (${certified})` },
            { id: 'flagged', label: `⚠️ Con Reportes (${flagged})` },
            { id: 'review', label: `🔍 En Revisión (${inReview})` },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '8px 16px', borderRadius: '12px',
                border: filter === f.id ? 'none' : '1px solid #E2E8F0',
                background: filter === f.id ? '#0F172A' : 'white',
                color: filter === f.id ? 'white' : '#64748B',
                fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.15s ease', boxShadow: filter === f.id ? '0 2px 8px rgba(15,23,42,0.2)' : 'none',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      {/* Cards */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ background: 'white', borderRadius: '24px', height: '160px', display: 'flex', border: '1px solid #F1F5F9' }}>
              <div style={{ width: '160px', background: '#F1F5F9', animation: 'pulse 1.5s ease infinite' }} />
              <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ height: '18px', background: '#F1F5F9', borderRadius: '8px', width: '60%', animation: 'pulse 1.5s ease infinite' }} />
                <div style={{ height: '13px', background: '#F1F5F9', borderRadius: '8px', width: '90%', animation: 'pulse 1.5s ease infinite' }} />
              </div>
            </div>
          ))}
          <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
          <p style={{ fontWeight: 700, fontSize: '16px', color: '#CBD5E1' }}>Sin resultados en este filtro</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.sort((a, b) => b.karma - a.karma).map(poi => (
            <KarmaCard
              key={poi.id}
              poi={poi}
              onVote={handleVote}
              voting={votingId === poi.id}
              voted={!!voted[poi.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
