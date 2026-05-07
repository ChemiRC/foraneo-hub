import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { mockApi } from '../services/mockApi';
import Skeleton from '../components/ui/Skeleton';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function MapView() {
  const { showToast } = useAppContext();
  const [pois, setPois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const [activePoi, setActivePoi] = useState(null);

  const center = [20.7236, -103.3848]; // CUCEA / Zapopan

  useEffect(() => {
    mockApi.fetchMapData('Zapopan').then(data => {
      setPois(data);
      setLoading(false);
      setTimeout(() => showToast('🔔 Geovalla: Tienes 2 locales con ofertas cerca de ti', 'info'), 2000);
    });
  }, []);

  const filteredPois = filter === 'Todos' ? pois : pois.filter(p => p.type === filter);

  return (
    <section className="animate-fade-in flex flex-col h-full">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Explorar Zona Segregada</h2>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Zapopan Centro</p>
        </div>
        <div className="flex gap-2">
          {['Todos', 'Vivienda', 'Comida', 'Servicios'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}`}>
              {f}
            </button>
          ))}
        </div>
      </header>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PANEL LATERAL DE LUGARES */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-y-auto p-4 flex flex-col gap-4">
          <h3 className="font-black text-slate-800 px-2">Lugares Validados ({filteredPois.length})</h3>
          {loading ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)
          ) : (
            filteredPois.map(poi => (
              <div key={poi.id} onClick={() => setActivePoi(poi)} className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${activePoi?.id === poi.id ? 'border-indigo-500 bg-indigo-50' : 'border-transparent bg-slate-50 hover:bg-slate-100'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-white text-slate-500">{poi.type}</span>
                  <span className={`text-xs font-black px-2 py-1 rounded-md ${poi.karma > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {poi.karma > 0 ? '⭐' : '⚠️'} {poi.karma} Karma
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-lg leading-tight">{poi.name}</h4>
                <p className="text-indigo-600 font-black text-sm mt-1">{poi.price}</p>
                <p className="text-slate-500 text-xs mt-2 line-clamp-2">{poi.desc}</p>
              </div>
            ))
          )}
        </div>

        {/* MAPA INTERACTIVO */}
        <div className="lg:col-span-2 min-h-[400px] shadow-sm rounded-3xl overflow-hidden border border-slate-200 relative z-0">
          <MapContainer center={center} zoom={15} scrollWheelZoom={true} className="h-full w-full">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution="&copy; OpenStreetMap &copy; CARTO" />
            
            {filteredPois.map(poi => (
              <Marker key={poi.id} position={[poi.lat, poi.lng]} eventHandlers={{ click: () => setActivePoi(poi) }}>
                <Popup className="rounded-xl">
                  <div className="font-sans text-center">
                    <p className="font-black text-slate-800">{poi.name}</p>
                    <p className="text-indigo-600 font-bold">{poi.price}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}