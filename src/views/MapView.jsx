import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  fetchAllPOIs,
  fetchZones,
  fetchGeofenceAlerts,
  voteKarma,
} from "../mockApi";

// ── Corrige el ícono por defecto roto de Leaflet con Vite ─────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Íconos personalizados por categoría ───────────────────────
const CATEGORY_COLORS = {
  comida: "#FF6B35",
  renta: "#4ECDC4",
  café: "#A855F7",
  servicio: "#3B82F6",
  farmacia: "#10B981",
};

function createCustomIcon(category, karma) {
  const color = CATEGORY_COLORS[category] || "#6B7280";
  const size = karma >= 80 ? 36 : karma >= 60 ? 30 : 24;
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:${size}px; height:${size}px;
        background:${color};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 12px ${color}66;
        display:flex; align-items:center; justify-content:center;
      ">
        <span style="transform:rotate(45deg); font-size:${size * 0.4}px;">
          ${karma >= 80 ? "✓" : ""}
        </span>
      </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

// ── Componente: centrar mapa al cambiar zona ──────────────────
function FlyToZone({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 15, { duration: 1.2 });
  }, [center, map]);
  return null;
}

// ── Barra de Karma visual ─────────────────────────────────────
function KarmaBar({ score }) {
  const color =
    score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";
  const label =
    score >= 80 ? "Muy confiable" : score >= 60 ? "Aceptable" : "Dudoso";
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "11px",
          marginBottom: "4px",
          color: "#6B7280",
        }}
      >
        <span style={{ fontWeight: 600, color, fontSize: "12px" }}>
          ⚡ Karma {score}/100
        </span>
        <span>{label}</span>
      </div>
      <div
        style={{
          background: "#E5E7EB",
          borderRadius: "99px",
          height: "6px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${color}, ${color}99)`,
            borderRadius: "99px",
            transition: "width 0.6s ease",
          }}
        />
      </div>
    </div>
  );
}

// ── Tarjeta POI en el panel lateral ──────────────────────────
function POICard({ poi, isSelected, onClick }) {
  const color = CATEGORY_COLORS[poi.category] || "#6B7280";
  return (
    <div
      onClick={() => onClick(poi)}
      style={{
        background: isSelected ? "#FAFAFA" : "white",
        border: `2px solid ${isSelected ? color : "#F3F4F6"}`,
        borderRadius: "16px",
        padding: "16px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: isSelected
          ? `0 4px 20px ${color}33`
          : "0 1px 4px rgba(0,0,0,0.06)",
        marginBottom: "12px",
      }}
    >
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "12px",
            overflow: "hidden",
            flexShrink: 0,
            background: "#F3F4F6",
          }}
        >
          {poi.images?.[0] ? (
            <img
              src={poi.images[0]}
              alt={poi.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
            >
              {poi.categoryIcon}
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {poi.name}
            </span>
            {poi.verified && (
              <span
                style={{
                  background: "#DCFCE7",
                  color: "#16A34A",
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: "99px",
                  flexShrink: 0,
                }}
              >
                ✓ Verificado
              </span>
            )}
          </div>
          <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "8px" }}>
            {poi.categoryIcon} {poi.category} · {poi.priceRange}
            {poi.avgPrice && (
              <span> · Desde ${poi.avgPrice}{poi.priceUnit || ""}</span>
            )}
          </div>
          <KarmaBar score={poi.karma} />
        </div>
      </div>

      {poi.tags && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
          {poi.tags.map((tag) => (
            <span
              key={tag}
              style={{
                background: `${color}15`,
                color,
                fontSize: "11px",
                padding: "2px 8px",
                borderRadius: "99px",
                fontWeight: 500,
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Alerta de Geofencing ──────────────────────────────────────
function GeofenceAlert({ alert, onDismiss }) {
  const bgMap = { oferta: "#FFF7ED", alerta: "#FEF2F2", info: "#EFF6FF" };
  const borderMap = { oferta: "#FB923C", alerta: "#F87171", info: "#60A5FA" };
  return (
    <div
      style={{
        background: bgMap[alert.type] || "#F9FAFB",
        border: `1px solid ${borderMap[alert.type] || "#E5E7EB"}`,
        borderRadius: "12px",
        padding: "12px 14px",
        marginBottom: "8px",
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        animation: "slideIn 0.3s ease",
      }}
    >
      <span style={{ fontSize: "20px", lineHeight: 1 }}>{alert.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>
          {alert.title}
        </div>
        <div style={{ fontSize: "12px", color: "#4B5563", marginTop: "2px", lineHeight: 1.4 }}>
          {alert.message}
        </div>
      </div>
      <button
        onClick={() => onDismiss(alert.id)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#9CA3AF",
          padding: "0",
          fontSize: "16px",
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════════════════
export default function MapView() {
  const [pois, setPois] = useState([]);
  const [zones, setZones] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [activeZone, setActiveZone] = useState("cucei");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState(null);
  const [voteResult, setVoteResult] = useState({});
  const mapRef = useRef();

  const ZONE_CENTERS = {
    cucei: [20.6518, -103.3247],
    cucea: [20.7387, -103.4498],
    cucsh: [20.6793, -103.3505],
  };

  useEffect(() => {
    Promise.all([fetchAllPOIs(), fetchZones(), fetchGeofenceAlerts("cucei")]).then(
      ([p, z, a]) => {
        setPois(p);
        setZones(z);
        setAlerts(a);
        setLoading(false);
      }
    );
  }, []);

  const categories = ["all", ...new Set(pois.map((p) => p.category))];
  const filteredPOIs = pois.filter(
    (p) =>
      p.zone === activeZone &&
      (categoryFilter === "all" || p.category === categoryFilter)
  );

  const handleVote = async (poiId, vote) => {
    setVotingId(poiId + vote);
    try {
      const result = await voteKarma(poiId, vote);
      setPois((prev) =>
        prev.map((p) =>
          p.id === poiId
            ? { ...p, karma: result.newKarma, votes: result.votes, downvotes: result.downvotes }
            : p
        )
      );
      setVoteResult((prev) => ({ ...prev, [poiId]: vote }));
    } finally {
      setVotingId(null);
    }
  };

  const dismissAlert = (id) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  const activeZoneData = zones.find((z) => z.id === activeZone);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: "16px",
          background: "#F9FAFB",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "3px solid #E5E7EB",
            borderTop: "3px solid #FF6B35",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ color: "#6B7280", fontSize: "14px" }}>
          Cargando zona universitaria…
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F9FAFB", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .poi-panel::-webkit-scrollbar { width: 4px; }
        .poi-panel::-webkit-scrollbar-track { background: transparent; }
        .poi-panel::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 99px; }
        .vote-btn:hover { transform: scale(1.1); }
        .vote-btn { transition: all 0.15s ease; }
      `}</style>

      {/* ── Panel Lateral ──────────────────────────────────── */}
      <div
        style={{
          width: "380px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          background: "white",
          borderRight: "1px solid #F3F4F6",
          zIndex: 10,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: "1px solid #F3F4F6",
            background: "white",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                background: "linear-gradient(135deg, #FF6B35, #FF8C69)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              📍
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "#111827", letterSpacing: "-0.3px" }}>
                Foráneo Hub
              </div>
              <div style={{ fontSize: "11px", color: "#6B7280" }}>
                Mapa validado por la comunidad
              </div>
            </div>
          </div>

          {/* Selector de Zona */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => setActiveZone(zone.id)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "99px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "12px",
                  background: activeZone === zone.id ? zone.color : "#F3F4F6",
                  color: activeZone === zone.id ? "white" : "#4B5563",
                  transition: "all 0.2s ease",
                  boxShadow: activeZone === zone.id ? `0 2px 8px ${zone.color}55` : "none",
                }}
              >
                {zone.name}
              </button>
            ))}
          </div>
        </div>

        {/* Alertas Geofencing */}
        {alerts.length > 0 && (
          <div style={{ padding: "12px 16px 0", borderBottom: "1px solid #F3F4F6" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>
              📡 Alertas Geofencing
            </div>
            {alerts.map((a) => (
              <GeofenceAlert key={a.id} alert={a} onDismiss={dismissAlert} />
            ))}
          </div>
        )}

        {/* Filtros de categoría */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #F3F4F6", overflowX: "auto" }}>
          <div style={{ display: "flex", gap: "6px", minWidth: "max-content" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "99px",
                  border: `1px solid ${categoryFilter === cat ? "#111827" : "#E5E7EB"}`,
                  background: categoryFilter === cat ? "#111827" : "white",
                  color: categoryFilter === cat ? "white" : "#4B5563",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {cat === "all" ? "Todos" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Info de zona */}
        {activeZoneData && (
          <div
            style={{
              margin: "12px 16px 0",
              padding: "12px",
              background: `${activeZoneData.color}0F`,
              borderRadius: "12px",
              border: `1px solid ${activeZoneData.color}30`,
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: 700, color: activeZoneData.color }}>
              📍 {activeZoneData.fullName}
            </div>
            <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>
              {activeZoneData.studentCount.toLocaleString()} estudiantes · {filteredPOIs.length} lugares validados
            </div>
          </div>
        )}

        {/* Lista de POIs */}
        <div
          className="poi-panel"
          style={{ flex: 1, overflowY: "auto", padding: "12px 16px 16px" }}
        >
          {filteredPOIs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#9CA3AF" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
              <div style={{ fontWeight: 600 }}>Sin resultados</div>
              <div style={{ fontSize: "13px", marginTop: "4px" }}>
                Prueba con otra categoría
              </div>
            </div>
          ) : (
            filteredPOIs
              .sort((a, b) => b.karma - a.karma)
              .map((poi) => (
                <POICard
                  key={poi.id}
                  poi={poi}
                  isSelected={selectedPOI?.id === poi.id}
                  onClick={setSelectedPOI}
                />
              ))
          )}
        </div>

        {/* Footer: Tecnología */}
        <div
          style={{
            padding: "10px 16px",
            borderTop: "1px solid #F3F4F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "11px", color: "#9CA3AF" }}>
            🔒 Mapa segregado por zona · BaaS Firebase
          </span>
          <span style={{ fontSize: "11px", color: "#10B981", fontWeight: 600 }}>
            ● Online
          </span>
        </div>
      </div>

      {/* ── Mapa ──────────────────────────────────────────── */}
      <div style={{ flex: 1, position: "relative" }}>
        <MapContainer
          center={ZONE_CENTERS[activeZone]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FlyToZone center={ZONE_CENTERS[activeZone]} />

          {/* Círculo de zona activa */}
          {activeZoneData && (
            <Circle
              center={activeZoneData.center}
              radius={activeZoneData.radius}
              pathOptions={{
                color: activeZoneData.color,
                fillColor: activeZoneData.color,
                fillOpacity: 0.07,
                weight: 2,
                dashArray: "6, 6",
              }}
            />
          )}

          {/* Marcadores */}
          {filteredPOIs.map((poi) => (
            <Marker
              key={poi.id}
              position={poi.coords}
              icon={createCustomIcon(poi.category, poi.karma)}
              eventHandlers={{ click: () => setSelectedPOI(poi) }}
            >
              <Popup maxWidth={280} className="foraneo-popup">
                <div style={{ fontFamily: "'Inter', sans-serif", padding: "4px" }}>
                  {/* Imagen */}
                  {poi.images?.[0] && (
                    <img
                      src={poi.images[0]}
                      alt={poi.name}
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        marginBottom: "10px",
                      }}
                    />
                  )}

                  {/* Encabezado */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                    <div style={{ fontWeight: 800, fontSize: "15px", color: "#111827" }}>
                      {poi.categoryIcon} {poi.name}
                    </div>
                    {poi.verified && (
                      <span style={{ background: "#DCFCE7", color: "#16A34A", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "99px" }}>
                        ✓ Verificado
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: "12px", color: "#6B7280", lineHeight: 1.5, margin: "0 0 10px" }}>
                    {poi.description}
                  </p>

                  {/* Karma */}
                  <KarmaBar score={poi.karma} />

                  {/* Meta */}
                  <div style={{ display: "flex", gap: "12px", marginTop: "10px", fontSize: "12px", color: "#6B7280" }}>
                    <span>🕐 {poi.hours?.split("·")[0].trim()}</span>
                    <span>💰 {poi.priceRange}</span>
                  </div>

                  {/* Votación Karma */}
                  <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                    <button
                      className="vote-btn"
                      onClick={() => handleVote(poi.id, "up")}
                      disabled={!!votingId || voteResult[poi.id]}
                      style={{
                        flex: 1,
                        padding: "7px",
                        borderRadius: "8px",
                        border: "none",
                        background: voteResult[poi.id] === "up" ? "#DCFCE7" : "#F3F4F6",
                        color: voteResult[poi.id] === "up" ? "#16A34A" : "#374151",
                        fontWeight: 600,
                        fontSize: "12px",
                        cursor: voteResult[poi.id] ? "default" : "pointer",
                      }}
                    >
                      {votingId === poi.id + "up" ? "…" : `👍 ${poi.votes}`}
                    </button>
                    <button
                      className="vote-btn"
                      onClick={() => handleVote(poi.id, "down")}
                      disabled={!!votingId || voteResult[poi.id]}
                      style={{
                        flex: 1,
                        padding: "7px",
                        borderRadius: "8px",
                        border: "none",
                        background: voteResult[poi.id] === "down" ? "#FEE2E2" : "#F3F4F6",
                        color: voteResult[poi.id] === "down" ? "#EF4444" : "#374151",
                        fontWeight: 600,
                        fontSize: "12px",
                        cursor: voteResult[poi.id] ? "default" : "pointer",
                      }}
                    >
                      {votingId === poi.id + "down" ? "…" : `👎 ${poi.downvotes}`}
                    </button>
                  </div>

                  {voteResult[poi.id] && (
                    <p style={{ fontSize: "11px", color: "#6B7280", textAlign: "center", marginTop: "6px" }}>
                      ✓ Karma actualizado. ¡Gracias por contribuir!
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Badge flotante de zona activa */}
        {activeZoneData && (
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              zIndex: 1000,
              background: "white",
              borderRadius: "12px",
              padding: "10px 14px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              border: `2px solid ${activeZoneData.color}`,
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: activeZoneData.color,
                boxShadow: `0 0 0 3px ${activeZoneData.color}33`,
              }}
            />
            <span style={{ fontWeight: 700, fontSize: "13px", color: "#111827" }}>
              Zona {activeZoneData.name}
            </span>
            <span style={{ fontSize: "11px", color: "#6B7280" }}>
              Mapa restringido ·{" "}
              <span style={{ color: "#10B981", fontWeight: 600 }}>Optimizado</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}