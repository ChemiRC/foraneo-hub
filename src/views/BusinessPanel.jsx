import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { mockApi } from '../services/mockApi';
import Skeleton from '../components/ui/Skeleton';

export default function BusinessPanel() {
  const { showToast } = useAppContext();
  const [ticketAmount, setTicketAmount] = useState('');
  const [ticketDesc, setTicketDesc] = useState('Venta mostrador');
  const [transactions, setTransactions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Resumen del día
  const [dailyStats, setDailyStats] = useState({ total: 0, net: 0, fee: 0 });

  useEffect(() => {
    const total = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    const fee = transactions.reduce((acc, curr) => acc + curr.commission, 0);
    setDailyStats({ total, fee, net: total - fee });
  }, [transactions]);

  const handleCharge = async () => {
    const amount = parseFloat(ticketAmount);
    if (isNaN(amount) || amount <= 0) return showToast('Por favor ingresa un monto válido', 'error');

    setIsProcessing(true);
    try {
      const trx = await mockApi.processCommission(amount, ticketDesc);
      setTransactions([trx, ...transactions]);
      setTicketAmount('');
      setTicketDesc('Venta mostrador');
      showToast('Cobro procesado exitosamente', 'success');
    } catch (e) {
      showToast('Error al procesar el pago', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const setQuickSale = (amount, desc) => {
    setTicketAmount(amount.toString());
    setTicketDesc(desc);
  };

  return (
    <section className="animate-fade-in h-full flex flex-col">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Terminal Punto de Venta</h2>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Modelo de Comisión 6%</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-right">
            <p className="text-[10px] uppercase font-bold text-slate-400">Ventas (Bruto)</p>
            <p className="font-black text-slate-700">${dailyStats.total.toFixed(2)}</p>
          </div>
          <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 text-right">
            <p className="text-[10px] uppercase font-bold text-emerald-600">Tu Ganancia Neta</p>
            <p className="font-black text-emerald-700">${dailyStats.net.toFixed(2)}</p>
          </div>
        </div>
      </header>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CALCULADORA / POS */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-black text-slate-800 mb-4">Nueva Venta</h3>
          
          <div className="grid grid-cols-2 gap-2 mb-6">
            <button onClick={() => setQuickSale(85, 'Comida Corrida')} className="bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 p-2 rounded-xl text-xs font-bold transition-colors">Comida Corrida ($85)</button>
            <button onClick={() => setQuickSale(120, 'Desayuno Completo')} className="bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 p-2 rounded-xl text-xs font-bold transition-colors">Desayuno ($120)</button>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Concepto</label>
              <input type="text" value={ticketDesc} onChange={(e) => setTicketDesc(e.target.value)} disabled={isProcessing} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Monto a cobrar (MXN)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg">$</span>
                <input type="number" value={ticketAmount} onChange={(e) => setTicketAmount(e.target.value)} disabled={isProcessing} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl pl-10 pr-4 py-3 text-xl font-black text-slate-800 outline-none focus:border-indigo-500 transition-all" placeholder="0.00" />
              </div>
            </div>
          </div>
          
          {/* RECIBO EDUCATIVO */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-bl-full"></div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-white/10 pb-2 mb-3">Desglose Transparente</h4>
            <div className="flex justify-between text-sm mb-2"><span className="text-slate-300">Cobro al cliente:</span><span className="font-bold">${ticketAmount || '0.00'}</span></div>
            <div className="flex justify-between text-sm mb-4"><span className="text-slate-400">Comisión Plataforma (6%):</span><span className="font-bold text-red-400">-${ticketAmount ? (ticketAmount * 0.06).toFixed(2) : '0.00'}</span></div>
            <div className="flex justify-between text-lg border-t border-white/20 pt-3"><span className="font-black text-emerald-400">Recibes:</span><span className="font-black text-emerald-400">${ticketAmount ? (ticketAmount * 0.94).toFixed(2) : '0.00'}</span></div>
          </div>

          <button onClick={handleCharge} disabled={isProcessing || !ticketAmount} className="mt-auto w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex justify-center items-center gap-2">
            {isProcessing ? <Skeleton className="h-6 w-6 rounded-full bg-white/30" /> : '✅'} {isProcessing ? 'Procesando en Stripe...' : 'Confirmar Cobro'}
          </button>
        </div>

        {/* HISTORIAL */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-black text-slate-800">Transacciones Recientes</h3>
            <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-lg border border-slate-200">Hoy</span>
          </div>
          
          <div className="overflow-y-auto flex-1 p-0">
            <table className="w-full text-left">
              <thead className="bg-white sticky top-0 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hora / Ref</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Concepto</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bruto</th>
                  <th className="px-6 py-4 text-[10px] font-black text-emerald-600 uppercase tracking-widest">Neto (Para ti)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isProcessing && <tr><td colSpan="4" className="px-6 py-4"><Skeleton className="h-10 w-full" /></td></tr>}
                {transactions.length === 0 && !isProcessing && <tr><td colSpan="4" className="px-6 py-16 text-center text-slate-400 font-bold">Inicia tu primera venta en el panel izquierdo.</td></tr>}
                
                {transactions.map((trx, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-slate-800 font-bold text-sm">{trx.date}</p>
                      <p className="text-slate-400 font-bold text-[10px]">{trx.id}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-600 text-sm">{trx.desc}</td>
                    <td className="px-6 py-4 font-black text-slate-400 text-sm">${trx.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 font-black text-emerald-600 text-md">${trx.net.toFixed(2)}</td>
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