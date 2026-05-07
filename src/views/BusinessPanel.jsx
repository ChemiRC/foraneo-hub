import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { mockApi } from '../services/mockApi';

function MetricCard({ label, value, sub, accent, wide }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 border ${wide ? 'md:col-span-2' : ''} ${accent ? 'bg-gradient-to-br from-emerald-500 to-teal-600 border-transparent text-white shadow-xl shadow-emerald-500/25' : 'bg-white border-slate-100 shadow-sm'}`}>
      <div className={`absolute -right-8 -top-8 w-28 h-28 rounded-full ${accent ? 'bg-white/10' : 'bg-slate-50'} blur-sm`} />
      <div className="relative z-10">
        <p className={`text-[10px] font-black uppercase tracking-[0.15em] mb-2 ${accent ? 'text-emerald-100' : 'text-slate-400'}`}>{label}</p>
        <p className={`text-3xl font-black leading-none ${accent ? 'text-white' : 'text-slate-800'}`}>{value}</p>
        {sub && <p className={`text-xs font-medium mt-1.5 ${accent ? 'text-emerald-200' : 'text-slate-400'}`}>{sub}</p>}
      </div>
    </div>
  );
}

function TxRow({ trx }) {
  return (
    <tr className="border-b border-slate-50 hover:bg-indigo-50/30 transition-colors">
      <td className="px-6 py-4"><p className="font-mono text-[10px] text-slate-400 mb-0.5">{trx.id}</p><p className="text-xs font-bold text-slate-700">{trx.date}</p></td>
      <td className="px-6 py-4 text-sm font-semibold text-slate-600">{trx.desc}</td>
      <td className="px-6 py-4 text-right text-sm font-bold text-slate-400">${trx.amount.toFixed(2)}</td>
      <td className="px-6 py-4 text-right text-sm font-bold text-red-400">−${trx.commission.toFixed(2)}</td>
      <td className="px-6 py-4 text-right"><span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-sm px-3 py-1 rounded-lg">${trx.net.toFixed(2)}</span></td>
    </tr>
  );
}

export default function BusinessPanel() {
  const { showToast } = useAppContext();
  const [ticketAmount, setTicketAmount] = useState('');
  const [ticketDesc, setTicketDesc] = useState('Venta mostrador');
  const [transactions, setTransactions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dailyStats, setDailyStats] = useState({ total: 0, net: 0, fee: 0, count: 0 });
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const total = transactions.reduce((acc, t) => acc + t.amount, 0);
    const fee = transactions.reduce((acc, t) => acc + t.commission, 0);
    setDailyStats({ total, fee, net: total - fee, count: transactions.length });
    if (total > 500) setShowAlert(true);
  }, [transactions]);

  const handleCharge = async () => {
    const amount = parseFloat(ticketAmount);
    if (isNaN(amount) || amount <= 0) return showToast('Error: Monto inválido', 'error');
    setIsProcessing(true);
    try {
      const trx = await mockApi.processCommission(amount, ticketDesc);
      setTransactions(prev => [trx, ...prev]);
      setTicketAmount('');
      setTicketDesc('Venta mostrador');
      showToast('Pago capturado exitosamente', 'success');
    } catch {
      showToast('Fallo en el gateway de pago', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const fee = ticketAmount ? (parseFloat(ticketAmount) * 0.06).toFixed(2) : '0.00';
  const net = ticketAmount ? (parseFloat(ticketAmount) * 0.94).toFixed(2) : '0.00';

  const quickSales = [
    { amount: 65, label: '🍔 Menú básico' },
    { amount: 120, label: '👕 Lavandería' },
    { amount: 350, label: '🏠 Renta semanal' },
    { amount: 85, label: '☕ Café + estudio' },
  ];

  return (
    <section className="pb-10 space-y-8 font-sans">

      {/* Header */}
      <header className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">💰 Finanzas Locales</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-slate-400 text-sm font-semibold">Transacciones en vivo · Liquidación T+1</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gradient-to-br from-slate-900 to-slate-950 text-white px-6 py-3 rounded-2xl shadow-lg shadow-slate-900/30 border border-slate-700/50">
          <span className="text-2xl">💳</span>
          <div>
            <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Modelo de Comisión</p>
            <p className="text-xl font-black leading-tight">6% <span className="text-sm font-medium text-slate-400">por transacción</span></p>
          </div>
        </div>
      </header>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricCard label="📊 Venta Bruta" value={`$${dailyStats.total.toFixed(2)}`} sub={`${dailyStats.count} transacciones`} />
        <MetricCard label="📉 Comisión 6%" value={`−$${dailyStats.fee.toFixed(2)}`} sub="Tarifa de plataforma" />
        <MetricCard label="💚 Ingreso Neto (T+1)" value={`$${dailyStats.net.toFixed(2)}`} sub="Monto a liquidar" accent wide />
      </div>

      {/* Model explanation */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200 rounded-2xl px-6 py-4 flex items-center gap-6 flex-wrap">
        <span className="text-2xl font-bold">ℹ️</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800">💡 Cómo funciona el modelo de comisión</p>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Foráneo Hub retiene <strong>6%</strong> por cada transacción. El <strong>94% restante</strong> se deposita automáticamente en tu cuenta en ciclo T+1 (próximo día hábil).
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

      {/* POS + History */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Terminal */}
        <div className="xl:col-span-1 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-7 bg-gradient-to-br from-slate-900 to-slate-950 text-white border-b border-slate-800">
            <h3 className="font-black text-lg flex items-center gap-2 mb-6"><span>💾</span> Terminal Virtual</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Concepto</label>
                <input type="text" value={ticketDesc} onChange={e => setTicketDesc(e.target.value)} disabled={isProcessing} placeholder="Ej. Paquete Foráneo" className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 font-medium text-white text-sm outline-none focus:border-indigo-400 transition-colors placeholder-slate-600" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Importe (MXN)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-black text-2xl">$</span>
                  <input type="number" value={ticketAmount} onChange={e => setTicketAmount(e.target.value)} disabled={isProcessing} placeholder="0.00" className="w-full bg-white/10 border border-white/15 rounded-xl pl-12 pr-4 py-4 text-4xl font-black text-white outline-none focus:border-emerald-400 transition-colors placeholder-slate-700" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col bg-slate-50">
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              {quickSales.map(q => (
                <button key={q.label} onClick={() => { setTicketAmount(q.amount.toString()); setTicketDesc(q.label); }} className="bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 py-2.5 rounded-xl text-[11px] font-bold transition-all shadow-sm">
                  {q.label} (${q.amount})
                </button>
              ))}
            </div>

            <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 p-5 mb-5 shadow-sm">
              <h4 className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100 pb-2 mb-3">📋 Resumen de Operación</h4>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-600 font-semibold"><span>💵 Monto cobrado</span><span className="font-bold text-slate-800">${ticketAmount || '0.00'}</span></div>
                <div className="flex justify-between text-slate-600 font-semibold"><span>🔴 Comisión (6%)</span><span className="font-bold text-red-500">−${fee}</span></div>
              </div>
              <div className="border-t border-slate-100 mt-3 pt-3 flex justify-between items-center">
                <span className="text-sm font-black text-emerald-700">✓ Ingreso Neto</span>
                <span className="text-2xl font-black text-emerald-600">${net}</span>
              </div>
            </div>

            <button onClick={handleCharge} disabled={isProcessing || !ticketAmount} className="w-full mt-auto bg-gradient-to-r from-slate-900 to-slate-950 hover:from-indigo-600 hover:to-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-slate-900/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 text-sm border border-slate-700/50">
              {isProcessing ? <><span className="animate-spin">⚙️</span> Procesando…</> : <><span>✅</span> Procesar Pago</>}
            </button>
          </div>
        </div>

        {/* Transaction Log */}
        <div className="xl:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-slate-800 text-lg">📜 Historial de Transacciones</h3>
            <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors">📥 Exportar CSV</button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  {['Referencia / Hora', 'Descripción', 'Volumen', 'Fee 6%', 'Neto'].map((col, i) => (
                    <th key={col} className={`px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ${i >= 2 ? 'text-right' : ''} ${i === 4 ? 'text-emerald-600' : ''}`}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isProcessing && <tr><td colSpan={5} className="px-6 py-4"><div className="h-10 bg-slate-100 animate-pulse rounded-xl" /></td></tr>}
                {transactions.length === 0 && !isProcessing && <tr><td colSpan={5} className="px-6 py-20 text-center text-slate-400"><span className="text-4xl block mb-3">◇</span><p className="font-bold text-sm text-slate-300">El libro mayor está vacío</p></td></tr>}
                {transactions.map((trx, idx) => <TxRow key={idx} trx={trx} />)}
              </tbody>
            </table>
          </div>

          {transactions.length > 0 && <div className="px-8 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-400"><span>{transactions.length} transacciones</span><span className="text-emerald-600">Neto total: ${dailyStats.net.toFixed(2)} MXN</span></div>}
        </div>
      </div>
    </section>
  );
}
