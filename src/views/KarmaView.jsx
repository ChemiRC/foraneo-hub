import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { fetchAllPOIs, voteKarma } from '../services/mockApi';

export default function KarmaView() {
  const { showToast } = useAppContext();
  const [pois, setPois] = useState([]);
  const [votingId, setVotingId] = useState(null);

  useEffect(() => {
    fetchAllPOIs().then(setPois);
  }, []);

  const handleVote = async (poiId, val) => {
    setVotingId(poiId);
    try {
      const result = await voteKarma(poiId, val);
      setPois(pois.map(p => p.id === poiId ? { ...p, karma: result.newKarma } : p));
      showToast('Voto registrado en el algoritmo global', val > 0 ? 'success' : 'info');
    } finally {
      setVotingId(null);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-10">
      <header className="mb-12 text-center">
        <div className="inline-block rounded-3xl bg-yellow-400/10 p-4 mb-4">
          <span className="text-4xl">⭐</span>
        </div>
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">Algoritmo de Karma</h2>
        <p className="mt-3 text-slate-500 font-medium max-w-lg mx-auto">
          Tú eres el SQA. Valida la veracidad de los locales para ayudar a otros estudiantes foráneos.
        </p>
      </header>

      <div className="grid gap-6">
        {pois.map(poi => (
          <div key={poi.id} className="group overflow-hidden rounded-[32px] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 p-8 transition-all hover:-translate-y-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-black text-slate-800">{poi.name}</h3>
                  <span className={`rounded-xl px-3 py-1 text-[10px] font-black uppercase ${poi.karma >= 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                    Score: {poi.karma}
                  </span>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed italic border-l-4 border-indigo-500 pl-4 py-1">
                  "{poi.description}"
                </p>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={() => handleVote(poi.id, 5)} disabled={votingId === poi.id}
                  className="flex-1 md:flex-none rounded-2xl bg-emerald-50 p-4 text-sm font-black text-emerald-700 transition-all hover:bg-emerald-600 hover:text-white flex items-center justify-center gap-2"
                >
                  <span className="text-lg">👍</span> Validar
                </button>
                <button 
                  onClick={() => handleVote(poi.id, -5)} disabled={votingId === poi.id}
                  className="flex-1 md:flex-none rounded-2xl bg-red-50 p-4 text-sm font-black text-red-600 transition-all hover:bg-red-600 hover:text-white flex items-center justify-center gap-2"
                >
                  <span className="text-lg">👎</span> Reportar
                </button>
              </div>
            </div>
            
            {/* Barra de progreso de veracidad */}
            <div className="mt-8">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
                <span>Nivel de Veracidad comunitaria</span>
                <span>{poi.karma}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${poi.karma >= 80 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                  style={{ width: `${poi.karma}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}