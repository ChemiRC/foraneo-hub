import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import MapView from './MapView';
import KarmaView from './KarmaView';
import BusinessPanel from './BusinessPanel';
import Toast from '../components/ui/Toast';

const ICONS = {
  map: '🗺',
  karma: '⚖️',
  finance: '💳',
  gov: '🏛',
};

// Modal de Métricas de Gobernanza (vista demo para autoridades)
function GovernanceModal({ onClose }) {
  const kpis = [
    { label: 'Comercios validados', value: '320', delta: '+12%', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600' },
    { label: 'Ciudadanos activos', value: '24,180', delta: '+8.4%', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600' },
    { label: 'Reportes resueltos', value: '94%', delta: '+5pp', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' },
    { label: 'Karma promedio barrial', value: '78/100', delta: '+3', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
  ];

  const zoneStats = [
    { zone: 'CUCEI · Olímpica', confidence: 87, transactions: 1240, color: '#FF6B35' },
    { zone: 'CUCEA · Zapopan', confidence: 81, transactions: 980, color: '#4ECDC4' },
    { zone: 'CUCSH · Belenes', confidence: 73, transactions: 720, color: '#A855F7' },
  ];

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div onClick={e => e.stopPropagation()} className="relative bg-white rounded-[2rem] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header gradiente */}
        <div className="relative bg-gradient-to-br from-indigo-900 via-slate-900 to-emerald-900 p-8 text-white overflow-hidden rounded-t-[2rem]">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl" />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/10 border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">Vista Gobernanza · Demo</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight">🏛 Métricas de Gobernanza</h2>
              <p className="text-slate-300 text-sm font-medium mt-1">Tablero ejecutivo para autoridades municipales y estatales</p>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white text-2xl font-light leading-none">×</button>
          </div>
        </div>

        <div className="p-8 space-y-7">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map(kpi => (
              <div key={kpi.label} className={`rounded-2xl p-4 border ${kpi.bg} ${kpi.border}`}>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{kpi.label}</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{kpi.value}</p>
                <p className={`text-[11px] font-bold mt-1 ${kpi.text}`}>↗ {kpi.delta} vs trimestre</p>
              </div>
            ))}
          </div>

          {/* Mapa de zonas */}
          <div>
            <h3 className="text-sm font-black text-slate-800 mb-3">📍 Confianza por zona barrial</h3>
            <div className="space-y-2.5">
              {zoneStats.map(z => (
                <div key={z.zone} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: z.color }} />
                      <span className="text-sm font-bold text-slate-800">{z.zone}</span>
                    </div>
                    <span className="text-xs font-black text-slate-500">{z.transactions.toLocaleString()} transacciones</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-slate-200">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${z.confidence}%`, background: `linear-gradient(90deg, ${z.color}, ${z.color}99)` }} />
                    </div>
                    <span className="text-xs font-black w-10 text-right" style={{ color: z.color }}>{z.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Acciones simuladas */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-amber-700 mb-2">⚡ Alertas para autoridades</p>
            <ul className="space-y-1.5 text-sm text-amber-900 font-medium">
              <li>• 3 comercios reportados con karma &lt; 40 en CUCSH (revisión sanitaria)</li>
              <li>• Concentración inusual de pagos en zona Belenes (oportunidad fiscal)</li>
              <li>• 12 ciudadanos solicitaron validación oficial este mes</li>
            </ul>
          </div>

          <button onClick={onClose} className="w-full py-3 bg-slate-900 hover:bg-indigo-600 text-white font-black rounded-xl text-sm transition-colors">
            Cerrar tablero
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const { user, currentView, navigate, logout } = useAppContext();
  const [govOpen, setGovOpen] = useState(false);

  const navItems = [
    { id: 'mapa',   label: 'Mapa de Confianza',          sub: 'Geolocalización ciudadana', icon: ICONS.map },
    { id: 'karma',  label: 'Auditoría Ciudadana',        sub: 'Sistema Karma',             icon: ICONS.karma },
    ...(user?.role === 'comercio'
      ? [{ id: 'negocios', label: 'Prosperidad Económica', sub: 'Pagos & Beneficios BaaS', icon: ICONS.finance }]
      : []),
  ];

  const isMapView = currentView === 'mapa';
  const activeLabel = navItems.find(n => n.id === currentView)?.label ?? 'Dashboard';

  return (
    <div className="flex h-screen w-screen bg-slate-100 font-sans overflow-hidden">
      <Toast />

      {govOpen && <GovernanceModal onClose={() => setGovOpen(false)} />}

      {/* Sidebar fijo · CivicTrust */}
      <aside className="w-[260px] shrink-0 bg-white border-r border-slate-200/80 flex flex-col z-20 shadow-sm">

        {/* Logo CivicTrust */}
        <div className="px-5 pt-6 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-emerald-600 shadow-md shadow-indigo-900/30 text-white font-black text-base tracking-tight shrink-0">
              CT
            </div>
            <div className="min-w-0">
              <h1 className="text-[15px] font-black text-slate-900 tracking-tight leading-tight truncate">
                CivicTrust <span className="text-emerald-600">MX</span>
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.15em]">GovTech BaaS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3">Módulos cívicos</p>
          {navItems.map(item => {
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left ${active ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-md shadow-indigo-500/30' : 'hover:bg-slate-50'}`}
              >
                <span className={`text-lg shrink-0 ${active ? 'opacity-100' : 'opacity-70'}`}>{item.icon}</span>
                <div className="min-w-0">
                  <p className={`text-[13px] font-bold leading-tight ${active ? 'text-white' : 'text-slate-700'}`}>{item.label}</p>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider mt-0.5 ${active ? 'text-indigo-100' : 'text-slate-400'}`}>{item.sub}</p>
                </div>
              </button>
            );
          })}

          {/* Sección administrativa */}
          <div className="pt-5 mt-5 border-t border-slate-100">
            <p className="px-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3">Gobernanza</p>
            <button
              onClick={() => setGovOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left hover:bg-amber-50 border border-dashed border-amber-200 bg-amber-50/40"
            >
              <span className="text-lg shrink-0">{ICONS.gov}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-[13px] font-bold leading-tight text-slate-700">Métricas de Gobernanza</p>
                </div>
                <p className="text-[9px] font-black text-amber-700 uppercase tracking-wider mt-0.5">Demo · Autoridades</p>
              </div>
              <span className="text-amber-500 text-xs font-black">↗</span>
            </button>
          </div>
        </nav>

        {/* Footer / usuario */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-xs shrink-0 ${user?.role === 'comercio' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
              {user?.avatar ?? '?'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-black text-slate-800 truncate leading-tight">{user?.name ?? 'Invitado'}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user?.id ?? '—'}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-red-200 text-red-500 text-[11px] font-bold hover:bg-red-50 transition-colors">
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Área principal · ocupa todo el espacio restante */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0 bg-slate-50">

        {/* Topbar */}
        <header className="h-14 bg-white/90 backdrop-blur-md border-b border-slate-200/70 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <h2 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.15em]">
              {activeLabel}
            </h2>
            <span className="text-slate-300 text-xs">·</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CivicTrust México</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setGovOpen(true)} className="hidden md:flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors">
              🏛 Gobernanza
            </button>
            <button className="relative text-slate-400 hover:text-indigo-600 transition-colors">
              <span className="text-lg">🔔</span>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <span className="text-[11px] font-bold text-slate-400">
              {new Date().toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
          </div>
        </header>

        {/* Contenido */}
        {isMapView ? (
          <div className="flex-1 overflow-hidden">
            <MapView />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto">
              {currentView === 'karma' && <KarmaView />}
              {currentView === 'negocios' && <BusinessPanel />}
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}
