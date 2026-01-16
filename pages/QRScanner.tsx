
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  QrCode, 
  Camera, 
  CheckCircle, 
  MapPin, 
  History, 
  ArrowLeft,
  Image as ImageIcon,
  Save,
  Printer,
  Download,
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

  // Mock de Logs de Limpeza (o que o Admin vê)
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
    alert(`Gerando arquivo para impressão do QR Code: ${area}\nEste arquivo contém o identificador único para fixação no local.`);
  };

  // --- VISÃO ADMINISTRADOR / SÍNDICO ---
  if (isAdminOrSindico) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Gestão de QR Codes e Registros</h2>
            <p className="text-slate-500">Gerencie os códigos para fixação e acompanhe os registros do zelador.</p>
          </div>
          <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-800 transition-all">
            <Printer size={18} />
            <span>Imprimir Todos</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna de Geração/Impressão */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <QrCode size={20} className="text-blue-500" />
                  Códigos por Ambiente
                </h3>
                <div className="relative w-48">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar área..." 
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DEFAULT_AREAS.filter(a => a.toLowerCase().includes(searchTerm.toLowerCase())).map(area => (
                  <div key={area} className="p-4 border border-slate-100 bg-slate-50 rounded-2xl flex items-center justify-between group hover:border-blue-200 transition-all">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <QrCode size={24} className="text-slate-700" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{area}</span>
                    </div>
                    <button 
                      onClick={() => handlePrintQR(area)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Imprimir QR Code para este ambiente"
                    >
                      <Printer size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna de Logs (Rastreabilidade) */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <History size={20} className="text-emerald-500" />
                Registros Realizados
              </h3>
              <div className="space-y-6">
                {cleaningLogs.map(log => (
                  <div key={log.id} className="relative pl-6 pb-6 border-l-2 border-slate-100 last:pb-0 last:border-0">
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm"></div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-bold text-slate-900">{log.area}</span>
                        <span className="text-[10px] font-bold text-slate-400">{log.time}</span>
                      </div>
                      <div className="flex items-center text-[10px] text-slate-500 font-medium space-x-2">
                        <UserIcon size={10} />
                        <span>{log.user}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <CheckCircle size={10} className="text-emerald-500" />
                        <span className="text-emerald-600">Limpeza Confirmada</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                Ver Relatório Completo
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-5 rounded-3xl">
              <div className="flex items-center gap-2 text-amber-700 font-bold mb-2">
                <Clock size={18} />
                <span>Status de Cobertura</span>
              </div>
              <p className="text-xs text-amber-600 mb-4 font-medium leading-relaxed">
                85% das áreas críticas foram limpas nas últimas 4 horas. 
                <span className="font-bold underline cursor-pointer ml-1 text-amber-800">Ver pendências</span>
              </p>
              <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-amber-600 w-[85%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VISÃO OPERACIONAL (ZELADOR) ---
  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold">Olá, {user?.name}</h1>
          <p className="text-sm text-slate-500">Módulo de Limpeza via QR</p>
        </div>
        <button onClick={logout} className="text-red-500 font-bold text-sm">Sair</button>
      </div>

      {step === 'scan' && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95 duration-300">
          <div className="relative">
            <div className="w-64 h-64 border-4 border-blue-500 rounded-3xl flex items-center justify-center bg-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
              <QrCode size={120} className="text-blue-600 opacity-20" />
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2s_infinite]"></div>
              <Camera size={48} className="absolute text-blue-600" />
            </div>
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-blue-600 rounded-tl-lg"></div>
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-blue-600 rounded-tr-lg"></div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-blue-600 rounded-bl-lg"></div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-blue-600 rounded-br-lg"></div>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Escanear QR Code</h2>
            <p className="text-slate-500 px-6">Posicione o código fixado no ambiente para registrar a execução do serviço.</p>
          </div>

          <div className="w-full space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase text-center mb-2">Simular leitura (Prototipagem)</p>
            <div className="grid grid-cols-2 gap-2">
              {DEFAULT_AREAS.slice(0, 4).map(area => (
                <button 
                  key={area}
                  onClick={() => handleScanSimulation(area)}
                  className="p-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:border-blue-400 transition-all text-slate-700 shadow-sm"
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 'form' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-200">
            <div className="flex items-center space-x-3 mb-2">
              <MapPin size={20} />
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">Ambiente Escaneado</span>
            </div>
            <h2 className="text-3xl font-bold">{selectedArea}</h2>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <label className="flex items-center space-x-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl cursor-pointer">
              <div className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-white">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              </div>
              <span className="font-bold text-emerald-800">Confirmar Limpeza e Manutenção</span>
            </label>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Fotos da Área</label>
                <div className="grid grid-cols-2 gap-4">
                  <button className="aspect-video border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all bg-slate-50">
                    <Camera size={28} />
                    <span className="text-xs mt-2 font-bold">Câmera</span>
                  </button>
                  <button className="aspect-video border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all bg-slate-50">
                    <ImageIcon size={28} />
                    <span className="text-xs mt-2 font-bold">Galeria</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Relatar Observação</label>
                <textarea 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
                  placeholder="Ex: Reposição de insumos ou irregularidades..."
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                />
              </div>
            </div>

            <button 
              onClick={handleFinish}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 flex items-center justify-center space-x-2 active:scale-95 transition-all"
            >
              <Save size={20} />
              <span>Enviar Registro Agora</span>
            </button>
            <button 
              onClick={() => setStep('scan')}
              className="w-full py-3 text-slate-400 font-bold"
            >
              Cancelar Leitura
            </button>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-90 duration-500">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Registro Concluído!</h2>
          <p className="text-slate-500 mt-2 text-center">Os dados foram enviados para o painel de administração.</p>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0%, 100% { top: 20%; }
          50% { top: 80%; }
        }
      `}</style>
    </div>
  );
};

export default QRScanner;
