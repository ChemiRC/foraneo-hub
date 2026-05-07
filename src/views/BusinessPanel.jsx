import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { mockApi } from '../services/mockApi';

// Deterministic QR-like grid (7×7 = 49 cells)
const QR_GRID = Array.from({ length: 49 }, (_, i) =>
  ((i * 13 + (i % 7) * 5 + Math.floor(i / 7) * 3) % 10) > 4
);

const INCOMING = [
  { student: 'Ana G.',    origin: 'Zacatecas',           desc: '☕ Café Americano',    amount: 45 },
  { student: 'Rodrigo M.',origin: 'Durango',              desc: '🍔 Combo Lunch',       amount: 95 },
  { student: 'Sofía R.',  origin: 'Aguascalientes',       desc: '💊 Paracetamol 10 pz', amount: 32 },
  { student: 'Carlos V.', origin: 'Nayarit',              desc: '🥗 Menú del día',      amount: 65 },
  { student: 'Paola H.',  origin: 'Colima',               desc: '☕ Americano XL',      amount: 38 },
  { student: 'Luis T.',   origin: 'Jalisco (foráneo)',    desc: '🍔 Hamburguesa doble', amount: 85 },
  { student: 'Mariana C.',origin: 'San Luis Potosí',      desc: '🧃 Jugo + sandwich',   amount: 55 },
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
  return (
    <tr className="border-b border-slate-50 hover:bg-indigo-50/30 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-black text-indigo-700 shrink-0">
            {(trx.student ?? 'E').charAt(0)}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700 leading-tight">{trx.student ?? 'Estudiante Foráneo'}</p>
            <p className="font-mono text-[10px] text-slate-400">{trx.id}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm font-semibold text-slate-600">{trx.desc}</td>
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
            📱 El estudiante escanea este código al pagar con la app y recibe el descuento automáticamente.
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
      const trx = await mockApi.processCommission(sample.amount, sample.desc);
      setPayments(prev => [{ ...trx, student: sample.student, origin: sample.origin }, ...prev]);
      showToastRef.current(`💳 Pago de ${sample.student}: $${sample.amount}`, 'success');
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

      {/* Header */}
      <header className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">💳 Validación de Pagos y Beneficios</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            <p className="text-slate-400 text-sm font-semibold">
              {isSimulating ? 'Recibiendo pagos vía App en tiempo real' : 'Feed pausado · activa el simulador'}
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
        <MetricCard label="📊 Cobros Recibidos" value={`$${stats.total.toFixed(2)}`} sub={`${stats.count} pagos vía App`} />
        <MetricCard label="📉 Comisión Plataforma" value={`−$${stats.fee.toFixed(2)}`} sub="6% tarifa Foráneo Hub" />
        <MetricCard label="💚 Ingreso Neto (T+1)" value={`$${stats.net.toFixed(2)}`} sub="A liquidar mañana" accent />
      </div>

      {/* Attraction Metrics */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6">
        <h3 className="font-black text-slate-800 text-base mb-4">📈 Métricas de Atracción · Esta Semana</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm text-center">
            <p className="text-3xl font-black text-indigo-600">{attraction.newStudents}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Nuevos estudiantes</p>
            <p className="text-[11px] text-indigo-400 font-medium mt-0.5">atraídos por Foráneo Hub 🎓</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm text-center">
            <p className="text-3xl font-black text-purple-600">{attraction.mapVisits}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Visitas desde el mapa</p>
            <p className="text-[11px] text-purple-400 font-medium mt-0.5">tu local fue descubierto 🗺</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm text-center">
            <p className="text-3xl font-black text-emerald-600">{attraction.qrUsed}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Códigos QR usados</p>
            <p className="text-[11px] text-emerald-400 font-medium mt-0.5">descuento 15% activado 🎁</p>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-3 bg-white/70 rounded-xl px-4 py-3 border border-indigo-100">
          <span className="text-xl shrink-0">💡</span>
          <p className="text-xs text-slate-600 font-medium">
            Los negocios en Foráneo Hub atraen en promedio <strong>15 estudiantes foráneos nuevos por semana</strong>.
            Ofrece el descuento QR para incrementar la retención y fidelidad.
          </p>
        </div>
      </div>

      {/* Commission model */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200 rounded-2xl px-6 py-4 flex items-center gap-6 flex-wrap">
        <span className="text-2xl">ℹ️</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800">💡 Cómo funciona el modelo de comisión</p>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Por cada pago recibido vía app, Foráneo Hub retiene <strong>6%</strong>. El <strong>94% restante</strong> se deposita en ciclo T+1 (siguiente día hábil).
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-black shrink-0 flex-wrap">
          <span className="bg-white border border-slate-300 rounded-lg px-3 py-1 text-slate-700">100%</span>
          <span className="text-slate-400">−</span>
          <span className="bg-red-100 border border-red-300 rounded-lg px-3 py-1 text-red-600">6%</span>
          <span className="text-slate-400">=</span>
          <span className="bg-emerald-100 border border-emerald-300 rounded-lg px-3 py-1 text-emerald-700">94%</span>
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
                {['Estudiante', 'Concepto', 'Monto', 'Fee 6%', 'Neto'].map((col, i) => (
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
                    <p className="text-xs text-slate-300 mt-1">Los pagos de estudiantes aparecerán aquí en tiempo real</p>
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
