
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ClipboardList, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  Clock,
  Plus,
  QrCode,
  AlertTriangle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth, useTheme } from '../App';
import { UserRole } from '../types';

const data = [
  { name: 'Seg', checklists: 12 },
  { name: 'Ter', checklists: 15 },
  { name: 'Qua', checklists: 10 },
  { name: 'Qui', checklists: 18 },
  { name: 'Sex', checklists: 20 },
  { name: 'Sab', checklists: 8 },
  { name: 'Dom', checklists: 5 },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Olá, {user?.name}</h2>
          <p className="text-slate-500 dark:text-slate-400">Aqui está o resumo do dia.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/qr-scan')} className="p-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
            <QrCode size={18} />
            <span className="hidden sm:inline">Scanner</span>
          </button>
          <button onClick={() => navigate('/condos')} className="p-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg">
            <Plus size={18} />
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Building2 className="text-blue-500" />} label="Condomínios" value="24" color="bg-blue-50 dark:bg-blue-900/20" />
        <StatCard icon={<ClipboardList className="text-orange-500" />} label="Pendentes" value="08" color="bg-orange-50 dark:bg-orange-900/20" />
        <StatCard icon={<CheckCircle className="text-emerald-500" />} label="Concluídos" value="16" color="bg-emerald-50 dark:bg-emerald-900/20" />
        <StatCard icon={<AlertTriangle className="text-red-500" />} label="Alertas" value="03" color="bg-red-50 dark:bg-red-900/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-lg mb-6 dark:text-white">Atividade Semanal</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip />
                <Area type="monotone" dataKey="checklists" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-lg mb-6 dark:text-white">Últimos Registros</h3>
          <div className="space-y-4">
            <ActivityItem title="Hall Social" time="10:45" status="Limpeza OK" />
            <ActivityItem title="Garagem G1" time="09:30" status="Vistoria" />
            <ActivityItem title="Academia" time="08:15" status="Manutenção" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black dark:text-white">{value}</p>
    </div>
  </div>
);

const ActivityItem = ({ title, time, status }) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
    <div>
      <p className="text-sm font-bold dark:text-white">{title}</p>
      <p className="text-[10px] text-slate-400 uppercase">{status}</p>
    </div>
    <span className="text-xs font-medium text-slate-400">{time}</span>
  </div>
);

export default Dashboard;
