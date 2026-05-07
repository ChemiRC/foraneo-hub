import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { mockApi } from '../services/mockApi';
import Skeleton from '../components/ui/Skeleton';

export default function BusinessPanel() {
  const { showToast } = useAppContext();
  const [ticket, setTicket] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCharge = async () => {
    const amount = parseFloat(ticket);
    if (isNaN(amount) || amount <= 0) return showToast('Error: Monto inválido', 'error');

    setIsProcessing(true);
    try {
      const trx = await mockApi.processCommission(amount);
      setTransactions([trx, ...transactions]);
      setTicket('');
      showToast('Pago Stripe procesado - 6% aplicado', 'success');
    } catch (e) {
      showToast('Fallo en la red', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="animate-fade-in h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Finanzas y Pagos</h2>
          <p className="text-slate-500 mt-1 font-bold text-sm uppercase">Cálculo en la nube (Cloud Functions)</p>
        </div>
        <span className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-black flex items-center gap-3 shadow-lg">
          <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span>
          Tarifa: 6%
        </span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-black text-xl mb-6 text-slate-800">Terminal POS</h3>
          <div className="mb-6 relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl">$</span>
            <input type="number" value={ticket} onChange={(e) => setTicket(e.target.value)} disabled={isProcessing} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-2xl font-black text-slate-800 outline-none focus:border-indigo-500 transition-all" placeholder="0.00" />
          </div>
          
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-8 space-y-3">
            <div className="flex justify-between text-sm font-bold text-slate-500"><span>Venta Bruta:</span><span>${ticket || '0.00'}</span></div>
            <div className="flex justify-between text-sm font-bold text-red-500"><span>Comisión (6%):</span><span>-${(ticket * 0.06).toFixed(2) || '0.00'}</span></div>
            <div className="pt-3 border-t border-slate-200 flex justify-between font-black text-emerald-600 text-lg"><span>Neto a recibir:</span><span>${(ticket * 0.94).toFixed(2) || '0.00'}</span></div>
          </div>

          <button onClick={handleCharge} disabled={isProcessing || !ticket} className="mt-auto w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/30 disabled:opacity-50 flex justify-center gap-2">
            {isProcessing ? <span className="animate-spin">🔄</span> : '💳'} {isProcessing ? 'Enrutando pago...' : 'Procesar Cobro'}
          </button>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-slate-50"><h3 className="font-black text-slate-800">Historial de Operaciones</h3></div>
          <div className="overflow-y-auto flex-1 p-0">
            <table className="w-full text-left">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Ref ID</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Monto</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Fee</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isProcessing && <tr><td colSpan="4" className="px-6 py-4"><Skeleton className="h-6 w-full" /></td></tr>}
                {transactions.length === 0 && !isProcessing && <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-bold">Sin transacciones registradas.</td></tr>}
                {transactions.map((trx, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-400 font-bold text-sm">{trx.id}</td>
                    <td className="px-6 py-4 font-black text-slate-700">${trx.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 font-black text-red-500">-${trx.commission.toFixed(2)}</td>
                    <td className="px-6 py-4 font-black text-emerald-600"><span className="bg-emerald-100 px-3 py-1 rounded-lg text-xs">{trx.status}</span></td>
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