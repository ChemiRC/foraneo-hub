import { useAppContext } from '../context/AppContext';

export default function LoginView() {
  const { login, isLoading } = useAppContext();

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-black">
      <div className="bg-white/10 backdrop-blur-md p-12 rounded-3xl shadow-2xl w-[400px] text-center border border-white/20">
        <div className="w-20 h-20 bg-indigo-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg transform rotate-3">
          <span className="text-4xl text-white">📍</span>
        </div>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Foráneo Hub</h1>
        <p className="text-indigo-200 mb-10 text-sm font-bold uppercase tracking-widest">BaaS Architecture</p>
        
        <button onClick={() => login('foraneo')} disabled={isLoading} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl mb-4 hover:bg-indigo-500 transition-all shadow-lg disabled:opacity-50 flex justify-center items-center gap-2">
          {isLoading ? <span className="animate-spin">⏳</span> : '👨‍🎓'} Ingreso Foráneo
        </button>
        
        <button onClick={() => login('comercio')} disabled={isLoading} className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-400 transition-all shadow-lg disabled:opacity-50 flex justify-center items-center gap-2">
          {isLoading ? <span className="animate-spin">⏳</span> : '🏪'} Panel Comercial
        </button>
      </div>
    </div>
  );
}