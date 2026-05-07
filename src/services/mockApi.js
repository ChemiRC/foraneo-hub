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

  fetchMapData: async (zone) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Pensión Doña Mary', type: 'Vivienda', karma: 85, lat: 20.725, lng: -103.386, price: '$2,500/mes', desc: 'Incluye agua y luz. A 10 min del CUCEA.' },
          { id: 2, name: 'Fonda Las Cazuelas', type: 'Comida', karma: 120, lat: 20.722, lng: -103.383, price: '$70 - $100', desc: 'Comida corrida con tortillas hechas a mano.' },
          { id: 3, name: 'Lavandería Burbujas', type: 'Servicios', karma: 45, lat: 20.726, lng: -103.381, price: '$20/kg', desc: 'Entrega el mismo día si la dejas antes de las 12.' },
          { id: 4, name: 'Depas "La Cima"', type: 'Vivienda', karma: -15, lat: 20.721, lng: -103.388, price: '$4,500/mes', desc: 'Reportado por retener depósitos de foráneos.' }
        ]);
      }, 1500); 
    });
  },

  voteKarma: async (poiId, voteValue) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, newKarma: 245 + voteValue });
      }, 800);
    });
  },

  processCommission: async (amount, description) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (amount <= 0) reject(new Error('Monto inválido'));
        const commission = amount * 0.06; // 6% de comisión
        resolve({
          id: `TRX-${Math.floor(Math.random() * 10000)}`,
          desc: description || 'Venta General',
          amount: amount,
          commission: commission,
          net: amount - commission,
          status: 'Aprobado',
          date: new Date().toLocaleTimeString()
        });
      }, 1500); 
    });
  }
};