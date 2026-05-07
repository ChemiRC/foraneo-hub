import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { mockApi } from '../services/mockApi';

export default function KarmaView() {
  const { showToast } = useAppContext();
  const [karmaScore, setKarmaScore] = useState(245);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (val) => {
    setIsVoting(true);
    const result = await mockApi.voteKarma(1, val);
    setKarmaScore(result.newKarma);
    setIsVoting(false);
    showToast(val > 0 ? 'Reseña validada exitosamente' : 'Reporte enviado a moderación', val > 0 ? 'success' : 'error');
  };

  return (
    <section className="animate-fade-in max-w-3xl">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Algoritmo Karma</h2>
        <p className="text-slate-500 mt-1 font-medium">Motor de SQA y validación comunitaria.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-black text-2xl text-slate-800">Cuarto en La Cima</h3>
            <p className="text-xs text-indigo-500 font-bold tracking-wide uppercase mt-1">Imágenes comprimidas en caché</p>
          </div>
          <div className={`bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 ${isVoting ? 'animate-pulse' : ''}`}>
            ⭐ Score: +{karmaScore}
          </div>
        </div>
        
        <p className="text-slate-700 text-lg mb-8 italic bg-slate-50 p-6 rounded-2xl border-l-4 border-indigo-500 font-medium">
          "El lugar es idéntico a las fotos, el internet es de fibra óptica y es muy seguro de noche."
        </p>
        
        <div className="flex gap-4">
          <button onClick={() => handleVote(1)} disabled={isVoting} className="flex-1 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 text-slate-700 font-black py-4 rounded-2xl transition-colors disabled:opacity-50">👍 Validar Veracidad</button>
          <button onClick={() => handleVote(-1)} disabled={isVoting} className="flex-1 bg-slate-100 hover:bg-red-100 hover:text-red-700 text-slate-700 font-black py-4 rounded-2xl transition-colors disabled:opacity-50">👎 Reportar Fraude</button>
        </div>
      </div>
    </section>
  );
}