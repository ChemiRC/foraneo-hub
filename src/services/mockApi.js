// ============================================================
//  FORÁNEO HUB — Mock API v2.0
//  Simula el BaaS (Firebase) con latencia realista y datos ricos
// ============================================================

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const jitter = (base, spread = 200) =>
  delay(base + Math.random() * spread - spread / 2);

// ── Zonas universitarias (Geofencing segregado) ──────────────
export const ZONES = {
  CUCEI: {
    id: "cucei",
    name: "CUCEI",
    fullName: "Centro Universitario de Ciencias Exactas e Ingenierías",
    center: [20.6518, -103.3247],
    radius: 800,
    color: "#FF6B35",
    studentCount: 12400,
  },
  CUCEA: {
    id: "cucea",
    name: "CUCEA",
    fullName: "Centro Universitario de Ciencias Económico Administrativas",
    center: [20.7387, -103.4498],
    radius: 700,
    color: "#4ECDC4",
    studentCount: 9800,
  },
  CUCSH: {
    id: "cucsh",
    name: "CUCSH",
    fullName: "Centro Universitario de Ciencias Sociales y Humanidades",
    center: [20.6793, -103.3505],
    radius: 600,
    color: "#A855F7",
    studentCount: 7200,
  },
};

// ── Usuarios con avatares reales (UI Faces / Unsplash) ────────
const USERS = [
  {
    id: "usr_001",
    name: "Camila Reyes",
    avatar: "https://i.pravatar.cc/150?img=47",
    zone: "cucei",
    role: "foraneo",
    karma: 87,
    verified: true,
    origin: "Zacatecas",
  },
  {
    id: "usr_002",
    name: "Diego Morales",
    avatar: "https://i.pravatar.cc/150?img=11",
    zone: "cucei",
    role: "residente",
    karma: 124,
    verified: true,
    origin: "Guadalajara",
  },
  {
    id: "usr_003",
    name: "Sofía Hernández",
    avatar: "https://i.pravatar.cc/150?img=32",
    zone: "cucea",
    role: "foraneo",
    karma: 63,
    verified: false,
    origin: "Colima",
  },
  {
    id: "usr_004",
    name: "Andrés Vega",
    avatar: "https://i.pravatar.cc/150?img=15",
    zone: "cucsh",
    role: "foraneo",
    karma: 210,
    verified: true,
    origin: "Aguascalientes",
  },
  {
    id: "usr_005",
    name: "Valentina Cruz",
    avatar: "https://i.pravatar.cc/150?img=44",
    zone: "cucei",
    role: "residente",
    karma: 98,
    verified: true,
    origin: "Guadalajara",
  },
];

// ── POIs — Puntos de Interés validados por la comunidad ────────
const POIS_DB = [
  {
    id: "poi_001",
    name: "Tortas El Chavo",
    category: "comida",
    categoryIcon: "🌮",
    zone: "cucei",
    coords: [20.6512, -103.3253],
    karma: 94,
    votes: 312,
    downvotes: 18,
    verified: true,
    description:
      "Las mejores tortas ahogadas a 5 minutos del CUCEI. Orden rápida, perfecta para entre clases. Aceptan efectivo y tarjeta.",
    priceRange: "$$",
    avgPrice: 65,
    hours: "Lun–Vie 8:00–18:00 · Sáb 9:00–15:00",
    phone: "+52 33 1234 5678",
    images: [
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
    ],
    tags: ["rápido", "económico", "cerca del camión"],
    reportCount: 2,
    addedBy: "usr_002",
    addedAt: "2025-02-14T10:23:00Z",
    lastValidated: "2025-05-01T09:00:00Z",
  },
  {
    id: "poi_002",
    name: "Renta CUCEI — Depto. Amueblado",
    category: "renta",
    categoryIcon: "🏠",
    zone: "cucei",
    coords: [20.6528, -103.3261],
    karma: 81,
    votes: 88,
    downvotes: 7,
    verified: true,
    description:
      "Cuarto individual amueblado a 3 cuadras del CUCEI. Incluye wifi, agua y gas. Cocina compartida. Fotos reales, sin engaños.",
    priceRange: "$$$",
    avgPrice: 3200,
    priceUnit: "/mes",
    hours: "Contactar al anunciante",
    phone: "+52 33 8765 4321",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80",
    ],
    tags: ["amueblado", "wifi incluido", "anunciante verificado"],
    reportCount: 0,
    addedBy: "usr_004",
    addedAt: "2025-01-20T14:00:00Z",
    lastValidated: "2025-04-28T11:00:00Z",
  },
  {
    id: "poi_003",
    name: "Café Bitácora",
    category: "café",
    categoryIcon: "☕",
    zone: "cucei",
    coords: [20.6501, -103.3238],
    karma: 76,
    votes: 145,
    downvotes: 22,
    verified: false,
    description:
      "Café con ambiente de estudio. Outlets en todas las mesas, wifi rápido y café de especialidad. Ideal para parciales.",
    priceRange: "$$",
    avgPrice: 55,
    hours: "Lun–Dom 7:00–22:00",
    phone: "+52 33 2233 4455",
    images: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80",
      "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400&q=80",
    ],
    tags: ["wifi rápido", "enchufes", "tranquilo"],
    reportCount: 1,
    addedBy: "usr_001",
    addedAt: "2025-03-05T09:30:00Z",
    lastValidated: "2025-04-30T14:00:00Z",
  },
  {
    id: "poi_004",
    name: "Copias e Impresiones XPress",
    category: "servicio",
    categoryIcon: "🖨️",
    zone: "cucei",
    coords: [20.6535, -103.327],
    karma: 88,
    votes: 203,
    downvotes: 5,
    verified: true,
    description:
      "Impresiones a color y B/N, engargolados y plastificados. El más barato de la zona. Siempre hay fila a mediados de semestre.",
    priceRange: "$",
    avgPrice: 2,
    priceUnit: "/hoja",
    hours: "Lun–Vie 7:30–20:00 · Sáb 8:00–14:00",
    phone: "+52 33 3344 5566",
    images: [
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80",
    ],
    tags: ["barato", "rápido", "engargolado"],
    reportCount: 0,
    addedBy: "usr_005",
    addedAt: "2025-02-01T08:00:00Z",
    lastValidated: "2025-05-02T10:00:00Z",
  },
  {
    id: "poi_005",
    name: "Farmacia San Jorge",
    category: "farmacia",
    categoryIcon: "💊",
    zone: "cucea",
    coords: [20.7381, -103.4492],
    karma: 71,
    votes: 67,
    downvotes: 9,
    verified: true,
    description:
      "Farmacia con genéricos baratos y servicio a domicilio. Tienen pruebas de COVID y básicos de laboratorio.",
    priceRange: "$$",
    avgPrice: 120,
    hours: "8:00–22:00 todos los días",
    phone: "+52 33 4455 6677",
    images: [
      "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&q=80",
    ],
    tags: ["genéricos", "domicilio", "laboratorio"],
    reportCount: 0,
    addedBy: "usr_003",
    addedAt: "2025-03-18T12:00:00Z",
    lastValidated: "2025-04-25T09:00:00Z",
  },
  {
    id: "poi_006",
    name: "Studio Universitario El Roble",
    category: "vivienda",
    categoryIcon: "🏡",
    zone: "cucei",
    coords: [20.6522, -103.3278],
    karma: 89,
    votes: 134,
    downvotes: 8,
    verified: true,
    description:
      "Studio privado y amueblado a 2 cuadras del CUCEI. Vigilancia 24h, wifi de 100 Mbps, agua caliente y gas incluidos. Fotos 100% reales, sin filtros.",
    priceRange: "$$$",
    avgPrice: 3800,
    priceUnit: "/mes",
    hours: "Visitas: Lun–Sáb 10:00–19:00",
    phone: "+52 33 9988 7766",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80",
    ],
    tags: ["studio privado", "wifi 100Mbps", "vigilancia 24h"],
    reportCount: 0,
    addedBy: "usr_002",
    addedAt: "2025-04-05T10:00:00Z",
    lastValidated: "2025-05-03T09:00:00Z",
  },
  {
    id: "poi_007",
    name: "Tacos La Güera",
    category: "comida",
    categoryIcon: "🌮",
    zone: "cucsh",
    coords: [20.6798, -103.3512],
    karma: 85,
    votes: 189,
    downvotes: 14,
    verified: true,
    description:
      "Los mejores tacos de canasta del CUCSH. Variedad: frijoles, papa, chicharrón y pollo. Perfectos para el lunch entre clases. Pago en efectivo.",
    priceRange: "$",
    avgPrice: 15,
    priceUnit: "/taco",
    hours: "Lun–Vie 7:00–14:00 · Sáb 8:00–13:00",
    phone: "+52 33 5566 7788",
    images: [
      "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=600&q=80",
    ],
    tags: ["económico", "rápido", "canasta"],
    reportCount: 1,
    addedBy: "usr_001",
    addedAt: "2025-03-20T08:00:00Z",
    lastValidated: "2025-04-29T12:00:00Z",
  },
  {
    id: "poi_008",
    name: "Farmacia Universitaria Plus",
    category: "farmacia",
    categoryIcon: "💊",
    zone: "cucei",
    coords: [20.6508, -103.3244],
    karma: 78,
    votes: 92,
    downvotes: 12,
    verified: true,
    description:
      "Farmacia completa con genéricos y de marca. Médico gratis todos los días. Servicio a domicilio en menos de 30 minutos dentro del campus.",
    priceRange: "$$",
    avgPrice: 80,
    hours: "7:00–23:00 todos los días",
    phone: "+52 33 6677 8899",
    images: [
      "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=600&q=80",
    ],
    tags: ["médico gratis", "domicilio 30min", "genéricos"],
    reportCount: 0,
    addedBy: "usr_005",
    addedAt: "2025-02-15T09:00:00Z",
    lastValidated: "2025-05-01T10:00:00Z",
  },
];

// ── Comercios (Panel de Negocios) ─────────────────────────────
const BUSINESSES_DB = [
  {
    id: "biz_001",
    name: "Tortas El Chavo",
    owner: "Ramón Gutiérrez",
    email: "ramon@tortaselchavo.mx",
    zone: "cucei",
    category: "Alimentos y Bebidas",
    logo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=80&q=80",
    plan: "premium",
    monthlyRevenue: 18400,
    commissionRate: 0.06,
    joinedAt: "2025-01-10T00:00:00Z",
    active: true,
    rating: 4.8,
    totalSales: 47,
  },
  {
    id: "biz_002",
    name: "Café Bitácora",
    owner: "Lucía Sandoval",
    email: "lucia@cafebitacora.mx",
    zone: "cucei",
    category: "Café y Estudio",
    logo: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=80&q=80",
    plan: "freemium",
    monthlyRevenue: 9200,
    commissionRate: 0.06,
    joinedAt: "2025-02-28T00:00:00Z",
    active: true,
    rating: 4.5,
    totalSales: 23,
  },
];

// ── Transacciones con comisión del 6% ─────────────────────────
const TRANSACTIONS_DB = [
  {
    id: "txn_001",
    businessId: "biz_001",
    description: "Torta Ahogada Especial x2",
    subtotal: 130.0,
    commissionRate: 0.06,
    commission: 7.8,
    net: 122.2,
    status: "completada",
    customer: "Camila R.",
    createdAt: "2025-05-06T14:32:00Z",
    method: "card",
  },
  {
    id: "txn_002",
    businessId: "biz_001",
    description: "Torta de Pierna + Agua Fresca",
    subtotal: 75.0,
    commissionRate: 0.06,
    commission: 4.5,
    net: 70.5,
    status: "completada",
    customer: "Diego M.",
    createdAt: "2025-05-06T12:10:00Z",
    method: "cash",
  },
  {
    id: "txn_003",
    businessId: "biz_001",
    description: "Orden para oficina x5",
    subtotal: 325.0,
    commissionRate: 0.06,
    commission: 19.5,
    net: 305.5,
    status: "completada",
    customer: "Andrés V.",
    createdAt: "2025-05-05T13:55:00Z",
    method: "transfer",
  },
  {
    id: "txn_004",
    businessId: "biz_001",
    description: "Torta de Lomo",
    subtotal: 65.0,
    commissionRate: 0.06,
    commission: 3.9,
    net: 61.1,
    status: "pendiente",
    customer: "Valentina C.",
    createdAt: "2025-05-06T15:01:00Z",
    method: "card",
  },
  {
    id: "txn_005",
    businessId: "biz_002",
    description: "Americano + Brownie + 2hrs Coworking",
    subtotal: 120.0,
    commissionRate: 0.06,
    commission: 7.2,
    net: 112.8,
    status: "completada",
    customer: "Sofía H.",
    createdAt: "2025-05-06T10:30:00Z",
    method: "card",
  },
];

// ── Alertas de Geofencing ─────────────────────────────────────
const GEOFENCE_ALERTS_DB = [
  {
    id: "geo_001",
    zone: "cucei",
    type: "oferta",
    icon: "🔥",
    title: "Oferta Flash en Tortas El Chavo",
    message: "2x1 en tortas de 12:00 a 14:00 hoy. Solo a 300m de tu ubicación.",
    businessId: "biz_001",
    radius: 400,
    expiresAt: "2025-05-06T14:00:00Z",
    createdAt: "2025-05-06T11:00:00Z",
  },
  {
    id: "geo_002",
    zone: "cucei",
    type: "alerta",
    icon: "⚠️",
    title: "Reporte en zona de rentas",
    message:
      'Usuarios reportaron anuncio de renta falso en Av. Patria #34. Verificar antes de contactar.',
    businessId: null,
    radius: 600,
    expiresAt: "2025-05-07T00:00:00Z",
    createdAt: "2025-05-06T08:30:00Z",
  },
  {
    id: "geo_003",
    zone: "cucei",
    type: "info",
    icon: "📌",
    title: "Nuevo POI validado",
    message:
      "Copias XPress fue validado por 200+ estudiantes. Calificación Karma: 88/100.",
    businessId: null,
    radius: 800,
    expiresAt: "2025-05-08T00:00:00Z",
    createdAt: "2025-05-05T16:00:00Z",
  },
];

// ── KARMA — Reseñas de la comunidad ───────────────────────────
const KARMA_ENTRIES_DB = [
  {
    id: "kar_001",
    poiId: "poi_001",
    userId: "usr_001",
    userName: "Camila Reyes",
    avatar: "https://i.pravatar.cc/150?img=47",
    score: 5,
    comment:
      "Super rápido y buenísimo. Llegué tarde a clase pero valió la pena 😂",
    helpful: 34,
    notHelpful: 2,
    verified: true,
    createdAt: "2025-04-20T13:00:00Z",
    tags: ["rápido", "sabroso"],
  },
  {
    id: "kar_002",
    poiId: "poi_001",
    userId: "usr_004",
    userName: "Andrés Vega",
    avatar: "https://i.pravatar.cc/150?img=15",
    score: 4,
    comment:
      "Muy buenas tortas pero a veces hay mucha fila. Ir antes de las 12.",
    helpful: 28,
    notHelpful: 1,
    verified: true,
    createdAt: "2025-04-15T11:30:00Z",
    tags: ["económico"],
  },
  {
    id: "kar_003",
    poiId: "poi_002",
    userId: "usr_003",
    userName: "Sofía Hernández",
    avatar: "https://i.pravatar.cc/150?img=32",
    score: 5,
    comment:
      "El cuarto es tal cual las fotos. El dueño muy amable y el wifi de verdad funciona.",
    helpful: 41,
    notHelpful: 0,
    verified: false,
    createdAt: "2025-04-10T09:00:00Z",
    tags: ["fotos reales", "wifi bueno"],
  },
];

// ══════════════════════════════════════════════════════════════
//  FUNCIONES DE LA API SIMULADA
// ══════════════════════════════════════════════════════════════

/** Retorna todas las zonas disponibles */
export async function fetchZones() {
  await jitter(300, 100);
  return Object.values(ZONES);
}

/** Retorna POIs filtrados por zona */
export async function fetchPOIsByZone(zoneId) {
  await jitter(600, 200); // Simula carga de mapa segregado
  const results = POIS_DB.filter((p) => p.zone === zoneId);
  return results;
}

/** Retorna todos los POIs */
export async function fetchAllPOIs() {
  await jitter(700, 150);
  return POIS_DB;
}

/** Retorna un POI específico por ID */
export async function fetchPOIById(poiId) {
  await jitter(400, 100);
  return POIS_DB.find((p) => p.id === poiId) || null;
}

/** Emite un voto Karma sobre un POI */
export async function voteKarma(poiId, vote) {
  await jitter(800, 200); // Simula Cloud Function de validación
  const poi = POIS_DB.find((p) => p.id === poiId);
  if (!poi) throw new Error("POI no encontrado");
  if (vote === "up") {
    poi.votes += 1;
    poi.karma = Math.min(100, Math.round((poi.votes / (poi.votes + poi.downvotes)) * 100));
  } else {
    poi.downvotes += 1;
    poi.karma = Math.min(100, Math.round((poi.votes / (poi.votes + poi.downvotes)) * 100));
  }
  return { success: true, newKarma: poi.karma, votes: poi.votes, downvotes: poi.downvotes };
}

/** Reporta un POI como falso o desactualizado */
export async function reportPOI(poiId, reason) {
  await jitter(900, 150);
  const poi = POIS_DB.find((p) => p.id === poiId);
  if (!poi) throw new Error("POI no encontrado");
  poi.reportCount += 1;
  if (poi.reportCount >= 5) poi.verified = false; // Desverificar automáticamente
  return { success: true, reportCount: poi.reportCount, message: "Reporte recibido. El equipo lo revisará en 24h." };
}

/** Retorna comentarios Karma de un POI */
export async function fetchKarmaByPOI(poiId) {
  await jitter(500, 100);
  return KARMA_ENTRIES_DB.filter((k) => k.poiId === poiId);
}

/** Retorna todos los comentarios Karma */
export async function fetchAllKarma() {
  await jitter(550, 100);
  return KARMA_ENTRIES_DB;
}

/** Agrega un comentario Karma nuevo */
export async function addKarmaEntry(entry) {
  await jitter(1000, 200);
  const newEntry = {
    id: `kar_${Date.now()}`,
    helpful: 0,
    notHelpful: 0,
    verified: false,
    createdAt: new Date().toISOString(),
    ...entry,
  };
  KARMA_ENTRIES_DB.unshift(newEntry);
  return newEntry;
}

/** Retorna datos del negocio activo */
export async function fetchBusiness(bizId = "biz_001") {
  await jitter(500, 100);
  return BUSINESSES_DB.find((b) => b.id === bizId) || null;
}

/** Retorna transacciones de un negocio */
export async function fetchTransactions(bizId = "biz_001") {
  await jitter(700, 150);
  const txns = TRANSACTIONS_DB.filter((t) => t.businessId === bizId);
  const totalRevenue = txns.reduce((sum, t) => sum + (t.status === "completada" ? t.subtotal : 0), 0);
  const totalCommission = txns.reduce((sum, t) => sum + (t.status === "completada" ? t.commission : 0), 0);
  const totalNet = txns.reduce((sum, t) => sum + (t.status === "completada" ? t.net : 0), 0);
  return { transactions: txns, totalRevenue, totalCommission, totalNet };
}

/** Registra una transacción nueva */
export async function createTransaction(bizId, data) {
  await jitter(1200, 300); // Simula Stripe + Cloud Function
  const commission = parseFloat((data.subtotal * 0.06).toFixed(2));
  const net = parseFloat((data.subtotal - commission).toFixed(2));
  const newTxn = {
    id: `txn_${Date.now()}`,
    businessId: bizId,
    commissionRate: 0.06,
    commission,
    net,
    status: "completada",
    createdAt: new Date().toISOString(),
    method: data.method || "card",
    ...data,
  };
  TRANSACTIONS_DB.unshift(newTxn);
  return newTxn;
}

/** Retorna alertas de geofencing activas en una zona */
export async function fetchGeofenceAlerts(zoneId) {
  await jitter(400, 100);
  return GEOFENCE_ALERTS_DB.filter((a) => a.zone === zoneId);
}

/** Login simulado */
export async function loginUser(email, password) {
  await jitter(1000, 300);
  // Simulación: cualquier credencial funciona para el mock
  if (!email || !password) throw new Error("Credenciales requeridas");
  return {
    token: "mock_jwt_token_" + Date.now(),
    user: USERS[0],
  };
}

/** Retorna perfil de usuario actual */
export async function fetchCurrentUser() {
  await jitter(300, 50);
  return USERS[0]; // Camila como usuario activo por defecto
}
// =====================================================================
// CAPA DE COMPATIBILIDAD (Para no romper AppContext ni BusinessPanel)
// =====================================================================
export const mockApi = {
  login: async (role) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: role === 'foraneo' ? 'FOR-892' : 'COM-104',
          name: role === 'foraneo' ? 'Usuario Foráneo' : 'Fonda Las Cazuelas',
          role: role,
          avatar: role === 'foraneo' ? 'F' : 'C',
        });
      }, 1200);
    });
  },
  processCommission: async (amount, description) => {
    // Usamos la nueva función createTransaction que hizo Claude
    const txn = await createTransaction("COM-104", { subtotal: amount });
    return {
      id: txn.id,
      desc: description || 'Venta Mostrador',
      amount: amount,
      commission: txn.commission,
      net: txn.net,
      status: 'Aprobado',
      date: new Date().toLocaleTimeString()
    };
  },
  voteKarma: async (poiId, val) => {
    // Usamos la nueva función voteKarma que hizo Claude
    return voteKarma(poiId, val);
  }
};