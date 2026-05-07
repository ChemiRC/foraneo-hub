import { useAppContext } from '../context/AppContext';
import MapView from './MapView';
import KarmaView from './KarmaView';
import BusinessPanel from './BusinessPanel';
import Toast from '../components/ui/Toast';

export default function DashboardLayout() {
  const { user, currentView, navigate, logout } = useAppContext();

  const navItems = [
    { id: 'mapa', label: 'Geolocalización', sub: 'Mapeo segregado', icon: '📍' },
    { id: 'karma', label: 'Auditoría SQA', sub: 'Sistema Karma', icon: '⭐' },
    ...(user.role === 'comercio' ? [{ id: 'negocios', label: 'Finanzas Hub', sub: 'Modelo 6%', icon: '💳' }] : [])
  ];

  return (
    <div className="flex h-screen bg-[#F1F5F9] font-sans overflow-hidden">
      <Toast />
      
      {/* SIDEBAR EMPRESARIAL */}
      <aside className="w-[300px] bg-white border-r border-slate-200 flex flex-col z-20">
        <div className="p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg text-white font-black text-xl">
              FH
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Foráneo Hub</h1>
              <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">En línea</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Módulos Principales</p>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 ${currentView === item.id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50 border border-transparent'}`}
            >
              <span className={`text-xl ${currentView === item.id ? 'scale-110 drop-shadow-md' : 'opacity-70'}`}>{item.icon}</span>
              <div className="text-left">
                <p className={`text-sm font-bold ${currentView === item.id ? 'text-indigo-900' : 'text-slate-600'}`}>{item.label}</p>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${currentView === item.id ? 'text-indigo-500' : 'text-slate-400'}`}>{item.sub}</p>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between mb-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white ${user.role === 'comercio' ? 'bg-emerald-500' : 'bg-indigo-500'}`}>{user.avatar}</div>
              <div>
                <p className="text-sm font-black text-slate-800 line-clamp-1">{user.name}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">{user.id}</p>
              </div>
            </div>
          </div>
          <button onClick={logout} className="w-full flex justify-center items-center gap-2 py-3 rounded-xl bg-white border border-red-200 text-red-600 text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-colors">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* TOPBAR SIMULADO */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-10">
          <div className="relative w-96">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input type="text" placeholder="Buscar módulos, locales, reportes..." disabled className="w-full bg-slate-100 text-sm font-bold text-slate-600 rounded-full py-2.5 pl-12 pr-4 outline-none opacity-70 cursor-not-allowed" />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <span className="text-xl">🔔</span>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-7xl mx-auto h-full">
            {currentView === 'mapa' && <MapView />}
            {currentView === 'karma' && <KarmaView />}
            {currentView === 'negocios' && <BusinessPanel />}
          </div>
        </div>
      </main>
    </div>
  );
}