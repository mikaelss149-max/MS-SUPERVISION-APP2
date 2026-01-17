
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  ClipboardCheck, 
  Wrench, 
  FileText, 
  Plus, 
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

// Theme Context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | null>(null);
export const useTheme = () => useContext(ThemeContext)!;

// Auth Context
interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => useContext(AuthContext)!;

const AppContent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isAdmin = user?.role === UserRole.ADMIN;
  const isOperacional = user?.role === UserRole.OPERACIONAL;

  // Fecha o menu lateral automaticamente em telas menores ao navegar
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      {/* Mobile/Bottom Nav - Aumentado o Z-Index para garantir clique */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around p-4 z-[100] shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {!isOperacional && (
          <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-blue-600' : 'text-slate-500 dark:text-slate-400'}`}>
            <LayoutDashboard size={20} />
            <span className="text-[10px] mt-1 font-medium">Painel</span>
          </Link>
        )}
        <Link to="/qr-scan" className={`flex flex-col items-center ${location.pathname === '/qr-scan' ? 'text-blue-600 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
          <QrCode size={24} />
          <span className="text-[10px] mt-1">QR Scan</span>
        </Link>
        {!isOperacional && (
          <Link to="/maintenance" className={`flex flex-col items-center ${location.pathname === '/maintenance' ? 'text-blue-600' : 'text-slate-500 dark:text-slate-400'}`}>
            <Wrench size={20} />
            <span className="text-[10px] mt-1 font-medium">Obras</span>
          </Link>
        )}
        <button onClick={logout} className="flex flex-col items-center text-red-500 active:scale-95 transition-transform">
          <LogOut size={20} />
          <span className="text-[10px] mt-1">Sair</span>
        </button>
      </div>

      {/* Desktop Sidebar */}
      {!isOperacional && (
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} hidden md:flex flex-col bg-slate-900 dark:bg-black text-white transition-all duration-300 z-50`}>
          <div className="p-6 flex items-center justify-between">
            {isSidebarOpen ? <h1 className="text-xl font-black text-blue-400 tracking-tighter">MS APP</h1> : <ClipboardCheck className="text-blue-400" />}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
              <Menu size={20} />
            </button>
          </div>
          
          <nav className="flex-1 mt-6 overflow-y-auto scrollbar-hide">
            <SidebarItem to="/" icon={<LayoutDashboard size={22} />} label="Painel Geral" isOpen={isSidebarOpen} active={location.pathname === '/'} />
            <SidebarItem to="/qr-scan" icon={<QrCode size={22} />} label="Gestão QR" isOpen={isSidebarOpen} active={location.pathname === '/qr-scan'} />
            {isAdmin && <SidebarItem to="/condos" icon={<Building2 size={22} />} label="Condomínios" isOpen={isSidebarOpen} active={location.pathname === '/condos'} />}
            <SidebarItem to="/maintenance" icon={<Wrench size={22} />} label="Manutenção" isOpen={isSidebarOpen} active={location.pathname === '/maintenance'} />
            <SidebarItem to="/reports" icon={<FileText size={22} />} label="Relatórios" isOpen={isSidebarOpen} active={location.pathname === '/reports'} />
          </nav>

          <div className="p-4 border-t border-slate-800">
            {isSidebarOpen && (
              <div className="flex items-center justify-between mb-4 bg-slate-800/50 p-2 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-xs uppercase">{user?.name.slice(0,2)}</div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{user?.name}</p>
                    <p className="text-[10px] text-slate-400">{user?.role}</p>
                  </div>
                </div>
              </div>
            )}
            <button onClick={logout} className={`w-full flex items-center ${isSidebarOpen ? 'justify-start space-x-3 px-3' : 'justify-center'} py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all`}>
              <LogOut size={20} />
              {isSidebarOpen && <span className="text-sm font-bold">Sair do Sistema</span>}
            </button>
          </div>
        </aside>
      )}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 z-40">
          <div className="flex items-center gap-3">
            {isOperacional && <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600"><ShieldCheck size={20} /></div>}
            <h2 className="font-bold text-slate-800 dark:text-slate-100 truncate text-sm md:text-base">
              {isOperacional ? `Zeladoria: ${user?.name}` : 'Painel de Gestão Predial'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors active:scale-90"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5">
              <UserIcon size={14} className="text-blue-600 mr-2" />
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{user?.role}</span>
            </div>
            
            <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-8 scroll-smooth">
          <Routes>
            <Route path="/" element={isOperacional ? <Navigate to="/qr-scan" /> : <Dashboard />} />
            <Route path="/condos" element={isAdmin ? <CondoManagement /> : <Navigate to="/" />} />
            <Route path="/qr-scan" element={<QRScanner />} />
            <Route path="/checklist/run/:condoId" element={<ChecklistRunner />} />
            <Route path="/maintenance" element={<MaintenanceTickets />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const login = (role: UserRole) => {
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: role === UserRole.ADMIN ? 'Admin Master' : role === UserRole.SINDICO ? 'Síndica Ana' : 'Zelador Ricardo',
      role: role
    };
    setUser(mockUser);
  };

  const logout = () => setUser(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-2xl text-center transform transition-all">
          <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <ShieldCheck size={48} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">MS APP</h1>
          <p className="text-slate-500 mb-10 font-medium">Controle de Acesso</p>
          <div className="space-y-4">
            <button onClick={() => login(UserRole.ADMIN)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 active:scale-95 transition-all shadow-lg">Administrador</button>
            <button onClick={() => login(UserRole.SINDICO)} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200">Síndico</button>
            <button onClick={() => login(UserRole.OPERACIONAL)} className="w-full py-4 border-2 border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 active:scale-95 transition-all">Zelador / Operacional</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthContext.Provider value={{ user, login, logout }}>
        <Router>
          <AppContent />
        </Router>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
};

const SidebarItem: React.FC<{ to: string, icon: React.ReactNode, label: string, isOpen: boolean, active: boolean }> = ({ to, icon, label, isOpen, active }) => (
  <Link to={to} className={`flex items-center px-6 py-4 transition-all ${
    active 
      ? 'bg-blue-600 text-white' 
      : 'text-slate-400 hover:text-white hover:bg-slate-800'
  }`}>
    <div className={`${active ? 'scale-110' : ''} transition-transform`}>{icon}</div>
    {isOpen && <span className="ml-4 font-bold text-sm tracking-tight truncate">{label}</span>}
  </Link>
);

export default App;
