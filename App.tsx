
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  ClipboardCheck, 
  Wrench, 
  FileText, 
  Bell, 
  Menu,
  QrCode,
  LogOut,
  ShieldCheck,
  User as UserIcon,
  Sun,
  Moon
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import CondoManagement from './pages/CondoManagement';
import ChecklistRunner from './pages/ChecklistRunner';
import MaintenanceTickets from './pages/MaintenanceTickets';
import Reports from './pages/Reports';
import QRScanner from './pages/QRScanner';
import { UserRole, User } from './types';

// Contextos
interface ThemeContextType { theme: 'light' | 'dark'; toggleTheme: () => void; }
const ThemeContext = createContext<ThemeContextType | null>(null);
export const useTheme = () => useContext(ThemeContext)!;

interface AuthContextType { user: User | null; login: (role: UserRole) => void; logout: () => void; }
const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => useContext(AuthContext)!;

const AppContent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isOperacional = user?.role === UserRole.OPERACIONAL;
  const isAdmin = user?.role === UserRole.ADMIN;

  // Ajuste de menu lateral mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      {/* Sidebar Desktop */}
      {!isOperacional && (
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} hidden md:flex flex-col bg-slate-900 dark:bg-black text-white transition-all duration-300 z-50 shrink-0`}>
          <div className="p-6 flex items-center justify-between">
            {isSidebarOpen ? <h1 className="text-xl font-black text-blue-400">MS APP</h1> : <ShieldCheck className="text-blue-400" />}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-800 rounded-lg">
              <Menu size={20} />
            </button>
          </div>
          <nav className="flex-1 mt-4 overflow-y-auto">
            <SidebarItem to="/" icon={<LayoutDashboard size={22} />} label="Painel" isOpen={isSidebarOpen} active={location.pathname === '/'} />
            <SidebarItem to="/qr-scan" icon={<QrCode size={22} />} label="Gestão QR" isOpen={isSidebarOpen} active={location.pathname === '/qr-scan'} />
            {isAdmin && <SidebarItem to="/condos" icon={<Building2 size={22} />} label="Condomínios" isOpen={isSidebarOpen} active={location.pathname === '/condos'} />}
            <SidebarItem to="/maintenance" icon={<Wrench size={22} />} label="Manutenção" isOpen={isSidebarOpen} active={location.pathname === '/maintenance'} />
            <SidebarItem to="/reports" icon={<FileText size={22} />} label="Relatórios" isOpen={isSidebarOpen} active={location.pathname === '/reports'} />
          </nav>
          <div className="p-4 border-t border-slate-800">
            <button onClick={logout} className="w-full flex items-center justify-center p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
              <LogOut size={20} />
              {isSidebarOpen && <span className="ml-3 font-bold">Sair</span>}
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-40 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 truncate">
              {isOperacional ? `Zelador: ${user?.name}` : 'Gestão Predial'}
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={toggleTheme} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            {isOperacional && (
              <button onClick={logout} className="p-2 text-red-500 hover:bg-red-50 rounded-full" title="Sair">
                <LogOut size={22} />
              </button>
            )}
            <div className="hidden sm:block text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">{user?.role}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <Routes>
            <Route path="/" element={isOperacional ? <Navigate to="/qr-scan" /> : <Dashboard />} />
            <Route path="/condos" element={isAdmin ? <CondoManagement /> : <Navigate to="/" />} />
            <Route path="/qr-scan" element={<QRScanner />} />
            <Route path="/checklist/run/:condoId" element={<ChecklistRunner />} />
            <Route path="/maintenance" element={<MaintenanceTickets />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Mobile Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around p-3 z-50">
          {!isOperacional && (
            <Link to="/" className={`p-2 rounded-xl ${location.pathname === '/' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-400'}`}>
              <LayoutDashboard size={24} />
            </Link>
          )}
          <Link to="/qr-scan" className={`p-2 rounded-xl ${location.pathname === '/qr-scan' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-400'}`}>
            <QrCode size={24} />
          </Link>
          {!isOperacional && (
            <Link to="/maintenance" className={`p-2 rounded-xl ${location.pathname === '/maintenance' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-400'}`}>
              <Wrench size={24} />
            </Link>
          )}
          {!isOperacional && (
             <Link to="/reports" className={`p-2 rounded-xl ${location.pathname === '/reports' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-400'}`}>
              <FileText size={24} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const SidebarItem: React.FC<{ to: string; icon: React.ReactNode; label: string; isOpen: boolean; active: boolean }> = ({ to, icon, label, isOpen, active }) => (
  <Link to={to} className={`flex items-center px-6 py-4 transition-all ${active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
    {icon}
    {isOpen && <span className="ml-4 font-bold text-sm truncate">{label}</span>}
  </Link>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const login = (role: UserRole) => {
    setUser({ id: '1', name: role === UserRole.OPERACIONAL ? 'Ricardo' : 'Ana', role });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2rem] p-10 text-center shadow-2xl">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={40} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">MS APP</h1>
          <p className="text-slate-500 mb-8">Acesso ao Sistema</p>
          <div className="space-y-4">
            <button onClick={() => login(UserRole.ADMIN)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold active:scale-95 transition-all">Administrador</button>
            <button onClick={() => login(UserRole.SINDICO)} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold active:scale-95 transition-all">Síndico</button>
            <button onClick={() => login(UserRole.OPERACIONAL)} className="w-full py-4 border-2 border-slate-200 text-slate-700 rounded-2xl font-bold active:scale-95 transition-all">Zelador</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light') }}>
      <AuthContext.Provider value={{ user, login, logout: () => setUser(null) }}>
        <Router>
          <AppContent />
        </Router>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
