import { useState } from 'react';

export default function App() {
  const [role, setRole] = useState(null);
  const [currentView, setCurrentView] = useState('mapa');

  const [ticket, setTicket] = useState('');
  const [transactions, setTransactions] = useState([]);

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    setCurrentView(selectedRole === 'comercio' ? 'negocios' : 'mapa');
  };

  const handleLogout = () => {
    setRole(null);
    setCurrentView('mapa');
  };

  const calculateCommission = () => {
    const amount = parseFloat(ticket);
    if (isNaN(amount) || amount <= 0) return alert('Ingresa un monto válido');
    
    const comision = amount * 0.06;
    setTransactions([{ id: Math.floor(Math.random() * 1000), amount, comision }, ...transactions]);
    setTicket('');
  };

  if (!role) {
    return (
      <div className="flex h-screen items-center justify-center bg-indigo-900">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-96 text-center">
          <h1 className="text-3xl font-black text-indigo-900 mb-2">Foráneo Hub</h1>
          <p className="text-gray-500 mb-6 text-sm">Plataforma de Mapeo Colaborativo</p>
          <button onClick={() => handleLogin('foraneo')} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg mb-3 hover:bg-indigo-700 transition">Entrar como Foráneo</button>
          <button onClick={() => handleLogin('comercio')} className="w-full bg-emerald-500 text-white font-bold py-3 rounded-lg hover:bg-emerald-600 transition">Entrar como Comercio</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      <aside className="w-64 bg-white shadow-lg flex flex-col z-10">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${role === 'comercio' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
            {role === 'comercio' ? 'C' : 'F'}
          </div>
          <div>
            <p className="font-bold text-sm">{role === 'comercio' ? 'Fonda Las Cazuelas' : 'Usuario Foráneo'}</p>
            <p className="text-xs text-slate-500">{role === 'comercio' ? 'Comercio Local' : 'Estudiante'}</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setCurrentView('mapa')} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${currentView === 'mapa' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'}`}>
            📍 Mapa Segregado
          </button>
          <button onClick={() => setCurrentView('karma')} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${currentView === 'karma' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'}`}>
            ⭐ Sistema Karma
          </button>
          {role === 'comercio' && (
            <button onClick={() => setCurrentView('negocios')} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${currentView === 'negocios' ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-50 text-slate-600'}`}>
              🏪 Panel Ventas (6%)
            </button>
          )}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full text-red-500 text-sm font-bold flex items-center justify-center gap-2">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {currentView === 'mapa' && (
          <section className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Explorar Zona: Viewport Restringido</h2>
            <div className="w-full h-[500px] bg-slate-200 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300 relative overflow-hidden">
                <span className="text-slate-400 font-medium">[Simulación de Mapa SDK con carga optimizada]</span>
                <div className="absolute top-1/3 left-1/4 group cursor-pointer" onClick={() => alert('Pensión verificada. +85 Karma')}>
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg relative z-10 hover:scale-110 transition">🛏️</div>
                    <div className="absolute w-8 h-8 bg-indigo-400 rounded-full animate-ping top-0 left-0"></div>
                </div>
            </div>
          </section>
        )}

        {currentView === 'karma' && (
          <section className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Validación Comunitaria</h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-lg">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-lg">Cuarto en La Cima</h3>
                        <p className="text-xs text-slate-500">Imágenes comprimidas para ahorro de storage</p>
                    </div>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Karma: +245</span>
                </div>
                <p className="text-slate-600 text-sm mb-4">"El lugar es idéntico a las fotos y el internet es rápido."</p>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-100 hover:bg-green-100 text-slate-600 hover:text-green-600 rounded text-sm transition font-medium">👍 Validar</button>
                    <button className="px-4 py-2 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded text-sm transition font-medium">👎 Reportar</button>
                </div>
            </div>
          </section>
        )}

        {currentView === 'negocios' && (
          <section className="animate-fade-in">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Panel de Ingresos Locales</h2>
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded text-sm font-bold">Modelo Transaccional (6%)</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold mb-4 text-slate-700">Registrar Venta</h3>
                    <input type="number" value={ticket} onChange={(e) => setTicket(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 mb-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="Monto (MXN)" />
                    <button onClick={calculateCommission} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-lg transition shadow-sm">Simular Cobro</button>
                </div>
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">ID Transacción</th>
                                <th className="px-6 py-4">Ticket</th>
                                <th className="px-6 py-4">Comisión (6%)</th>
                                <th className="px-6 py-4">Neto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {transactions.map((trx, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-slate-500 font-medium">#TRX-{trx.id}</td>
                                    <td className="px-6 py-4 font-bold text-slate-800">${trx.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-red-500 font-bold">-${trx.comision.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-emerald-600 font-bold">${(trx.amount - trx.comision).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}