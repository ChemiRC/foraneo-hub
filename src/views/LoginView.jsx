import { useAppContext } from '../context/AppContext';
import { useState } from 'react';

const PILLARS = [
  { icon: '🛰', text: 'Mapas de confianza geo-referenciados' },
  { icon: '⚖️', text: 'Auditoría ciudadana con algoritmo Karma' },
  { icon: '🏛', text: 'Métricas de gobernanza para autoridades' },
  { icon: '💳', text: 'Infraestructura BaaS · 6% · descuento 15% OFF' },
];

const STATS = [
  { value: '24,000+', label: 'Ciudadanos conectados' },
  { value: '320', label: 'Comercios validados' },
  { value: '94%', label: 'Confianza promedio' },
];

export default function LoginView() {
  const { login, isLoading } = useAppContext();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#070B1C] py-10">
      {/* Gradientes animados de fondo */}
      <style>{`
        @keyframes drift1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(60px,-40px) scale(1.15); } }
        @keyframes drift2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-50px,40px) scale(1.1); } }
        @keyframes drift3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,30px) scale(1.2); } }
        @keyframes shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full bg-indigo-700/30 blur-[160px]" style={{ animation: 'drift1 18s ease-in-out infinite' }} />
        <div className="absolute -bottom-40 -right-40 h-[560px] w-[560px] rounded-full bg-emerald-700/25 blur-[160px]" style={{ animation: 'drift2 22s ease-in-out infinite' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full bg-purple-700/15 blur-[140px]" style={{ animation: 'drift3 26s ease-in-out infinite' }} />
      </div>

      {/* Patrón de cuadrícula */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '52px 52px' }} />

      {/* Tarjeta principal de cristal */}
      <div className="relative z-10 w-full max-w-[1040px] mx-4 rounded-[2.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col md:flex-row">

        {/* Lado izquierdo: Branding cívico */}
        <div className="relative flex-1 p-12 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-950/70 via-slate-950/60 to-slate-950/80 border-b md:border-b-0 md:border-r border-white/5">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />

          <div className="relative z-10">
            {/* Logo CivicTrust */}
            <div className="mb-8 flex items-center gap-3">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-[1.1rem] bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-500 shadow-[0_0_60px_rgba(99,102,241,0.5)] -rotate-3"
                style={{ backgroundSize: '200% 200%', animation: 'shimmer 6s linear infinite' }}>
                <span className="text-3xl">🏛</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-300 uppercase tracking-[0.3em]">GovTech · BaaS</p>
                <h1 className="text-2xl font-black text-white tracking-tight leading-none mt-1">
                  CivicTrust <span className="text-emerald-400">México</span>
                </h1>
              </div>
            </div>

            <h2 className="text-[34px] font-black tracking-tight text-white mb-4 leading-[1.1]">
              Inteligencia barrial<br />
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent">para una ciudadanía</span><br />
              que confía.
            </h2>

            <p className="text-slate-300/80 text-[15px] font-medium leading-relaxed mb-8 max-w-[400px]">
              Conectando la economía local con la confianza ciudadana. Una plataforma de gobernanza digital validada por la propia comunidad.
            </p>

            {/* Pilares */}
            <ul className="space-y-2.5">
              {PILLARS.map(p => (
                <li key={p.text} className="flex items-center gap-3 group">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/10 text-base shrink-0 group-hover:bg-white/15 transition-colors">
                    {p.icon}
                  </span>
                  <span className="text-[13px] text-slate-300 font-medium">{p.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats agregados */}
          <div className="relative z-10 mt-10 grid grid-cols-3 gap-3 pt-6 border-t border-white/5">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-xl font-black text-white tracking-tight leading-none">{s.value}</p>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lado derecho: Acceso por rol */}
        <div className="flex-1 p-10 flex flex-col justify-center bg-gradient-to-b from-transparent via-slate-900/20 to-transparent">
          <div className="mb-7">
            <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-300 uppercase tracking-[0.2em]">Sistema operativo</span>
            </div>
            <h2 className="text-[26px] font-black text-white mb-1 tracking-tight">Accede al sistema</h2>
            <p className="text-slate-400 text-sm font-medium">Selecciona tu perfil ciudadano para continuar</p>
          </div>

          <div className="space-y-3.5">
            {/* Tarjeta Ciudadano / Foráneo */}
            <button
              onClick={() => login('foraneo')}
              onMouseEnter={() => setHoveredCard('foraneo')}
              onMouseLeave={() => setHoveredCard(null)}
              disabled={isLoading}
              className={`relative w-full flex items-center gap-5 p-5 rounded-2xl border transition-all duration-300 overflow-hidden text-left disabled:opacity-60 disabled:cursor-wait ${
                hoveredCard === 'foraneo'
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_50px_rgba(99,102,241,0.25)]'
                  : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-indigo-500/10 to-transparent transition-transform duration-500 ${hoveredCard === 'foraneo' ? 'translate-x-0' : '-translate-x-full'}`} />
              <span className={`text-4xl relative z-10 transition-transform duration-300 ${hoveredCard === 'foraneo' ? 'scale-110 -rotate-6' : ''}`}>
                👤
              </span>
              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[15px] font-black text-white">Ciudadano</p>
                  <span className="text-[9px] font-black bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full uppercase tracking-wider">Foráneo / Local</span>
                </div>
                <p className="text-[12px] text-indigo-200/70 font-medium">
                  Audita locales · Vota karma · Activa descuentos 15% OFF
                </p>
              </div>
              <div className={`relative z-10 transition-all duration-300 ${hoveredCard === 'foraneo' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
                <span className="text-indigo-400 text-xl font-bold">→</span>
              </div>
            </button>

            {/* Tarjeta Comercio / Negocio Local */}
            <button
              onClick={() => login('comercio')}
              onMouseEnter={() => setHoveredCard('comercio')}
              onMouseLeave={() => setHoveredCard(null)}
              disabled={isLoading}
              className={`relative w-full flex items-center gap-5 p-5 rounded-2xl border transition-all duration-300 overflow-hidden text-left disabled:opacity-60 disabled:cursor-wait ${
                hoveredCard === 'comercio'
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.25)]'
                  : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent transition-transform duration-500 ${hoveredCard === 'comercio' ? 'translate-x-0' : '-translate-x-full'}`} />
              <span className={`text-4xl relative z-10 transition-transform duration-300 ${hoveredCard === 'comercio' ? 'scale-110 rotate-6' : ''}`}>
                🏪
              </span>
              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[15px] font-black text-white">Comercio Local</p>
                  <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full uppercase tracking-wider">Pagos & QR</span>
                </div>
                <p className="text-[12px] text-emerald-200/70 font-medium">
                  Recibe pagos · Métricas de atracción · BaaS 6%
                </p>
              </div>
              <div className={`relative z-10 transition-all duration-300 ${hoveredCard === 'comercio' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
                <span className="text-emerald-400 text-xl font-bold">→</span>
              </div>
            </button>

            {/* Tarjeta Gobierno (Vista demo) */}
            <button
              onClick={() => login('foraneo')}
              onMouseEnter={() => setHoveredCard('gov')}
              onMouseLeave={() => setHoveredCard(null)}
              disabled={isLoading}
              className={`relative w-full flex items-center gap-5 p-5 rounded-2xl border transition-all duration-300 overflow-hidden text-left disabled:opacity-60 disabled:cursor-wait ${
                hoveredCard === 'gov'
                  ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_50px_rgba(245,158,11,0.25)]'
                  : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent transition-transform duration-500 ${hoveredCard === 'gov' ? 'translate-x-0' : '-translate-x-full'}`} />
              <span className={`text-4xl relative z-10 transition-transform duration-300 ${hoveredCard === 'gov' ? 'scale-110 -rotate-3' : ''}`}>
                🏛
              </span>
              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[15px] font-black text-white">Autoridad / Gobierno</p>
                  <span className="text-[9px] font-black bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full uppercase tracking-wider">Demo</span>
                </div>
                <p className="text-[12px] text-amber-200/70 font-medium">
                  Métricas de gobernanza · Reportes barriales · KPIs cívicos
                </p>
              </div>
              <div className={`relative z-10 transition-all duration-300 ${hoveredCard === 'gov' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
                <span className="text-amber-400 text-xl font-bold">→</span>
              </div>
            </button>
          </div>

          {/* Indicador de carga */}
          {isLoading && (
            <div className="mt-6 flex items-center justify-center gap-3 text-slate-400">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold uppercase tracking-widest">Autenticando vía Firebase BaaS…</span>
            </div>
          )}

          {/* Footer */}
          <div className="mt-7 flex items-center justify-between gap-3 text-[10px] text-slate-500 font-semibold uppercase tracking-[0.15em]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              v3.0 · GovTech
            </span>
            <span>🔒 Datos encriptados E2E</span>
          </div>
        </div>
      </div>
    </div>
  );
}
