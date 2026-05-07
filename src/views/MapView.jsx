import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  fetchAllPOIs,
  fetchZones,
  fetchGeofenceAlerts,
  voteKarma,
} from "../services/mockApi";
import { useAppContext } from "../context/AppContext";

// ── Leaflet fix ──────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Config ───────────────────────────────────────────────────
const CATEGORY_CONFIG = {
  comida: { color: "#FF6B35", icon: "🍽", label: "Comida" },
  renta: { color: "#4ECDC4", icon: "🏠", label: "Renta" },
  vivienda: { color: "#4ECDC4", icon: "🏡", label: "Vivienda" },
  café: { color: "#A855F7", icon: "☕", label: "Café" },
  servicio: { color: "#3B82F6", icon: "⚙️", label: "Servicio" },
  farmacia: { color: "#10B981", icon: "💊", label: "Farmacia" },
};

const getTierInfo = (score) => {
  if (score >= 80) return { label: "Verificado", icon: "✓", color: "#10B981" };
  if (score >= 60) return { label: "Confiable", icon: "◆", color: "#F59E0B" };
  return { label: "En Revisión", icon: "⚠", color: "#EF4444" };
};

const createMarkerIcon = (category, karma) => {
  const cfg = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.servicio;
  const size = karma >= 80 ? 40 : karma >= 60 ? 32 : 28;
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:${size}px; height:${size}px;
        background: linear-gradient(135deg, ${cfg.color}, ${cfg.color}dd);
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 6px 20px ${cfg.color}66;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${size * 0.6}px;
      ">
        ${cfg.icon}
      </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

// ── Components ───────────────────────────────────────────────
function FlyToZone({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 15, { duration: 1.2 });
  }, [center, map]);
  return null;
}

function StarRating({ karma }) {
  const filled = Math.round((karma / 100) * 5);
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= filled ? "#FCD34D" : "#E5E7EB", fontSize: "18px", lineHeight: 1 }}>
          ★
        </span>
      ))}
      <span style={{ marginLeft: "8px", fontSize: "13px", fontWeight: 700, color: "#4B5563" }}>
        {(karma / 20).toFixed(1)}
      </span>
    </div>
  );
}

function POIModal({ poi, onClose, onCTA, ctaLoading, onReport, reportLoading }) {
  const cfg = CATEGORY_CONFIG[poi.category] || CATEGORY_CONFIG.servicio;
  const isRental = ["renta", "vivienda"].includes(poi.category?.toLowerCase());
  const ctaLabel = isRental ? "🏠 Reservar Departamento" : "💬 Contactar";
  const heroImage = poi.images?.[0] || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&q=80";
  const tier = getTierInfo(poi.karma);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(12px)",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: "28px",
          overflow: "hidden",
          maxWidth: "520px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 40px 100px rgba(0,0,0,0.4)",
          animation: "slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Hero image */}
        <div style={{ position: "relative", height: "280px", overflow: "hidden" }}>
          <img src={heroImage} alt={poi.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }} />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              width: "40px",
              height: "40px",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(6px)",
              border: "none",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
              color: "#374151",
              fontWeight: 300,
              lineHeight: 1,
            }}
          >
            ×
          </button>

          {/* Category badge */}
          <div
            style={{
              position: "absolute",
              top: "14px",
              left: "14px",
              background: cfg.color,
              color: "white",
              padding: "6px 14px",
              borderRadius: "99px",
              fontSize: "12px",
              fontWeight: 700,
              boxShadow: `0 2px 12px ${cfg.color}88`,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {cfg.icon} {cfg.label}
          </div>

          {/* Title */}
          <div style={{ position: "absolute", bottom: "18px", left: "20px", right: "20px" }}>
            <h2 style={{ color: "white", fontSize: "24px", fontWeight: 800, margin: 0, textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>
              {poi.name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "24px 28px" }}>
          {/* Rating + Verify */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <StarRating karma={poi.karma} />
            {poi.verified && <span style={{ background: "#DCFCE7", color: "#15803D", fontSize: "11px", fontWeight: 800, padding: "4px 12px", borderRadius: "99px" }}>✓ Verificado</span>}
          </div>

          {/* Description */}
          <p style={{ fontSize: "14px", color: "#4B5563", lineHeight: 1.6, margin: "0 0 20px" }}>
            {poi.description}
          </p>

          {/* Info grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
            <div style={{ background: "#F8FAFC", borderRadius: "14px", padding: "14px", border: "1px solid #F1F5F9" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                💰 Precio
              </div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A" }}>
                {poi.avgPrice ? `$${poi.avgPrice.toLocaleString()}` : poi.priceRange}
              </div>
              {poi.priceUnit && <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>{poi.priceUnit}</div>}
            </div>
            <div style={{ background: "#F8FAFC", borderRadius: "14px", padding: "14px", border: "1px solid #F1F5F9" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
                🕐 Horario
              </div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#374151", lineHeight: 1.4 }}>
                {poi.hours?.split("·")[0].trim() || "Contactar"}
              </div>
            </div>
          </div>

          {/* Tags */}
          {poi.tags?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
              {poi.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: `${cfg.color}15`,
                    color: cfg.color,
                    fontSize: "12px",
                    padding: "5px 12px",
                    borderRadius: "99px",
                    fontWeight: 600,
                    border: `1px solid ${cfg.color}30`,
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <button
            onClick={onCTA}
            disabled={ctaLoading}
            style={{
              width: "100%",
              padding: "16px",
              background: ctaLoading ? "#94A3B8" : `linear-gradient(135deg, ${cfg.color} 0%, ${cfg.color}CC 100%)`,
              color: "white",
              border: "none",
              borderRadius: "16px",
              fontSize: "16px",
              fontWeight: 800,
              cursor: ctaLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "all 0.25s ease",
              boxShadow: ctaLoading ? "none" : `0 10px 28px ${cfg.color}55`,
              marginBottom: "12px",
              letterSpacing: "-0.2px",
            }}
          >
            {ctaLoading ? (
              <>
                <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
                Procesando...
              </>
            ) : (
              ctaLabel
            )}
          </button>

          {/* Report Button */}
          <button
            onClick={onReport}
            disabled={reportLoading}
            style={{
              width: "100%",
              padding: "12px",
              background: "transparent",
              color: reportLoading ? "#9CA3AF" : "#DC2626",
              border: `1.5px solid ${reportLoading ? "#E5E7EB" : "#FCA5A5"}`,
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: reportLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.2s ease",
            }}
          >
            {reportLoading ? "⏳ Enviando..." : "🚩 Reportar como Falso"}
          </button>
        </div>
      </div>
    </div>
  );
}

function POICard({ poi, isSelected, onCardClick }) {
  const cfg = CATEGORY_CONFIG[poi.category] || CATEGORY_CONFIG.servicio;
  return (
    <div
      onClick={() => onCardClick(poi)}
      style={{
        background: isSelected ? "#FAFAFA" : "white",
        border: `2px solid ${isSelected ? cfg.color : "#F3F4F6"}`,
        borderRadius: "16px",
        padding: "14px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: isSelected ? `0 6px 24px ${cfg.color}33` : "0 1px 4px rgba(0,0,0,0.06)",
        marginBottom: "10px",
        transform: "translateY(0)",
      }}
      onMouseOver={(e) => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }
      }}
      onMouseOut={(e) => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
    >
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <div style={{ width: "60px", height: "60px", borderRadius: "12px", overflow: "hidden", flexShrink: 0, background: "#F3F4F6" }}>
          {poi.images?.[0] ? (
            <img src={poi.images[0]} alt={poi.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
              {cfg.icon}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {poi.name}
            </span>
            {poi.verified && <span style={{ background: "#DCFCE7", color: "#16A34A", fontSize: "10px", fontWeight: 700, padding: "1px 6px", borderRadius: "99px", flexShrink: 0 }}>✓</span>}
          </div>
          <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "8px" }}>
            {cfg.icon} {cfg.label} · {poi.priceRange}
            {poi.avgPrice && <span style={{ marginLeft: "4px", fontWeight: 600 }}>· ${poi.avgPrice.toLocaleString()}</span>}
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#6B7280", marginBottom: "2px" }}>
              <span>Karma {poi.karma}/100</span>
              <span>{getTierInfo(poi.karma).label}</span>
            </div>
            <div style={{ height: "5px", background: "#E5E7EB", borderRadius: "99px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${poi.karma}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${getTierInfo(poi.karma).color}, ${getTierInfo(poi.karma).color}99)`,
                  transition: "width 0.6s ease",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      <span style={{ fontSize: "16px", lineHeight: 1 }}>{alert.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>{alert.title}</div>
        <div style={{ fontSize: "12px", color: "#4B5563", marginTop: "2px", lineHeight: 1.4 }}>{alert.message}</div>
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
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function MapView() {
  const { showToast } = useAppContext();

  const [pois, setPois] = useState([]);
  const [zones, setZones] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [modalPOI, setModalPOI] = useState(null);
  const [activeZone, setActiveZone] = useState("cucei");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [ctaLoading, setCtaLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const mapRef = useRef();

  const ZONE_CENTERS = {
    cucei: [20.6518, -103.3247],
    cucea: [20.7387, -103.4498],
    cucsh: [20.6793, -103.3505],
  };

  useEffect(() => {
    Promise.all([fetchAllPOIs(), fetchZones(), fetchGeofenceAlerts("cucei")]).then(([p, z, a]) => {
      setPois(p);
      setZones(z);
      setAlerts(a);
      setLoading(false);
    });
  }, []);

  const categories = ["all", ...new Set(pois.map((p) => p.category))];
  const filteredPOIs = pois.filter(
    (p) => p.zone === activeZone && (categoryFilter === "all" || p.category === categoryFilter)
  );

  const openModal = (poi) => {
    setSelectedPOI(poi);
    setModalPOI(poi);
    setCtaLoading(false);
    setReportLoading(false);
  };

  const closeModal = () => {
    setModalPOI(null);
    setCtaLoading(false);
    setReportLoading(false);
  };

  const handleCTA = async () => {
    if (!modalPOI || ctaLoading) return;
    setCtaLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setCtaLoading(false);
    const isRental = ["renta", "vivienda"].includes(modalPOI.category?.toLowerCase());
    showToast(isRental ? "✓ Reserva confirmada" : "Abriendo chat...", "success");
    closeModal();
  };

  const handleReport = async () => {
    if (!modalPOI || reportLoading) return;
    setReportLoading(true);
    try {
      const result = await voteKarma(modalPOI.id, "down");
      setPois((prev) =>
        prev.map((p) =>
          p.id === modalPOI.id
            ? { ...p, karma: result.newKarma, votes: result.votes, downvotes: result.downvotes }
            : p
        )
      );
      showToast("Reporte enviado a Trust & Safety", "info");
      closeModal();
    } catch {
      showToast("Error al reportar", "error");
      setReportLoading(false);
    }
  };

  const dismissAlert = (id) => setAlerts((prev) => prev.filter((a) => a.id !== id));
  const activeZoneData = zones.find((z) => z.id === activeZone);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "16px", background: "#F9FAFB" }}>
        <div style={{ width: "48px", height: "48px", border: "3px solid #E5E7EB", borderTop: "3px solid #FF6B35", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "#6B7280", fontSize: "14px" }}>Cargando zonas universitarias…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100%", background: "#F9FAFB", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUp { from { opacity:0; transform:translateY(40px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
        .poi-panel::-webkit-scrollbar { width: 4px; }
        .poi-panel::-webkit-scrollbar-track { background: transparent; }
        .poi-panel::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 99px; }
      `}</style>

      {/* Modal */}
      {modalPOI && (
        <POIModal
          poi={modalPOI}
          onClose={closeModal}
          onCTA={handleCTA}
          ctaLoading={ctaLoading}
          onReport={handleReport}
          reportLoading={reportLoading}
        />
      )}

      {/* Sidebar */}
      <div style={{ width: "380px", flexShrink: 0, display: "flex", flexDirection: "column", background: "white", borderRight: "1px solid #F3F4F6", zIndex: 10 }}>
        {/* Header */}
        <div style={{ padding: "20px", borderBottom: "1px solid #F3F4F6", background: "white" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #FF6B35, #FF8C69)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700 }}>
              📍
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "#111827", letterSpacing: "-0.3px" }}>
                Foráneo Hub
              </div>
              <div style={{ fontSize: "11px", color: "#6B7280" }}>Mapa validado por la comunidad</div>
            </div>
          </div>

          {/* Zone selector */}
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

        {/* Alerts */}
        {alerts.length > 0 && (
          <div style={{ padding: "12px 16px 0", borderBottom: "1px solid #F3F4F6" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>
              📡 Alertas en Zona
            </div>
            {alerts.map((a) => (
              <GeofenceAlert key={a.id} alert={a} onDismiss={dismissAlert} />
            ))}
          </div>
        )}

        {/* Category filter */}
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

        {/* Zone info */}
        {activeZoneData && (
          <div style={{ margin: "12px 16px 0", padding: "12px", background: `${activeZoneData.color}0F`, borderRadius: "12px", border: `1px solid ${activeZoneData.color}30` }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: activeZoneData.color }}>
              📍 {activeZoneData.fullName}
            </div>
            <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>
              {activeZoneData.studentCount.toLocaleString()} estudiantes · {filteredPOIs.length} lugares
            </div>
          </div>
        )}

        {/* POI List */}
        <div className="poi-panel" style={{ flex: 1, overflowY: "auto", padding: "12px 16px 16px" }}>
          {filteredPOIs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#9CA3AF" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
              <div style={{ fontWeight: 600 }}>Sin resultados</div>
              <div style={{ fontSize: "13px", marginTop: "4px" }}>Prueba con otra categoría</div>
            </div>
          ) : (
            filteredPOIs
              .sort((a, b) => b.karma - a.karma)
              .map((poi) => (
                <POICard
                  key={poi.id}
                  poi={poi}
                  isSelected={selectedPOI?.id === poi.id}
                  onCardClick={openModal}
                />
              ))
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "10px 16px", borderTop: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", color: "#9CA3AF" }}>🔒 Mapa segregado por zona · BaaS Firebase</span>
          <span style={{ fontSize: "11px", color: "#10B981", fontWeight: 600 }}>● Online</span>
        </div>
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: "relative" }}>
        <MapContainer center={ZONE_CENTERS[activeZone]} zoom={15} style={{ height: "100%", width: "100%" }} ref={mapRef}>
          <TileLayer attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FlyToZone center={ZONE_CENTERS[activeZone]} />
          {activeZoneData && (
            <Circle
              center={activeZoneData.center}
              radius={activeZoneData.radius}
              pathOptions={{ color: activeZoneData.color, fillColor: activeZoneData.color, fillOpacity: 0.07, weight: 2, dashArray: "6, 6" }}
            />
          )}
          {filteredPOIs.map((poi) => (
            <Marker key={poi.id} position={poi.coords} icon={createMarkerIcon(poi.category, poi.karma)} eventHandlers={{ click: () => openModal(poi) }} />
          ))}
        </MapContainer>

        {/* Zone badge */}
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
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: activeZoneData.color, boxShadow: `0 0 0 3px ${activeZoneData.color}33` }} />
            <span style={{ fontWeight: 700, fontSize: "13px", color: "#111827" }}>Zona {activeZoneData.name}</span>
            <span style={{ fontSize: "11px", color: "#6B7280" }}>
              Optimizado ·{" "}
              <span style={{ color: "#10B981", fontWeight: 600 }}>Activo</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
