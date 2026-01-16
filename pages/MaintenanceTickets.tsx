
import React, { useState } from 'react';
import { 
  Plus, 
  Wrench, 
  Clock, 
  AlertTriangle, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { MaintenanceStatus, Urgency } from '../types';

const MaintenanceTickets: React.FC = () => {
  const [filter, setFilter] = useState('todos');

  const tickets = [
    { 
      id: "M1", 
      condo: "Residencial Jardins", 
      area: "Hall de Entrada", 
      problem: "Lâmpada queimada e infiltração leve no teto.", 
      urgency: Urgency.MEDIA, 
      status: MaintenanceStatus.ABERTO,
      date: "12/10/2023"
    },
    { 
      id: "M2", 
      condo: "Blue Sky Towers", 
      area: "Elevador 02", 
      problem: "Ruído excessivo durante subida.", 
      urgency: Urgency.ALTA, 
      status: MaintenanceStatus.EM_ANDAMENTO,
      date: "11/10/2023"
    },
    { 
      id: "M3", 
      condo: "Condomínio Horizonte", 
      area: "Piscina", 
      problem: "Ajuste de pH e limpeza profunda necessária.", 
      urgency: Urgency.BAIXA, 
      status: MaintenanceStatus.CONCLUIDO,
      date: "10/10/2023"
    }
  ];

  const getUrgencyBadge = (urgency: Urgency) => {
    switch (urgency) {
      case Urgency.ALTA: return <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full ring-1 ring-red-100">ALTA</span>;
      case Urgency.MEDIA: return <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full ring-1 ring-orange-100">MÉDIA</span>;
      case Urgency.BAIXA: return <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full ring-1 ring-blue-100">BAIXA</span>;
    }
  };

  const getStatusLabel = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.ABERTO: return "Aberto";
      case MaintenanceStatus.EM_ANDAMENTO: return "Em Andamento";
      case MaintenanceStatus.CONCLUIDO: return "Concluído";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Ordens de Manutenção</h2>
          <p className="text-slate-500">Monitore chamados e manutenções preventivas.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all">
          <Plus size={20} />
          <span>Abrir Chamado</span>
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['todos', 'abertos', 'andamento', 'concluidos'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              filter === tab ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {tickets.map(ticket => (
          <div key={ticket.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:border-blue-200 transition-all">
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl ${
                    ticket.status === MaintenanceStatus.CONCLUIDO ? 'bg-emerald-50 text-emerald-600' : 
                    ticket.status === MaintenanceStatus.EM_ANDAMENTO ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {ticket.status === MaintenanceStatus.CONCLUIDO ? <CheckCircle2 size={20} /> : <Wrench size={20} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{ticket.condo}</h3>
                    <p className="text-xs text-slate-500 font-medium">{ticket.area}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getUrgencyBadge(ticket.urgency)}
                  <button className="p-1 hover:bg-slate-50 rounded text-slate-400">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-600 line-clamp-2 mb-4 bg-slate-50 p-3 rounded-lg border-l-4 border-blue-400">
                {ticket.problem}
              </p>

              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-xs text-slate-400">
                    <Calendar size={12} className="mr-1" />
                    {ticket.date}
                  </div>
                  <div className="flex items-center text-xs text-slate-400">
                    <Clock size={12} className="mr-1" />
                    ID: #{ticket.id}
                  </div>
                </div>
                <div className="flex items-center">
                   <div className={`w-3 h-3 rounded-full mr-2 ${
                     ticket.status === MaintenanceStatus.CONCLUIDO ? 'bg-emerald-500' : 
                     ticket.status === MaintenanceStatus.EM_ANDAMENTO ? 'bg-blue-500' : 'bg-orange-500'
                   }`}></div>
                   <span className="text-xs font-bold text-slate-700">{getStatusLabel(ticket.status)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceTickets;
