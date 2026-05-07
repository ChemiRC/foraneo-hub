import { useAppContext } from '../context/AppContext';
import MapView from './MapView';
import KarmaView from './KarmaView';
import BusinessPanel from './BusinessPanel';
import Toast from '../components/ui/Toast';

export default function DashboardLayout() {
  const { user, currentView, navigate, logout } = useAppContext();

  const menuItems = [
    { id: 'mapa', label: 'Explorar Mapa', icon: '📍' },
    { id: 'karma', label: 'Comunidad Karma', icon: '⭐' },
    ...(user.role === 'comercio' ? [{ id: 'negocios', label: 'Terminal de Ventas', icon: '💳' }] : []),
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans">
      <Toast />
      
      {/* Sidebar Premium */}
      <aside className="relative z-30 w-[300px] flex-shrink-0 border-r border-slate-200 bg-white shadow-sm">
        <div className="flex h-full flex-col p-8">
          <div className="mb-10 flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-black text-white shadow-lg ${user.role === 'comercio' ? 'bg-emerald-500 shadow-emerald-200' : 'bg-indigo-600 shadow-indigo-200'}`}>
              {user.avatar}
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-800">{user.name}</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{user.role}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            <p className="mb-4 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400/60">Menú Principal</p>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold transition-all ${
                  currentView === item.id 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto border-t border-slate-100 pt-6">
            <button 
              onClick={logout}
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-red-50 py-4 text-xs font-black uppercase tracking-widest text-red-600 transition-all hover:bg-red-600 hover:text-white"
            >
              <span>🚪</span> Cerrar Sistema
            </button>
          </div>
        </div>
      </aside>

      {/* Área de Contenido */}
      <main className="relative flex-1 overflow-y-auto px-10 py-10">
        <div className="mx-auto max-w-6xl h-full">
          {currentView === 'mapa' && <MapView />}
          {currentView === 'karma' && <KarmaView />}
          {currentView === 'negocios' && <BusinessPanel />}
        </div>
      </main>
    </div>
  );
}