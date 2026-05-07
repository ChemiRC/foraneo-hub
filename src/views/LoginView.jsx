import { useAppContext } from '../context/AppContext';
import { useState } from 'react';

const FEATURES = [
  { icon: '📍', text: 'Geofencing por zona universitaria' },
  { icon: '⭐', text: 'Algoritmo de Karma comunitario' },
  { icon: '🔒', text: 'Rentas verificadas anti-fraude' },
  { icon: '💳', text: 'POS con modelo de comisión 6%' },
];

export default function LoginView() {
  const { login, isLoading } = useAppContext();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#0B1120]">

      {/* Ambient light blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] animate-pulse rounded-full bg-indigo-700/20 blur-[140px]" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] animate-pulse rounded-full bg-emerald-700/15 blur-[140px]" style={{ animationDelay: '2.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] animate-pulse rounded-full bg-purple-700/10 blur-[100px]" style={{ animationDelay: '5s' }} />
      </div>

      {/* Grid pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-[920px] mx-4 rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_32px_80px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row">

        {/* Left: Branding */}
        <div className="relative flex-1 p-12 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-950/60 to-slate-950/60 border-b md:border-b-0 md:border-r border-white/5">
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-indigo-500/10 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-purple-500/10 blur-2xl" />

          <div className="relative z-10">
            {/* Logo */}
            <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-[0_0_50px_rgba(99,102,241,0.45)] -rotate-6">
              <span className="text-4xl">📍</span>
            </div>

            <h1 className="text-5xl font-black tracking-tight text-white mb-2 leading-tight">
              Foráneo<br />Hub
            </h1>
            <p className="text-indigo-300/80 text-sm font-semibold tracking-wide mb-8 leading-relaxed max-w-[240px]">
              Conectando la economía local con la comunidad universitaria
            </p>

            {/* Features */}
            <ul className="space-y-3">
              {FEATURES.map(f => (
                <li key={f.text} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm shrink-0">
                    {f.icon}
                  </span>
                  <span className="text-sm text-slate-300 font-medium">{f.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer badge */}
          <div className="relative z-10 mt-10 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">
              v2.0 · Universidad de Guadalajara
            </span>
          </div>
        </div>

        {/* Right: Auth cards */}
        <div className="flex-1 p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-white mb-1">Acceso al Sistema</h2>
            <p className="text-slate-400 text-sm font-medium">Selecciona tu perfil para continuar</p>
          </div>

          <div className="space-y-4">
            {/* Foráneo Card */}
            <button
              onClick={() => login('foraneo')}
              onMouseEnter={() => setHoveredCard('foraneo')}
              onMouseLeave={() => setHoveredCard(null)}
              disabled={isLoading}
              className={`relative w-full flex items-center gap-5 p-6 rounded-2xl border transition-all duration-300 overflow-hidden text-left disabled:opacity-60 disabled:cursor-wait ${
                hoveredCard === 'foraneo'
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_40px_rgba(99,102,241,0.2)]'
                  : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08]'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent transition-transform duration-500 ${hoveredCard === 'foraneo' ? 'translate-x-0' : '-translate-x-full'}`} />
              <span className={`text-5xl relative z-10 transition-transform duration-300 ${hoveredCard === 'foraneo' ? 'scale-110 -rotate-6' : ''}`}>
                👨‍🎓
              </span>
              <div className="relative z-10">
                <p className="text-lg font-black text-white">Estudiante Foráneo</p>
                <p className="text-sm text-indigo-200/60 font-medium mt-0.5">
                  Explorar zonas · Auditar locales · Ver rentas
                </p>
              </div>
              <div className={`ml-auto relative z-10 transition-all duration-300 ${hoveredCard === 'foraneo' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
                <span className="text-indigo-400 text-xl font-bold">→</span>
              </div>
            </button>

            {/* Negocio Card */}
            <button
              onClick={() => login('comercio')}
              onMouseEnter={() => setHoveredCard('comercio')}
              onMouseLeave={() => setHoveredCard(null)}
              disabled={isLoading}
              className={`relative w-full flex items-center gap-5 p-6 rounded-2xl border transition-all duration-300 overflow-hidden text-left disabled:opacity-60 disabled:cursor-wait ${
                hoveredCard === 'comercio'
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.2)]'
                  : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08]'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent transition-transform duration-500 ${hoveredCard === 'comercio' ? 'translate-x-0' : '-translate-x-full'}`} />
              <span className={`text-5xl relative z-10 transition-transform duration-300 ${hoveredCard === 'comercio' ? 'scale-110 rotate-6' : ''}`}>
                🏪
              </span>
              <div className="relative z-10">
                <p className="text-lg font-black text-white">Negocio Local</p>
                <p className="text-sm text-emerald-200/60 font-medium mt-0.5">
                  Terminal POS · Dashboard financiero · Comisión 6%
                </p>
              </div>
              <div className={`ml-auto relative z-10 transition-all duration-300 ${hoveredCard === 'comercio' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
                <span className="text-emerald-400 text-xl font-bold">→</span>
              </div>
            </button>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="mt-6 flex items-center justify-center gap-3 text-slate-400">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold uppercase tracking-widest">Autenticando vía Firebase…</span>
            </div>
          )}

          {/* Footer note */}
          <p className="mt-8 text-center text-[11px] text-slate-600 font-medium">
            🔒 Entorno de demostración · Sin datos reales
          </p>
        </div>
      </div>
    </div>
  );
}
