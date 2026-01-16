
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Camera, 
  MessageSquare, 
  Save, 
  CheckCircle, 
  XCircle,
  Clock,
  User,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { MOCK_CONDOMINIUMS, DEFAULT_AREAS } from '../constants';

const ChecklistRunner: React.FC = () => {
  const { condoId } = useParams();
  const navigate = useNavigate();
  const condo = MOCK_CONDOMINIUMS.find(c => c.id === condoId);
  
  const [items, setItems] = useState(
    DEFAULT_AREAS.map(area => ({
      id: Math.random().toString(36).substr(2, 9),
      area,
      status: 'pendente' as 'conforme' | 'nao-conforme' | 'pendente',
      observation: '',
      photos: [] as string[]
    }))
  );

  const [isFinishing, setIsFinishing] = useState(false);

  const updateStatus = (id: string, status: 'conforme' | 'nao-conforme') => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status } : item));
  };

  const updateObservation = (id: string, text: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, observation: text } : item));
  };

  const handleFinish = () => {
    setIsFinishing(true);
    setTimeout(() => {
      alert("Vistoria finalizada e sincronizada com sucesso!");
      navigate('/');
    }, 1500);
  };

  if (!condo) return <div>Condomínio não encontrado.</div>;

  const completedCount = items.filter(i => i.status !== 'pendente').length;
  const progress = (completedCount / items.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between sticky top-0 bg-slate-50/90 backdrop-blur-sm z-30 py-4 -mx-4 px-4 border-b border-slate-200">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{condo.name}</h2>
            <div className="flex items-center text-xs text-slate-500 space-x-3 mt-1">
              <span className="flex items-center"><Clock size={12} className="mr-1"/> {new Date().toLocaleTimeString()}</span>
              <span className="flex items-center"><User size={12} className="mr-1"/> João Dono</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="hidden sm:block text-right mr-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Progresso</p>
            <p className="text-sm font-bold text-blue-600">{completedCount}/{items.length}</p>
          </div>
          <button 
            disabled={completedCount === 0 || isFinishing}
            onClick={handleFinish}
            className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center space-x-2 ${
              completedCount === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
            }`}
          >
            {isFinishing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={20} />
                <span>Finalizar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
        <div 
          className="bg-blue-600 h-full transition-all duration-500" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className={`p-4 sm:p-6 bg-white rounded-2xl border transition-all ${
            item.status === 'pendente' ? 'border-slate-200 shadow-sm' : 
            item.status === 'conforme' ? 'border-emerald-200 shadow-sm' : 'border-red-200 shadow-md ring-1 ring-red-50'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-lg">{item.area}</h4>
                <p className="text-xs text-slate-400 mt-1 flex items-center italic">
                  <Clock size={10} className="mr-1" /> Registro automático na finalização
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => updateStatus(item.id, 'conforme')}
                  className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                    item.status === 'conforme' 
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                      : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-300 hover:text-emerald-500'
                  }`}
                >
                  <CheckCircle size={18} />
                  <span>Conforme</span>
                </button>
                <button 
                  onClick={() => updateStatus(item.id, 'nao-conforme')}
                  className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                    item.status === 'nao-conforme' 
                      ? 'bg-red-600 border-red-600 text-white shadow-md' 
                      : 'bg-white border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-500'
                  }`}
                >
                  <XCircle size={18} />
                  <span>NÃO Conforme</span>
                </button>
              </div>
            </div>

            {(item.status !== 'pendente') && (
              <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-4 duration-300">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Observações</label>
                  <div className="relative">
                    <MessageSquare size={16} className="absolute left-3 top-3 text-slate-300" />
                    <textarea 
                      placeholder="Detalhes sobre a limpeza ou estado da área..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                      value={item.observation}
                      onChange={(e) => updateObservation(item.id, e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Evidência Fotográfica</label>
                  <div className="grid grid-cols-2 gap-3 h-[100px]">
                    <button className="h-full border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all">
                      <Camera size={24} />
                      <span className="text-[10px] mt-1 font-bold">CÂMERA</span>
                    </button>
                    <button className="h-full border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all">
                      <ImageIcon size={24} />
                      <span className="text-[10px] mt-1 font-bold">GALERIA</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChecklistRunner;
