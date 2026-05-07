import { createContext, useState, useContext } from 'react';
import { mockApi } from '../services/mockApi';

const AppContext = createContext();

// 👇 ESTA ES LA LÍNEA QUE VITE NO ENCONTRABA 👇
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const login = async (role) => {
    setIsLoading(true);
    try {
      const userData = await mockApi.login(role);
      setUser(userData);
      setCurrentView('mapa');
      showToast(`Autenticado vía Firebase Auth: ${userData.name}`, 'success');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentView('login');
    showToast('Sesión cerrada de manera segura', 'info');
  };

  const navigate = (view) => setCurrentView(view);

  return (
    <AppContext.Provider value={{ user, currentView, isLoading, toast, login, logout, navigate, showToast }}>
      {children}
    </AppContext.Provider>
  );
};