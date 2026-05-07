import { useAppContext } from './context/AppContext';
import LoginView from './views/LoginView';
import DashboardLayout from './views/DashboardLayout';

export default function App() {
  const { user } = useAppContext();
  // Si no hay usuario, muestra Login. Si hay, muestra el Dashboard complejo.
  return !user ? <LoginView /> : <DashboardLayout />;
}