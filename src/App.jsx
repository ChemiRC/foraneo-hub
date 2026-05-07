import { useAppContext } from './context/AppContext';
import LoginView from './views/LoginView';
import DashboardLayout from './views/DashboardLayout';

export default function App() {
  const { user } = useAppContext();
  // El enrutamiento se maneja puramente por estado, asegurando 0 errores en GitHub Pages.
  return !user ? <LoginView /> : <DashboardLayout />;
}