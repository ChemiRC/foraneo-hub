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
      }, 1200); // Simulando latencia de Firebase Auth
    });
  },

  fetchMapData: async (zone) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Pensión Doña Mary', type: 'Vivienda', karma: 85 },
          { id: 2, name: 'Fonda Las Cazuelas', type: 'Comida', karma: 120 },
        ]);
      }, 1500); // Simulando carga de geolocalización segregada (ahorro API)
    });
  },

  voteKarma: async (poiId, voteValue) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, newKarma: 245 + voteValue });
      }, 800); // Simulando lógica de Cloud Functions
    });
  },

  processCommission: async (amount) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (amount <= 0) reject(new Error('Monto inválido'));
        const commission = amount * 0.06; // Algoritmo del 6% del PDF
        resolve({
          id: `TRX-${Math.floor(Math.random() * 10000)}`,
          amount: amount,
          commission: commission,
          net: amount - commission,
          status: 'Liquidado',
        });
      }, 2000); // Simulando API de Stripe
    });
  }
};