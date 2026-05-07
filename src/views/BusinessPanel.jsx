import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { mockApi } from '../services/mockApi';

export default function BusinessPanel() {
  const { showToast } = useAppContext();
  const [ticketAmount, setTicketAmount] = useState('');
  const [ticketDesc, setTicketDesc] = useState('Venta mostrador');
  const [transactions, setTransactions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [dailyStats, setDailyStats] = useState({ total: 0, net: 0, fee: 0, count: 0 });

  useEffect(() => {
    const total = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    const fee = transactions.reduce((acc, curr) => acc + curr.commission, 0);
    setDailyStats({ total, fee, net: total - fee, count: transactions.length });
  }, [transactions]);

  const handleCharge = async () => {
    const amount = parseFloat(ticketAmount);
    if (isNaN(amount) || amount <= 0) return showToast('Error: Monto inválido', 'error');

    setIsProcessing(true);
    try {
      const trx = await mockApi.processCommission(amount, ticketDesc);
      setTransactions([trx, ...transactions]);
      setTicketAmount('');
      setTicketDesc('Venta mostrador');
      showToast('Pago capturado exitosamente', 'success');
    } catch (e) {
      showToast('Fallo en el gateway de pago', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const setQuickSale = (amount, desc) => {
    setTicketAmount(amount.toString());
    setTicketDesc(desc);
  };

  return (
    <section className="animate-fade-in flex flex-col h-full">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Finanzas Locales</h2>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Modelo Transaccional Activo (6%)
          </p>
        </div>
      </header>

      {/* MÉTRICAS FINANCIERAS (DASHBOARD) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 rounded-full mix-blend-multiply"></div>
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Venta Bruta</p>
          <p className="text-3xl font-black text-slate-800">${dailyStats.total.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-50 rounded-full mix-blend-multiply"></div>
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Comisión Retenida (6%)</p>
          <p className="text-3xl font-black text-red-500">-${dailyStats.fee.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-[2rem] shadow-lg shadow-emerald-500/20 text-white relative overflow-hidden md:col-span-2 flex items-center justify-between">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <p className="text-[11px] font-black uppercase tracking-widest text-emerald-100 mb-2">Ingreso Neto a Transferir</p>
            <p className="text-4xl font-black">${dailyStats.net.toFixed(2)} <span className="text-lg font-medium text-emerald-200">MXN</span></p>
          </div>
          <div className="relative z-10 text-right hidden sm:block">
            <p className="text-4xl font-black">{dailyStats.count}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">Txns de hoy</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 flex-1">
        {/* TERMINAL POS MODERNA */}
        <div className="xl:col-span-1 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-8 bg-slate-900 text-white">
            <h3 className="font-black text-xl flex items-center gap-2 mb-6"><span>💳</span> Terminal Virtual</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Concepto de Venta</label>
                <input type="text" value={ticketDesc} onChange={(e) => setTicketDesc(e.target.value)} disabled={isProcessing} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 font-bold text-white outline-none focus:border-indigo-400 focus:bg-white/20 transition-all placeholder-slate-500" placeholder="Ej. Paquete Foráneo" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Importe (MXN)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-2xl">$</span>
                  <input type="number" value={ticketAmount} onChange={(e) => setTicketAmount(e.target.value)} disabled={isProcessing} className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-4xl font-black text-white outline-none focus:border-emerald-400 focus:bg-white/20 transition-all placeholder-slate-600" placeholder="0.00" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 flex-1 flex flex-col bg-slate-50">
            <div className="grid grid-cols-2 gap-3 mb-8">
              <button onClick={() => setQuickSale(85, 'Menú Económico')} className="bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 py-3 rounded-xl text-xs font-bold transition-all shadow-sm">🍔 Menú ($85)</button>
              <button onClick={() => setQuickSale(120, 'Lavandería Completa')} className="bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 py-3 rounded-xl text-xs font-bold transition-all shadow-sm">🧺 Lavado ($120)</button>
            </div>

            {/* Recibo Transparente */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 mb-3">Detalle de Operación</h4>
              <div className="flex justify-between text-sm mb-2 text-slate-600 font-medium"><span>Monto Cobrado</span><span className="font-bold text-slate-800">${ticketAmount || '0.00'}</span></div>
              <div className="flex justify-between text-sm mb-3 text-slate-600 font-medium"><span>Tarifa Foráneo Hub</span><span className="font-bold text-red-500">-${ticketAmount ? (ticketAmount * 0.06).toFixed(2) : '0.00'}</span></div>
              <div className="border-t border-slate-100 pt-3 flex justify-between items-center"><span className="font-black text-emerald-600 text-sm">Ingreso Neto</span><span className="font-black text-emerald-600 text-2xl">${ticketAmount ? (ticketAmount * 0.94).toFixed(2) : '0.00'}</span></div>
            </div>

            <button onClick={handleCharge} disabled={isProcessing || !ticketAmount} className="mt-auto w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50 flex justify-center items-center gap-3">
              {isProcessing ? <span className="animate-spin text-xl">⚙️</span> : <span className="text-xl">💳</span>} 
              {isProcessing ? 'Procesando en Servidor...' : 'Procesar Pago'}
            </button>
          </div>
        </div>

        {/* HISTORIAL TIPO STRIPE */}
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
            <h3 className="font-black text-slate-800 text-xl">Actividad de la Cuenta</h3>
            <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors">Exportar CSV</button>
          </div>
          
          <div className="overflow-y-auto flex-1 p-0 bg-slate-50/50">
            <table className="w-full text-left">
              <thead className="bg-white sticky top-0 shadow-sm border-b border-slate-200 z-10">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Referencia / Hora</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Volumen</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Fee (6%)</th>
                  <th className="px-8 py-5 text-[10px] font-black text-emerald-600 uppercase tracking-widest text-right">Neto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isProcessing && <tr><td colSpan="5" className="px-8 py-6"><div className="h-12 bg-slate-200 animate-pulse rounded-xl w-full"></div></td></tr>}
                {transactions.length === 0 && !isProcessing && (
                  <tr><td colSpan="5" className="px-8 py-24 text-center text-slate-400"><span className="text-4xl mb-4 block">🧾</span><p className="font-bold text-sm">El libro mayor está vacío.</p></td></tr>
                )}
                {transactions.map((trx, idx) => (
                  <tr key={idx} className="bg-white hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <p className="text-slate-500 font-mono text-[10px] mb-1">{trx.id}</p>
                      <p className="text-slate-800 font-bold text-xs">{trx.date}</p>
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-600 text-sm">{trx.desc}</td>
                    <td className="px-8 py-5 text-right font-black text-slate-400 text-sm">${trx.amount.toFixed(2)}</td>
                    <td className="px-8 py-5 text-right font-black text-red-400 text-sm">-${trx.commission.toFixed(2)}</td>
                    <td className="px-8 py-5 text-right"><span className="bg-emerald-100 text-emerald-700 font-black px-3 py-1 rounded-lg text-sm">${trx.net.toFixed(2)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}