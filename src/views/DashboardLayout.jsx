import { useAppContext } from '../context/AppContext';
import MapView from './MapView';
import KarmaView from './KarmaView';
import BusinessPanel from './BusinessPanel';
import Toast from '../components/ui/Toast';

export default function DashboardLayout() {
  const { user, currentView, navigate, logout } = useAppContext();

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Toast />
      <aside className="w-[300px] bg-white shadow-2xl shadow-slate-200/50 flex flex-col z-20">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg ${user.role === 'comercio' ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-indigo-600 text-white shadow-indigo-600/30'}`}>
              {user.avatar}
            </div>
            <div>
              <p className="font-black text-slate-800 leading-tight">{user.name}</p>
              <p className="text-xs font-bold text-slate-400 uppercase mt-1">{user.role}</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-3">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Módulos Core</p>
          <button onClick={() => navigate('mapa')} className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${currentView === 'mapa' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-800'}`}>📍 Geolocalización</button>
          <button onClick={() => navigate('karma')} className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${currentView === 'karma' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-800'}`}>⭐ Sistema Karma</button>
          {user.role === 'comercio' && <button onClick={() => navigate('negocios')} className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 ${currentView === 'negocios' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-800'}`}>💳 Finanzas (6%)</button>}
        </nav>
        
        <div className="p-6">
          <button onClick={logout} className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-black py-4 rounded-2xl transition-colors">Salir del Sistema</button>
        </div>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto relative">
        {currentView === 'mapa' && <MapView />}
        {currentView === 'karma' && <KarmaView />}
        {currentView === 'negocios' && <BusinessPanel />}
      </main>
    </div>
  );
}