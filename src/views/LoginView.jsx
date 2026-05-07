import { useAppContext } from '../context/AppContext';
import { useState } from 'react';

export default function LoginView() {
  const { login, isLoading } = useAppContext();
  const [hoverRole, setHoverRole] = useState(null);

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden bg-[#0F172A]">
      {/* Orbes de luz decorativos para nivel empresarial */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-[100px]" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-[100px]" />

      <div className="relative z-10 w-full max-w-[440px] px-6">
        <div className="rounded-[40px] border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-2xl">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20">
              <span className="text-4xl">📍</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white">Foráneo Hub</h1>
            <p className="mt-3 text-sm font-bold uppercase tracking-[0.3em] text-indigo-400/80">
              Ecosistema Universitario
            </p>
          </div>

          <div className="grid gap-4">
            <button
              onMouseEnter={() => setHoverRole('foraneo')}
              onMouseLeave={() => setHoverRole(null)}
              onClick={() => login('foraneo')}
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-2xl bg-white/10 p-5 font-bold text-white transition-all hover:bg-white/15 disabled:opacity-50"
            >
              <span className="text-2xl transition-transform group-hover:scale-125">👨‍🎓</span>
              <div className="text-left">
                <p className="text-sm">Ingresar como Foráneo</p>
                <p className="text-[10px] font-medium text-slate-400">Busca rentas y servicios validados</p>
              </div>
            </button>

            <button
              onMouseEnter={() => setHoverRole('comercio')}
              onMouseLeave={() => setHoverRole(null)}
              onClick={() => login('comercio')}
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 font-bold text-white transition-all hover:bg-emerald-500/20 disabled:opacity-50"
            >
              <span className="text-2xl transition-transform group-hover:scale-125">🏪</span>
              <div className="text-left">
                <p className="text-sm">Panel de Comercio</p>
                <p className="text-[10px] font-medium text-emerald-400/70">Gestiona tus ventas y visibilidad</p>
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Desarrollado con Arquitectura BaaS & SQA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}