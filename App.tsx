
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  ClipboardCheck, 
  Wrench, 
  FileText, 
  Users, 
  Plus, 
  Bell, 
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Menu,
  X,
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

// Contexto de Tema
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | null>(null);
export const useTheme = () => useContext(ThemeContext)!;

// Auth Context for Role Management
interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext)!;

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const login = (role: UserRole) => {
    const mockUser: User = {
      id: 'u1',
      name: role === UserRole.ADMIN ? 'Admin Master' : role === UserRole.SINDICO ? 'Síndica Ana' : 'Zelador Ricardo',
      role: role
    };
    setUser(mockUser);
  };

  const logout = () => setUser(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={40} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">MS APP</h1>
          <p className="text-slate-500 mb-8">Selecione seu perfil para acessar o sistema</p>
          <div className="space-y-3">
            <button onClick={() => login(UserRole.ADMIN)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">Administrador</button>
            <button onClick={() => login(UserRole.SINDICO)} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">Síndico</button>
            <button onClick={() => login(UserRole.OPERACIONAL)} className="w-full py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all">Zelador / Operacional</button>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === UserRole.ADMIN;
  const isOperacional = user.role === UserRole.OPERACIONAL;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthContext.Provider value={{ user, login, logout }}>
        <Router>
          <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
            {/* Mobile/Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around p-4 z-50">
              {!isOperacional && (
                <Link to="/" className="flex flex-col items-center text-slate-500 dark:text-slate-400">
                  <LayoutDashboard size={20} />
                  <span className="text-[10px] mt-1">Painel</span>
                </Link>
              )}
              <Link to="/qr-scan" className={`flex flex-col items-center ${isOperacional ? 'text-blue-600 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                <QrCode size={24} />
                <span className="text-[10px] mt-1">QR Scan</span>
              </Link>
              {!isOperacional && (
                <Link to="/reports" className="flex flex-col items-center text-slate-500 dark:text-slate-400">
                  <FileText size={20} />
                  <span className="text-[10px] mt-1">Relatórios</span>
                </Link>
              )}
              <button onClick={logout} className="flex flex-col items-center text-red-500">
                <LogOut size={20} />
                <span className="text-[10px] mt-1">Sair</span>
              </button>
            </div>

            {/* Desktop Sidebar */}
            {!isOperacional && (
              <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} hidden md:flex flex-col bg-slate-900 dark:bg-black text-white transition-all duration-300`}>
                <div className="p-6 flex items-center justify-between">
                  {isSidebarOpen ? <h1 className="text-xl font-bold text-blue-400">MS APP</h1> : <ClipboardCheck className="text-blue-400" />}
                  <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-800 rounded">
                    <Menu size={20} />
                  </button>
                </div>
                
                <nav className="flex-1 mt-6">
                  <SidebarItem to="/" icon={<LayoutDashboard size={22} />} label="Painel Geral" isOpen={isSidebarOpen} />
                  <SidebarItem to="/qr-scan" icon={<QrCode size={22} />} label="Gestão QR" isOpen={isSidebarOpen} />
                  {isAdmin && <SidebarItem to="/condos" icon={<Building2 size={22} />} label="Condomínios" isOpen={isSidebarOpen} />}
                  <SidebarItem to="/maintenance" icon={<Wrench size={22} />} label="Manutenção" isOpen={isSidebarOpen} />
                  <SidebarItem to="/reports" icon={<FileText size={22} />} label="Relatórios" isOpen={isSidebarOpen} />
                </nav>

                <div className="p-4 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    {isSidebarOpen && (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs uppercase">{user.name.slice(0,2)}</div>
                        <div className="min-0">
                          <p className="text-xs font-bold truncate">{user.name}</p>
                          <p className="text-[10px] text-slate-400">{user.role}</p>
                        </div>
                      </div>
                    )}
                    <button onClick={logout} className="p-2 hover:bg-red-500/20 text-red-400 rounded transition-colors" title="Sair">
                      <LogOut size={18} />
                    </button>
                  </div>
                </div>
              </aside>
            )}

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 z-10">
                <div className="flex items-center gap-2">
                  {isOperacional && <ShieldCheck size={20} className="text-blue-600 md:hidden" />}
                  <h2 className="font-bold text-slate-800 dark:text-slate-100 truncate">
                    {isOperacional ? `Olá, ${user.name}` : 'Sistema de Gestão'}
                  </h2>
                </div>
                
                <div className="flex items-center space-x-2 md:space-x-4">
                  {/* Tema Toggle */}
                  <button 
                    onClick={toggleTheme}
                    className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center"
                    title={theme === 'light' ? 'Ativar Modo Noturno' : 'Ativar Modo Diurno'}
                  >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                  </button>

                  <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-1.5">
                    <UserIcon size={14} className="text-blue-600 mr-2" />
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{user.role}</span>
                  </div>
                  
                  {isOperacional && (
                    <button onClick={logout} className="flex items-center space-x-2 text-red-500 font-bold text-sm bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                      <LogOut size={16} />
                      <span className="hidden sm:inline">Sair</span>
                    </button>
                  )}

                  <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
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
        </Router>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
};

const SidebarItem: React.FC<{ to: string, icon: React.ReactNode, label: string, isOpen: boolean }> = ({ to, icon, label, isOpen }) => (
  <Link to={to} className="flex items-center px-6 py-4 hover:bg-slate-800 dark:hover:bg-slate-900 text-slate-300 hover:text-white transition-colors">
    {icon}
    {isOpen && <span className="ml-4 font-medium truncate">{label}</span>}
  </Link>
);

export default App;
