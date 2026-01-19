
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ClipboardList, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black dark:text-white tracking-tighter">OLÁ, {user?.name?.toUpperCase()}</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Resumo do status predial hoje.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/qr-scan')} className="flex-1 sm:flex-none p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:border-blue-500 transition-all shadow-sm cursor-pointer active:scale-95">
            <QrCode size={20} className="text-blue-600" />
            <span className="dark:text-white">SCANNER</span>
          </button>
          <button onClick={() => navigate('/maintenance')} className="flex-1 sm:flex-none p-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 cursor-pointer active:scale-95">
            <Plus size={20} />
            <span>NOVA ORDEM</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard icon={<Building2 size={24} />} label="CONDOMÍNIOS" value="24" color="text-blue-600 bg-blue-50 dark:bg-blue-900/30" />
        <StatCard icon={<ClipboardList size={24} />} label="PENDÊNCIAS" value="08" color="text-orange-600 bg-orange-50 dark:bg-orange-900/30" />
        <StatCard icon={<CheckCircle size={24} />} label="CONCLUÍDOS" value="16" color="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30" />
        <StatCard icon={<AlertTriangle size={24} />} label="ALERTAS" value="03" color="text-red-600 bg-red-50 dark:bg-red-900/30" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-lg dark:text-white flex items-center gap-2 uppercase tracking-tight">
              <TrendingUp className="text-blue-600" size={20} />
              Produtividade
            </h3>
            <span className="text-[10px] font-black px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500">ÚLTIMOS 7 DIAS</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#f1f5f9'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    backgroundColor: theme === 'dark' ? '#1e293b' : '#fff'
                  }} 
                />
                <Area type="monotone" dataKey="checklists" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-black text-lg mb-8 dark:text-white uppercase tracking-tight">Logs Recentes</h3>
          <div className="space-y-6">
            <ActivityItem title="Hall Social" time="10:45" status="LIMPEZA OK" statusColor="text-emerald-500" />
            <ActivityItem title="Garagem G1" time="09:30" status="VISTORIA" statusColor="text-blue-500" />
            <ActivityItem title="Academia" time="08:15" status="MANUTENÇÃO" statusColor="text-orange-500" />
            <ActivityItem title="Piscina" time="07:00" status="LIMPEZA OK" statusColor="text-emerald-500" />
          </div>
          <button onClick={() => navigate('/reports')} className="w-full mt-10 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer uppercase text-xs tracking-widest">
            Histórico Completo
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5 group hover:border-blue-500 transition-all">
    <div className={`p-4 rounded-2xl ${color} group-hover:scale-110 transition-transform`}>{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black dark:text-white tracking-tighter">{value}</p>
    </div>
  </div>
);

const ActivityItem = ({ title, time, status, statusColor }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl group hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
    <div>
      <p className="text-sm font-black dark:text-slate-200">{title}</p>
      <p className={`text-[9px] font-black uppercase tracking-tighter ${statusColor}`}>{status}</p>
    </div>
    <span className="text-xs font-bold text-slate-400">{time}</span>
  </div>
);

export default Dashboard;
