import { useAppContext } from '../context/AppContext';
import MapView from './MapView';
import KarmaView from './KarmaView';
import BusinessPanel from './BusinessPanel';
import Toast from '../components/ui/Toast';

export default function DashboardLayout() {
  const { user, currentView, navigate, logout } = useAppContext();

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      <Toast />
      <aside className="w-[280px] bg-white shadow-2xl flex flex-col z-20">
        <div className="p-8 border-b border-slate-50">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl mb-4 shadow-lg shadow-indigo-200">
            {user.avatar}
          </div>
          <p className="font-black text-slate-800 leading-tight">{user.name}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">{user.id} | {user.role}</p>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          <button onClick={() => navigate('mapa')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 ${currentView === 'mapa' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>📍 Mapa Zonal</button>
          <button onClick={() => navigate('karma')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 ${currentView === 'karma' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>⭐ Sistema Karma</button>
          {user.role === 'comercio' && <button onClick={() => navigate('negocios')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 ${currentView === 'negocios' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>💳 Panel Ventas (6%)</button>}
        </nav>
        
        <div className="p-6">
          <button onClick={logout} className="w-full bg-red-50 text-red-600 font-black py-3 rounded-xl text-xs hover:bg-red-100 transition-colors uppercase tracking-widest">Cerrar Sistema</button>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        {currentView === 'mapa' && <MapView />}
        {currentView === 'karma' && <KarmaView />}
        {currentView === 'negocios' && <BusinessPanel />}
      </main>
    </div>
  );
}