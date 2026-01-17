
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  QrCode, 
  Camera, 
  CheckCircle, 
  MapPin, 
  History, 
  Image as ImageIcon,
  Save,
  Printer,
  Search,
  Clock,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '../App';
import { DEFAULT_AREAS } from '../constants';
import { UserRole } from '../types';

const QRScanner: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdminOrSindico = user?.role === UserRole.ADMIN || user?.role === UserRole.SINDICO;

  // State para o Operacional
  const [step, setStep] = useState<'scan' | 'form' | 'success'>('scan');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [observation, setObservation] = useState('');

  // State para Admin (Gestão de QRs)
  const [searchTerm, setSearchTerm] = useState('');

  const cleaningLogs = [
    { id: '1', area: 'Garagem G1', user: 'Ricardo Santos', time: '10:45', status: 'Concluído', date: 'Hoje' },
    { id: '2', area: 'Hall Social', user: 'Ricardo Santos', time: '09:15', status: 'Concluído', date: 'Hoje' },
    { id: '3', area: 'Academia', user: 'Maria Silva', time: '08:30', status: 'Concluído', date: 'Hoje' },
  ];

  const handleScanSimulation = (area: string) => {
    setSelectedArea(area);
    setStep('form');
  };

  const handleFinish = () => {
    setStep('success');
    setTimeout(() => {
      setStep('scan');
      setObservation('');
      setSelectedArea(null);
    }, 2000);
  };

  const handlePrintQR = (area: string) => {
    // Evita comportamentos inesperados ao clicar em elementos de simulação
    console.log(`Imprimindo QR para: ${area}`);
    alert(`Comando enviado para a impressora: QR Code de identificação para "${area}".`);
  };

  if (isAdminOrSindico) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 md:pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tighter uppercase">Gestão de Identificadores</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Administração de ambientes e rastreio de zeladoria.</p>
          </div>
          <button 
            onClick={() => alert("Gerando lote completo para PDF...")}
            className="bg-slate-900 dark:bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-800 dark:hover:bg-blue-700 active:scale-95 transition-all shadow-lg"
          >
            <Printer size={18} />
            <span>Imprimir Lote Geral</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <h3 className="font-bold text-lg dark:text-slate-100 flex items-center gap-2">
                  <QrCode size={20} className="text-blue-500" />
                  Ambientes Registrados
                </h3>
                <div className="relative w-full sm:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Filtrar ambiente..." 
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-200 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {DEFAULT_AREAS.filter(a => a.toLowerCase().includes(searchTerm.toLowerCase())).map(area => (
                  <div key={area} className="p-4 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl flex items-center justify-between group hover:border-blue-300 dark:hover:border-blue-600 transition-all">
                    <div className="flex items-center space-x-3 truncate">
                      <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                        <QrCode size={20} className="text-slate-600 dark:text-slate-300 group-hover:text-blue-600" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{area}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.preventDefault(); handlePrintQR(area); }}
                      className="p-2.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-all active:scale-90 shrink-0"
                    >
                      <Printer size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-lg dark:text-slate-100 mb-6 flex items-center gap-2">
                <History size={20} className="text-emerald-500" />
                Logs em Tempo Real
              </h3>
              <div className="space-y-5">
                {cleaningLogs.map(log => (
                  <div key={log.id} className="relative pl-6 pb-6 border-l-2 border-slate-100 dark:border-slate-800 last:pb-0 last:border-0">
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 shadow-md"></div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{log.area}</span>
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">{log.time}</span>
                      </div>
                      <div className="flex items-center text-[11px] text-slate-500 dark:text-slate-400 font-semibold space-x-2">
                        <UserIcon size={12} className="text-blue-500" />
                        <span className="truncate">{log.user}</span>
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span>
                        <span className="text-emerald-600 font-bold uppercase tracking-tighter">OK</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-4 text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-2xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all uppercase tracking-widest active:scale-95">
                Extrair Relatório Completo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VISÃO OPERACIONAL ---
  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col pb-24 md:pb-8">
      {step === 'scan' && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95 duration-300 px-4">
          <div className="relative">
            <div className="w-72 h-72 border-4 border-blue-500 rounded-[2.5rem] flex items-center justify-center bg-white dark:bg-slate-900 shadow-2xl relative overflow-hidden transform group-active:scale-95 transition-transform">
              <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
              <QrCode size={140} className="text-blue-600 opacity-20" />
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)] animate-[scan_2s_infinite]"></div>
              <Camera size={56} className="absolute text-blue-600" />
            </div>
            {/* Esquinas do Scanner */}
            <div className="absolute -top-3 -left-3 w-10 h-10 border-t-4 border-l-4 border-blue-600 rounded-tl-2xl"></div>
            <div className="absolute -top-3 -right-3 w-10 h-10 border-t-4 border-r-4 border-blue-600 rounded-tr-2xl"></div>
            <div className="absolute -bottom-3 -left-3 w-10 h-10 border-b-4 border-l-4 border-blue-600 rounded-bl-2xl"></div>
            <div className="absolute -bottom-3 -right-3 w-10 h-10 border-b-4 border-r-4 border-blue-600 rounded-br-2xl"></div>
          </div>

          <div className="text-center space-y-3 px-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tighter uppercase">Leitura de Área</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Escaneie o QR Code fixado no ambiente para registrar sua limpeza.</p>
          </div>

          <div className="w-full space-y-4 pt-4">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase text-center tracking-widest">Atalhos de Simulação</p>
            <div className="grid grid-cols-2 gap-3 px-2">
              {DEFAULT_AREAS.slice(0, 4).map(area => (
                <button 
                  key={area}
                  onClick={() => handleScanSimulation(area)}
                  className="p-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black uppercase tracking-tight hover:border-blue-500 dark:hover:border-blue-500 transition-all text-slate-700 dark:text-slate-200 shadow-sm active:scale-95"
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 'form' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500 px-2">
          <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200 dark:shadow-none">
            <div className="flex items-center space-x-3 mb-3">
              <MapPin size={24} className="text-blue-200" />
              <span className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Check-in Realizado</span>
            </div>
            <h2 className="text-4xl font-black tracking-tighter">{selectedArea}</h2>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            <div className="space-y-5">
              <div className="flex items-center space-x-4 p-5 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-100 dark:border-emerald-800 rounded-2xl shadow-inner">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                  <CheckCircle size={20} />
                </div>
                <span className="font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-tight text-sm">Registro de Conformidade</span>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Anexar Fotos (Evidência)</label>
                <div className="grid grid-cols-2 gap-4">
                  <button className="aspect-square border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-all bg-slate-50 dark:bg-slate-800 active:scale-95">
                    <Camera size={32} />
                    <span className="text-[10px] mt-2 font-black uppercase">Câmera</span>
                  </button>
                  <button className="aspect-square border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-all bg-slate-50 dark:bg-slate-800 active:scale-95">
                    <ImageIcon size={32} />
                    <span className="text-[10px] mt-2 font-black uppercase">Galeria</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Relatório Técnico / Obs</label>
                <textarea 
                  className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-3xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none min-h-[140px] dark:text-slate-100 transition-all font-medium"
                  placeholder="Descreva detalhes ou observações importantes sobre este local..."
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleFinish}
                className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-blue-200 dark:shadow-none flex items-center justify-center space-x-3 active:scale-95 transition-all uppercase tracking-widest"
              >
                <Save size={24} />
                <span>Salvar Registro</span>
              </button>
              <button 
                onClick={() => setStep('scan')}
                className="w-full py-4 text-slate-400 dark:text-slate-500 font-bold uppercase text-xs tracking-widest"
              >
                Cancelar Leitura
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-90 duration-500 px-6 text-center">
          <div className="w-32 h-32 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-8 shadow-2xl animate-bounce">
            <CheckCircle size={64} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tighter uppercase mb-2">Sucesso!</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-tight">O registro de zeladoria foi sincronizado com sucesso.</p>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0%, 100% { top: 15%; }
          50% { top: 85%; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>
    </div>
  );
};

export default QRScanner;
