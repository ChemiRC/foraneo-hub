import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { createTransaction, getBusinessStats } from '../services/mockApi';
import Skeleton from '../components/ui/Skeleton';

export default function BusinessPanel() {
  const { showToast, user } = useAppContext();
  const [subtotal, setSubtotal] = useState('');
  const [desc, setDesc] = useState('');
  const [stats, setStats] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    getBusinessStats(user.id).then(setStats);
  }, [user.id, isProcessing]);

  const handleCharge = async () => {
    const amount = parseFloat(subtotal);
    if (!amount || amount <= 0) return showToast('Monto inválido', 'error');
    
    setIsProcessing(true);
    try {
      await createTransaction(user.id, { subtotal: amount, description: desc || 'Venta Mostrador' });
      showToast('Transacción procesada y comisión aplicada', 'success');
      setSubtotal('');
      setDesc('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-fade-in h-full flex flex-col">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Panel Financiero</h2>
          <p className="mt-1 text-slate-500 font-medium tracking-tight">Modelo de negocio basado en comisión transaccional.</p>
        </div>
        <div className="flex gap-4">
          <div className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm text-right">
            <p className="text-[10px] font-black uppercase text-slate-400">Total Bruto</p>
            <p className="text-xl font-black text-slate-800">${stats?.totalRevenue.toFixed(2) || '0.00'}</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 shadow-sm text-right">
            <p className="text-[10px] font-black uppercase text-emerald-600">Ingreso Neto</p>
            <p className="text-xl font-black text-emerald-700">${stats?.totalNet.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Terminal Punto de Venta */}
        <div className="lg:col-span-1 rounded-[40px] bg-slate-900 p-10 text-white shadow-2xl">
          <h3 className="mb-8 text-xl font-black">Terminal POS</h3>
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">Descripción</label>
              <input 
                type="text" value={desc} onChange={e => setDesc(e.target.value)}
                placeholder="Ej. Comida Corrida"
                className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 font-bold text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">Monto Subtotal</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-500">$</span>
                <input 
                  type="number" value={subtotal} onChange={e => setSubtotal(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-2xl bg-white/10 p-5 pl-10 text-3xl font-black text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Recibo Transparente */}
            <div className="rounded-3xl bg-white/5 p-6 border border-white/5">
              <div className="flex justify-between text-sm mb-2 text-slate-300">
                <span>Comisión Hub (6%)</span>
                <span className="font-bold text-red-400">-${(subtotal * 0.06).toFixed(2)}</span>
              </div>
              <div className="h-px bg-white/10 my-4" />
              <div className="flex justify-between text-lg font-black text-emerald-400">
                <span>Tu Ganancia</span>
                <span>${(subtotal * 0.94).toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleCharge} disabled={isProcessing || !subtotal}
              className="w-full rounded-2xl bg-indigo-600 py-5 font-black uppercase tracking-widest shadow-xl shadow-indigo-900/40 transition-all hover:bg-indigo-500 disabled:opacity-50"
            >
              {isProcessing ? 'Procesando...' : 'Confirmar Cobro'}
            </button>
          </div>
        </div>

        {/* Historial de Transacciones */}
        <div className="lg:col-span-2 rounded-[40px] bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Auditoría de Pagos</h3>
            <span className="text-[10px] font-bold text-slate-400 italic">Datos encriptados vía BaaS</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="px-8 py-5">Referencia</th>
                  <th className="px-8 py-5 text-right">Bruto</th>
                  <th className="px-8 py-5 text-right">Mantenimiento (6%)</th>
                  <th className="px-8 py-5 text-right text-emerald-600">Neto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stats?.transactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-slate-700">{t.description}</p>
                      <p className="text-[10px] font-mono text-slate-400 uppercase">{t.id}</p>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-slate-400">${t.subtotal.toFixed(2)}</td>
                    <td className="px-8 py-5 text-right font-black text-red-400">-${t.commission.toFixed(2)}</td>
                    <td className="px-8 py-5 text-right"><span className="rounded-xl bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">${t.net.toFixed(2)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}