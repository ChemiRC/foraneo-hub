import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { mockApi } from '../services/mockApi';

// Deterministic QR-like grid (7×7 = 49 cells)
const QR_GRID = Array.from({ length: 49 }, (_, i) =>
  ((i * 13 + (i % 7) * 5 + Math.floor(i / 7) * 3) % 10) > 4
);

const INCOMING = [
  { citizen: 'Ana G.',    origin: 'Zacatecas',           desc: '☕ Café Americano',    amount: 45 },
  { citizen: 'Rodrigo M.',origin: 'Durango',              desc: '🍔 Combo Lunch',       amount: 95 },
  { citizen: 'Sofía R.',  origin: 'Aguascalientes',       desc: '💊 Paracetamol 10 pz', amount: 32 },
  { citizen: 'Carlos V.', origin: 'Nayarit',              desc: '🥗 Menú del día',      amount: 65 },
  { citizen: 'Paola H.',  origin: 'Colima',               desc: '☕ Americano XL',      amount: 38 },
  { citizen: 'Luis T.',   origin: 'Jalisco (foráneo)',    desc: '🍔 Hamburguesa doble', amount: 85 },
  { citizen: 'Mariana C.',origin: 'San Luis Potosí',      desc: '🧃 Jugo + sandwich',   amount: 55 },
];

function MetricCard({ label, value, sub, accent }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 border ${accent ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-transparent text-white shadow-xl shadow-emerald-500/25' : 'bg-white border-slate-100 shadow-sm'}`}>
      <div className={`absolute -right-8 -top-8 w-28 h-28 rounded-full ${accent ? 'bg-white/10' : 'bg-slate-50'} blur-sm`} />
      <div className="relative z-10">
        <p className={`text-[10px] font-black uppercase tracking-[0.15em] mb-2 ${accent ? 'text-emerald-100' : 'text-slate-400'}`}>{label}</p>
        <p className={`text-3xl font-black leading-none ${accent ? 'text-white' : 'text-slate-800'}`}>{value}</p>
        {sub && <p className={`text-xs font-medium mt-1.5 ${accent ? 'text-emerald-200' : 'text-slate-400'}`}>{sub}</p>}
      </div>
    </div>
  );
}

function PaymentRow({ trx }) {
  const hasDiscount = (trx.discountApplied ?? 0) > 0;
  return (
    <tr className="border-b border-slate-50 hover:bg-indigo-50/30 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-xs font-black text-indigo-700 shrink-0 border border-indigo-200">
            {(trx.citizen ?? 'C').charAt(0)}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700 leading-tight">{trx.citizen ?? 'Ciudadano CivicTrust'}</p>
            <p className="font-mono text-[10px] text-slate-400">{trx.id}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm font-semibold text-slate-600">{trx.desc}</p>
        {hasDiscount && (
          <span className="inline-flex items-center gap-1 mt-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black px-2 py-0.5 rounded-full">
            🎁 {(trx.discountApplied * 100).toFixed(0)}% OFF aplicado
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-right text-sm font-bold text-slate-500">${trx.amount.toFixed(2)}</td>
      <td className="px-6 py-4 text-right text-sm font-bold text-red-400">−${trx.commission.toFixed(2)}</td>
      <td className="px-6 py-4 text-right">
        <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-sm px-3 py-1 rounded-lg">
          ${trx.net.toFixed(2)}
        </span>
      </td>
    </tr>
  );
}

function QRModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" onClick={onClose}>
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="text-center mb-5">
          <h3 className="text-xl font-black text-slate-900">🎁 Código QR de Descuento</h3>
          <p className="text-slate-400 text-sm mt-1 font-medium">Muéstralo en tu negocio para activar el beneficio</p>
        </div>

        {/* QR visual */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 flex flex-col items-center gap-4 mb-5 border border-indigo-100">
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(7, 1fr)', width: '126px' }}>
              {QR_GRID.map((filled, i) => (
                <div key={i} className={`w-4 h-4 rounded-sm ${filled ? 'bg-slate-900' : 'bg-white border border-slate-100'}`} />
              ))}
            </div>
          </div>
          <div className="text-center">
            <p className="font-black text-2xl text-amber-600">15% OFF</p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">Pagando vía Foráneo Hub App</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-center mb-5">
          <p className="text-amber-700 text-xs font-semibold">
            📱 El ciudadano escanea este código al pagar con CivicTrust App y recibe el 15% OFF automáticamente.
          </p>
        </div>

        <button onClick={onClose} className="w-full py-3 bg-slate-900 hover:bg-indigo-600 text-white font-black rounded-xl text-sm transition-colors">
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default function BusinessPanel() {
  const { showToast } = useAppContext();
  const showToastRef = useRef(showToast);
  const [payments, setPayments] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [stats, setStats] = useState({ total: 0, fee: 0, net: 0, count: 0 });

  const attraction = { newStudents: 15, mapVisits: 43, qrUsed: 8 };

  useEffect(() => {
    const total = payments.reduce((acc, p) => acc + p.amount, 0);
    const fee  = payments.reduce((acc, p) => acc + p.commission, 0);
    setStats({ total, fee, net: total - fee, count: payments.length });
  }, [payments]);

  useEffect(() => {
    if (!isSimulating) return;
    const id = setInterval(async () => {
      const sample = INCOMING[Math.floor(Math.random() * INCOMING.length)];
      // ~50% de los pagos vía CivicTrust App aplican el descuento ciudadano del 15%
      const useDiscount = Math.random() > 0.5;
      const trx = await mockApi.processCommission(sample.amount, sample.desc, {
        discountApplied: useDiscount ? 0.15 : 0,
      });
      setPayments(prev => [{ ...trx, citizen: sample.citizen, origin: sample.origin }, ...prev]);
      const tag = useDiscount ? ` (15% OFF)` : '';
      showToastRef.current(`💳 ${sample.citizen}: $${trx.amount.toFixed(2)}${tag}`, 'success');
    }, 3500);
    return () => clearInterval(id);
  }, [isSimulating]);

  const toggleSimulation = () => {
    setIsSimulating(prev => {
      const next = !prev;
      showToast(next ? '📡 Recibiendo pagos en tiempo real…' : '⏸ Feed pausado', next ? 'success' : 'info');
      return next;
    });
  };

  const handleQR = () => {
    setShowQR(true);
    showToast('🎁 QR generado · 15% OFF para estudiantes', 'success');
  };

  return (
    <section className="pb-10 space-y-8 font-sans">
      {showQR && <QRModal onClose={() => setShowQR(false)} />}

      {/* Header · Centro de Validación CivicTrust */}
      <header className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-700">Prosperidad Económica · CivicTrust</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">💳 Centro de Validación de Pagos y Beneficios</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            <p className="text-slate-400 text-sm font-semibold">
              {isSimulating ? 'Recibiendo pagos ciudadanos vía App en tiempo real' : 'Feed pausado · activa el simulador'}
            </p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleQR}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-5 py-3 rounded-2xl shadow-lg shadow-amber-500/30 font-bold text-sm transition-all"
          >
            🎁 Generar QR 15% OFF
          </button>
          <button
            onClick={toggleSimulation}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl shadow-lg font-bold text-sm transition-all ${
              isSimulating
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30'
                : 'bg-slate-900 hover:bg-indigo-600 text-white shadow-slate-900/20'
            }`}
          >
            {isSimulating ? '⏸ Pausar Feed' : '▶ Simular Pagos'}
          </button>
        </div>
      </header>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricCard label="📊 Cobros Ciudadanos" value={`$${stats.total.toFixed(2)}`} sub={`${stats.count} pagos vía CivicTrust App`} />
        <MetricCard label="🛰 Costo Infraestructura BaaS" value={`−$${stats.fee.toFixed(2)}`} sub="6% Stripe + Firebase + Cloud" />
        <MetricCard label="💚 Liquidación Neta (T+1)" value={`$${stats.net.toFixed(2)}`} sub="Depósito automático mañana" accent />
      </div>

      {/* Métricas de Atracción */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6">
        <h3 className="font-black text-slate-800 text-base mb-4">📈 Métricas de Atracción · Esta Semana</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm text-center">
            <p className="text-3xl font-black text-indigo-600">{attraction.newStudents}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Nuevos ciudadanos</p>
            <p className="text-[11px] text-indigo-400 font-medium mt-0.5">llegaron vía CivicTrust 🎓</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm text-center">
            <p className="text-3xl font-black text-purple-600">{attraction.mapVisits}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Visitas al perfil</p>
            <p className="text-[11px] text-purple-400 font-medium mt-0.5">descubierto en el Mapa 🗺</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm text-center">
            <p className="text-3xl font-black text-emerald-600">{attraction.qrUsed}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Códigos QR usados</p>
            <p className="text-[11px] text-emerald-400 font-medium mt-0.5">descuento 15% OFF 🎁</p>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-3 bg-white/70 rounded-xl px-4 py-3 border border-indigo-100">
          <span className="text-xl shrink-0">💡</span>
          <p className="text-xs text-slate-600 font-medium">
            Los comercios en CivicTrust atraen en promedio <strong>15 ciudadanos nuevos por semana</strong>.
            Genera tu QR de descuento y refuerza la confianza barrial.
          </p>
        </div>
      </div>

      {/* Costo Infraestructura BaaS · desglose visual */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/40 rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300 mb-1">🛰 Costo de Infraestructura BaaS</p>
              <h3 className="text-lg font-black text-white">Tu 6% se transforma en infraestructura cívica de clase mundial</h3>
              <p className="text-xs text-slate-300 font-medium mt-1 max-w-2xl">
                Cada peso retenido financia los servicios que mantienen seguros tus pagos: procesamiento Stripe, base de datos Firebase, encriptación E2E y validación ciudadana en tiempo real.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-black shrink-0 flex-wrap">
              <span className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white">100%</span>
              <span className="text-slate-400">−</span>
              <span className="bg-red-500/20 border border-red-400/40 rounded-lg px-3 py-1.5 text-red-300">6% BaaS</span>
              <span className="text-slate-400">=</span>
              <span className="bg-emerald-500/20 border border-emerald-400/40 rounded-lg px-3 py-1.5 text-emerald-300">94% Neto</span>
            </div>
          </div>

          {/* Desglose del 6% */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {[
              { icon: '💳', label: 'Procesador Stripe', pct: '2.4%' },
              { icon: '🔥', label: 'Firebase + Cloud', pct: '1.6%' },
              { icon: '🛡', label: 'Trust & Safety', pct: '1.2%' },
              { icon: '🏛', label: 'Gobernanza cívica', pct: '0.8%' },
            ].map(item => (
              <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-[11px] font-black text-emerald-300">{item.pct}</span>
                </div>
                <p className="text-[11px] font-bold text-slate-200 leading-tight">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment feed */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-black text-slate-800 text-lg">📡 Feed de Pagos Entrantes</h3>
            {isSimulating && (
              <span className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-emerald-700 text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> En vivo
              </span>
            )}
          </div>
          <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors">
            📥 Exportar CSV
          </button>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: '380px' }}>
          <table className="w-full text-left">
            <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
              <tr>
                {['Ciudadano', 'Concepto', 'Monto', 'BaaS 6%', 'Neto'].map((col, i) => (
                  <th key={col} className={`px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ${i >= 2 ? 'text-right' : ''} ${i === 4 ? 'text-emerald-600' : ''}`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                    <span className="text-5xl block mb-3">📡</span>
                    <p className="font-bold text-sm text-slate-300">Activa el simulador para ver pagos entrantes</p>
                    <p className="text-xs text-slate-300 mt-1">Los pagos ciudadanos vía CivicTrust App aparecerán aquí en vivo</p>
                  </td>
                </tr>
              )}
              {payments.map((trx, idx) => <PaymentRow key={idx} trx={trx} />)}
            </tbody>
          </table>
        </div>

        {payments.length > 0 && (
          <div className="px-8 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-400">
            <span>{payments.length} pagos recibidos</span>
            <span className="text-emerald-600">Neto total: ${stats.net.toFixed(2)} MXN</span>
          </div>
        )}
      </div>
    </section>
  );
}
