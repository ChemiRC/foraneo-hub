import { useAppContext } from '../context/AppContext';
import MapView from './MapView';
import KarmaView from './KarmaView';
import BusinessPanel from './BusinessPanel';
import Toast from '../components/ui/Toast';

const ICONS = { map: '▣', karma: '✦', finance: '◆' };

export default function DashboardLayout() {
  const { user, currentView, navigate, logout } = useAppContext();

  const navItems = [
    { id: 'mapa', label: 'Geolocalización', sub: 'Mapeo segregado', icon: ICONS.map },
    { id: 'karma', label: 'Auditoría SQA', sub: 'Sistema Karma', icon: ICONS.karma },
    ...(user.role === 'comercio' ? [{ id: 'negocios', label: 'Pagos y Beneficios', sub: 'Validación App', icon: ICONS.finance }] : []),
  ];

  const isMapView = currentView === 'mapa';

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      <Toast />

      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-white border-r border-slate-200/80 flex flex-col z-20 shadow-sm">

        {/* Logo */}
        <div className="px-5 pt-6 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-slate-900 shadow-md shadow-indigo-900/30 text-white font-black text-sm tracking-tight shrink-0">
              FH
            </div>
            <div>
              <h1 className="text-[15px] font-black text-slate-900 tracking-tight leading-tight">Foráneo Hub</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.15em]">En línea</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="px-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3">Módulos</p>
          {navItems.map(item => {
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left ${active ? 'bg-indigo-600 shadow-md shadow-indigo-500/30' : 'hover:bg-slate-50'}`}
              >
                <span className={`text-lg shrink-0 ${active ? 'opacity-100' : 'opacity-60'}`}>{item.icon}</span>
                <div>
                  <p className={`text-[13px] font-bold leading-tight ${active ? 'text-white' : 'text-slate-700'}`}>{item.label}</p>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider mt-0.5 ${active ? 'text-indigo-200' : 'text-slate-400'}`}>{item.sub}</p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-xs shrink-0 ${user.role === 'comercio' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
              {user.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-black text-slate-800 truncate leading-tight">{user.name}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user.id}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-red-200 text-red-500 text-[11px] font-bold hover:bg-red-50 transition-colors">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Topbar */}
        <header className="h-14 bg-white/90 backdrop-blur-md border-b border-slate-200/70 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <h2 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.15em]">
              {navItems.find(n => n.id === currentView)?.label ?? 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-slate-400 hover:text-indigo-600 transition-colors">
              <span className="text-lg">•</span>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <span className="text-[11px] font-bold text-slate-400">
              {new Date().toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
          </div>
        </header>

        {/* Content */}
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
    </div>
  );
}
