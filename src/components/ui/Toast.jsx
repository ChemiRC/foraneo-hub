import { useAppContext } from '../../context/AppContext';

export default function Toast() {
  const { toast } = useAppContext();
  if (!toast) return null;

  const bgColors = {
    success: 'bg-emerald-600',
    error: 'bg-red-600',
    info: 'bg-indigo-600',
  };

  return (
    <div className={`fixed bottom-6 right-6 ${bgColors[toast.type]} text-white px-6 py-4 rounded-2xl shadow-2xl transform transition-all duration-300 z-50 flex items-center gap-3 animate-fade-in`}>
      <span className="font-bold text-sm tracking-wide">{toast.message}</span>
    </div>
  );
}