import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import L from 'leaflet';

// Corregir iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function MapView() {
  const { showToast } = useAppContext();
  const center = [20.7236, -103.3848]; // Coordenadas de Zapopan 

  useEffect(() => {
    showToast('📍 Geolocalización segregada activa: Zona Zapopan', 'info');
  }, []);

  return (
    <section className="animate-fade-in flex flex-col h-full">
      <header className="mb-6">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Mapeo Colaborativo</h2>
        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          Datos en tiempo real (BaaS)
        </p>
      </header>
      
      <div className="flex-1 min-h-[500px] shadow-2xl rounded-3xl overflow-hidden border-4 border-white">
        <MapContainer center={center} zoom={15} scrollWheelZoom={false}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <Marker position={[20.725, -103.386]}>
            <Popup>
              <div className="font-sans">
                <p className="font-bold text-indigo-600">Pensión "Estudiante Feliz"</p>
                <p className="text-xs text-slate-500">Karma: +245 ⭐</p>
              </div>
            </Popup>
          </Marker>
          <Marker position={[20.722, -103.383]}>
            <Popup>
               <p className="font-bold text-orange-500">Fonda Las Cazuelas</p>
               <p className="text-xs text-slate-500">Validado por la comunidad</p>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  );
}