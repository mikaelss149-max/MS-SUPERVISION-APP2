
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
  const navigate = useNavigate();

  const isOperacional = user?.role === UserRole.OPERACIONAL;
  const isAdmin = user?.role === UserRole.ADMIN;

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
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      {!isOperacional && (
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} hidden md:flex flex-col bg-slate-900 dark:bg-black text-white transition-all duration-300 z-50 shrink-0 shadow-2xl`}>
          <div className="p-6 flex items-center justify-between">
            {isSidebarOpen ? <h1 className="text-xl font-black text-blue-400 tracking-tighter">MS APP</h1> : <ShieldCheck className="text-blue-400" />}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
              <Menu size={20} />
            </button>
          </div>
          <nav className="flex-1 mt-4 overflow-y-auto custom-scrollbar">
            <SidebarItem to="/" icon={<LayoutDashboard size={22} />} label="Início" isOpen={isSidebarOpen} active={location.pathname === '/'} />
            <SidebarItem to="/qr-scan" icon={<QrCode size={22} />} label="QR Scanner" isOpen={isSidebarOpen} active={location.pathname === '/qr-scan'} />
            {isAdmin && <SidebarItem to="/condos" icon={<Building2 size={22} />} label="Condomínios" isOpen={isSidebarOpen} active={location.pathname === '/condos'} />}
            <SidebarItem to="/maintenance" icon={<Wrench size={22} />} label="Manutenção" isOpen={isSidebarOpen} active={location.pathname === '/maintenance'} />
            <SidebarItem to="/reports" icon={<FileText size={22} />} label="Relatórios" isOpen={isSidebarOpen} active={location.pathname === '/reports'} />
          </nav>
          <div className="p-4 border-t border-slate-800">
            <button onClick={() => logout()} className="w-full flex items-center justify-center p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer">
              <LogOut size={20} />
              {isSidebarOpen && <span className="ml-3 font-bold">Encerrar</span>}
            </button>
          </div>
        </aside>
      )}

      {/* Area Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-40 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            {isOperacional && <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400"><ShieldCheck size={20} /></div>}
            <h2 className="font-bold text-slate-800 dark:text-slate-100 truncate text-sm md:text-base uppercase tracking-tight">
              {isOperacional ? `Olá, ${user?.name}` : 'Gestão e Manutenção'}
            </h2>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button onClick={toggleTheme} className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer active:scale-90">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            {isOperacional && (
              <button onClick={() => logout()} className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all cursor-pointer">
                <LogOut size={22} />
              </button>
            )}
            <button className="relative p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-8 bg-slate-50 dark:bg-slate-950">
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

        {/* Navegação Mobile Inferior - z-index alto para não ser bloqueada */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around items-center p-3 z-[60] shadow-[0_-4px_15px_rgba(0,0,0,0.08)]">
          {!isOperacional && (
            <button onClick={() => navigate('/')} className={`p-3 rounded-2xl transition-all ${location.pathname === '/' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-400'}`}>
              <LayoutDashboard size={26} />
            </button>
          )}
          <button onClick={() => navigate('/qr-scan')} className={`p-3 rounded-2xl transition-all ${location.pathname === '/qr-scan' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-400'}`}>
            <QrCode size={26} />
          </button>
          {!isOperacional && (
            <button onClick={() => navigate('/maintenance')} className={`p-3 rounded-2xl transition-all ${location.pathname === '/maintenance' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'text-slate-400'}`}>
              <Wrench size={26} />
            </button>
          )}
          <button onClick={() => logout()} className="p-3 text-red-500 active:scale-90 transition-all">
            <LogOut size={26} />
          </button>
        </div>
      </div>
    </div>
  );
};

const SidebarItem: React.FC<{ to: string; icon: React.ReactNode; label: string; isOpen: boolean; active: boolean }> = ({ to, icon, label, isOpen, active }) => (
  <Link to={to} className={`flex items-center px-6 py-4 transition-all duration-200 ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
    <div className={`${active ? 'scale-110' : ''}`}>{icon}</div>
    {isOpen && <span className="ml-4 font-bold text-sm tracking-tight truncate uppercase">{label}</span>}
  </Link>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const login = (role: UserRole) => {
    const newUser = { id: Date.now().toString(), name: role === UserRole.OPERACIONAL ? 'Operador Ricardo' : 'Administrador(a)', role };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 text-center shadow-2xl transition-all border border-slate-200 dark:border-slate-700">
          <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <ShieldCheck size={48} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">MS APP</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">Gestão de Checklists Prediais</p>
          <div className="space-y-4">
            <button onClick={() => login(UserRole.ADMIN)} className="w-full py-4.5 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl cursor-pointer">ADMINISTRADOR</button>
            <button onClick={() => login(UserRole.SINDICO)} className="w-full py-4.5 bg-blue-600 text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-500/20 cursor-pointer">SÍNDICO</button>
            <button onClick={() => login(UserRole.OPERACIONAL)} className="w-full py-4.5 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer">ZELADOR / OPERACIONAL</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light') }}>
      <AuthContext.Provider value={{ user, login, logout }}>
        <Router>
          <AppContent />
        </Router>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
