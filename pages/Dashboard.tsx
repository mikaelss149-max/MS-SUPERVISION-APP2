
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
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { useAuth } from '../App';
import { UserRole } from '../types';

const data = [
  { name: 'Seg', checklists: 12, alertas: 2 },
  { name: 'Ter', checklists: 15, alertas: 5 },
  { name: 'Qua', checklists: 10, alertas: 3 },
  { name: 'Qui', checklists: 18, alertas: 1 },
  { name: 'Sex', checklists: 20, alertas: 6 },
  { name: 'Sab', checklists: 8, alertas: 2 },
  { name: 'Dom', checklists: 5, alertas: 0 },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Olá, {user?.name}</h2>
          <p className="text-slate-500">
            {isAdmin ? 'Visão global de todos os condomínios.' : 'Resumo operacional do seu condomínio.'}
          </p>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={() => navigate('/qr-scan')}
            className="bg-white border-2 border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-50 transition-all"
          >
            <QrCode size={18} />
            <span>Ver QR Codes</span>
          </button>
          <button 
            onClick={() => navigate('/condos')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-100"
          >
            <Plus size={18} />
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Building2 className="text-blue-600" />} 
          label={isAdmin ? "Condomínios Ativos" : "Blocos Atendidos"} 
          value={isAdmin ? "24" : "04"} 
          trend={isAdmin ? "+2 novos" : "100% ativos"}
          color="bg-blue-50"
        />
        <StatCard 
          icon={<ClipboardList className="text-orange-600" />} 
          label="Limpezas Pendentes" 
          value="08" 
          trend="Prioridade alta"
          color="bg-orange-50"
        />
        <StatCard 
          icon={<CheckCircle className="text-emerald-600" />} 
          label="Concluídos Hoje" 
          value="16" 
          trend="Dentro da meta"
          color="bg-emerald-50"
        />
        <StatCard 
          icon={<AlertTriangle className="text-red-600" />} 
          label="Zonas de Risco" 
          value="03" 
          trend="Atraso de +4h"
          color="bg-red-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <TrendingUp size={20} className="text-blue-500" />
                Performance Operacional
              </h3>
              <select className="bg-slate-50 border-0 text-xs font-bold rounded-lg px-3 py-1.5 outline-none">
                <option>Últimos 7 dias</option>
                <option>Últimos 30 dias</option>
              </select>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorCheck" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)'}}
                  />
                  <Area type="monotone" dataKey="checklists" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorCheck)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-l-4 border-l-red-500">
              <h4 className="font-bold text-red-600 mb-4 flex items-center gap-2">
                <AlertCircle size={18} />
                Áreas sem Limpeza (Atrasadas)
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-2xl">
                  <span className="text-xs font-bold text-slate-700">Garagem G1</span>
                  <span className="text-[10px] font-black text-red-500">6h ATRASO</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-2xl">
                  <span className="text-xs font-bold text-slate-700">Hall Entrada</span>
                  <span className="text-[10px] font-black text-red-500">4h ATRASO</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
              <h4 className="font-bold text-emerald-600 mb-4 flex items-center gap-2">
                <CheckCircle size={18} />
                Eficiência Mensal
              </h4>
              <div className="flex items-end space-x-2">
                <span className="text-4xl font-black text-slate-900">98.2%</span>
                <span className="text-xs font-bold text-emerald-500 mb-1.5">+2.4% vs mês ant.</span>
              </div>
              <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[98%]"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
              <Clock size={20} className="text-blue-500" />
              Logs de QR Code
            </h3>
            <button className="text-[10px] font-bold text-blue-600 hover:underline">VER TODOS</button>
          </div>
          <div className="space-y-6">
            <RecentActivity 
              title="Garagem Subsolo" 
              time="Agora" 
              status="Limpeza via QR" 
              user="Ricardo Santos" 
              statusColor="text-emerald-500 bg-emerald-50"
            />
            <RecentActivity 
              title="Academia" 
              time="Há 12 min" 
              status="Checklist Semanal" 
              user="Maria Operacional" 
              statusColor="text-blue-500 bg-blue-50"
            />
            <RecentActivity 
              title="Hall Social" 
              time="Há 45 min" 
              status="Limpeza via QR" 
              user="Ricardo Santos" 
              statusColor="text-emerald-500 bg-emerald-50"
            />
            <RecentActivity 
              title="Elevador de Serviço" 
              time="Há 1h" 
              status="Manutenção Preventiva" 
              user="Técnico Externo" 
              statusColor="text-orange-500 bg-orange-50"
            />
            <RecentActivity 
              title="Portaria Central" 
              time="Há 3h" 
              status="Ocorrência via App" 
              user="João Síndico" 
              statusColor="text-red-500 bg-red-50"
            />
          </div>
          <button className="w-full mt-8 py-4 text-sm font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors border border-slate-100">
            Baixar Histórico do Dia (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, trend: string, color: string }> = ({ icon, label, value, trend, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all group hover:shadow-xl hover:shadow-blue-50/50">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
    </div>
    <div className="space-y-1">
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline space-x-2">
        <h4 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h4>
        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{trend}</span>
      </div>
    </div>
  </div>
);

const RecentActivity: React.FC<{ title: string, time: string, status: string, user: string, statusColor: string }> = ({ title, time, status, user, statusColor }) => (
  <div className="flex items-start space-x-4">
    <div className="mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-50"></div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-baseline">
        <p className="text-sm font-bold text-slate-900 truncate tracking-tight">{title}</p>
        <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap ml-2">{time}</span>
      </div>
      <p className="text-xs text-slate-500 mt-0.5 font-medium">{user}</p>
      <div className="flex mt-2">
        <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${statusColor}`}>
          {status}
        </span>
      </div>
    </div>
  </div>
);

export default Dashboard;
