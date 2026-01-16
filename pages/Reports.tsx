
import React from 'react';
import { 
  FileText, 
  Download, 
  Share2, 
  Calendar, 
  ChevronRight, 
  FileSearch,
  Users,
  MessageCircle,
  Clock
} from 'lucide-react';

const Reports: React.FC = () => {
  const reports = [
    { title: "Relatório Mensal - Outubro", date: "01/10 - 31/10", type: "Consolidado", size: "2.4 MB" },
    { title: "Vistoria Semanal - Jardins", date: "23/10 - 29/10", type: "Checklist", size: "1.1 MB" },
    { title: "Não Conformidades Recorrentes", date: "Últimos 90 dias", type: "Analytics", size: "850 KB" },
    { title: "Auditoria de Manutenção", date: "Outubro/2023", type: "Auditoria", size: "1.8 MB" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Relatórios e Histórico</h2>
          <p className="text-slate-500">Acesse dados históricos e gere documentos oficiais.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FileSearch size={20} className="text-blue-500" />
              Filtrar Histórico
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Período</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Selecionar data" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Condomínio</label>
                <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                  <option>Todos os condomínios</option>
                  <option>Residencial Jardins</option>
                  <option>Blue Sky Towers</option>
                </select>
              </div>
            </div>
            <button className="w-full mt-6 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
              Gerar Relatório Customizado
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Clock size={20} className="text-blue-500" />
              Gerados Recentemente
            </h3>
            {reports.map((report, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:border-blue-200 transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-red-50 text-red-500 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{report.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center mt-1">
                      <Calendar size={10} className="mr-1" /> {report.date} • {report.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                   <button className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all" title="Enviar via WhatsApp">
                    <MessageCircle size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Baixar PDF">
                    <Download size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg shadow-blue-200">
            <h3 className="font-bold text-lg mb-4">Exportação Rápida</h3>
            <p className="text-blue-100 text-sm mb-6">Gere um PDF completo da situação atual de todos os seus empreendimentos em um clique.</p>
            <div className="space-y-3">
              <button className="w-full py-3 bg-white text-blue-700 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-50 transition-colors">
                <Download size={18} />
                <span>Download PDF Completo</span>
              </button>
              <button className="w-full py-3 bg-white/10 text-white rounded-xl font-bold border border-white/20 flex items-center justify-center space-x-2 hover:bg-white/20 transition-colors">
                <Share2 size={18} />
                <span>Compartilhar via E-mail</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Métricas do Mês</h3>
            <div className="space-y-4">
              <MetricItem label="Vistorias Realizadas" value="482" />
              <MetricItem label="Não Conformidades" value="42" />
              <MetricItem label="Tempo Médio Reparo" value="2.4 dias" />
              <MetricItem label="Eficiência da Limpeza" value="94%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="font-bold text-slate-900">{value}</span>
  </div>
);

export default Reports;
