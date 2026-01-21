
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Plus, 
  Search, 
  ClipboardList,
  ChevronRight,
  FileText,
  X,
  Edit3,
  Trash2,
  Save,
  Layers,
  Hash
} from 'lucide-react';
import { MOCK_CONDOMINIUMS, DEFAULT_AREAS } from '../constants';
import { useAuth } from '../App';
import { UserRole } from '../types';

interface Condo {
  id: string;
  name: string;
  address: string;
  blocks: number;
  floors: number;
  commonAreas: string[];
}

const CondoManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;
  const isOperacional = user?.role === UserRole.OPERACIONAL;
  const isSindico = user?.role === UserRole.SINDICO;

  // Estado dos condomínios com persistência
  const [condos, setCondos] = useState<Condo[]>(() => {
    const saved = localStorage.getItem('ms_condos');
    return saved ? JSON.parse(saved) : MOCK_CONDOMINIUMS;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCondo, setEditingCondo] = useState<Condo | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Condo>>({
    name: '',
    address: '',
    blocks: 1,
    floors: 1,
    commonAreas: [...DEFAULT_AREAS.slice(0, 5)]
  });

  useEffect(() => {
    localStorage.setItem('ms_condos', JSON.stringify(condos));
  }, [condos]);

  const filteredCondos = condos.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingCondo(null);
    setFormData({
      name: '',
      address: '',
      blocks: 1,
      floors: 1,
      commonAreas: [...DEFAULT_AREAS.slice(0, 8)]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, condo: Condo) => {
    e.stopPropagation();
    setEditingCondo(condo);
    setFormData(condo);
    setIsModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Tem certeza que deseja remover este condomínio?")) {
      setCondos(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) return;

    if (editingCondo) {
      setCondos(prev => prev.map(c => c.id === editingCondo.id ? { ...c, ...formData } as Condo : c));
    } else {
      const newCondo = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as Condo;
      setCondos(prev => [newCondo, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Gestão de Condomínios</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Cadastre e edite os locais de inspeção do sistema.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={handleOpenCreate}
            className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-black flex items-center justify-center space-x-2 hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-500/20 cursor-pointer"
          >
            <Plus size={20} />
            <span className="uppercase tracking-widest text-xs">Novo Condomínio</span>
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Buscar condomínio por nome ou endereço..." 
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm dark:text-white font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCondos.map(condo => (
          <div 
            key={condo.id} 
            onClick={() => {
              if (isOperacional || isAdmin) navigate(`/checklist/run/${condo.id}`);
              else if (isSindico) navigate('/reports');
            }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:border-blue-400 dark:hover:border-blue-500 transition-all group cursor-pointer active:scale-[0.98] flex flex-col"
          >
            <div className="p-6 md:p-8 flex items-start gap-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-slate-100 dark:border-slate-700">
                <Building2 size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-black text-xl text-slate-900 dark:text-white truncate uppercase tracking-tighter">{condo.name}</h3>
                  {isAdmin && (
                    <div className="flex gap-1 ml-2">
                      <button onClick={(e) => handleOpenEdit(e, condo)} className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all cursor-pointer">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={(e) => handleDelete(e, condo.id)} className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all cursor-pointer">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">
                  <MapPin size={14} className="mr-1 shrink-0" />
                  <span className="truncate">{condo.address}</span>
                </div>
                
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md text-blue-600 dark:text-blue-400 uppercase tracking-tighter border border-blue-100 dark:border-blue-800/50">{condo.blocks} Blocos</span>
                  <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md text-blue-600 dark:text-blue-400 uppercase tracking-tighter border border-blue-100 dark:border-blue-800/50">{condo.floors} Andares</span>
                </div>
              </div>
            </div>

            <div className="mt-auto px-8 py-5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center text-slate-700 dark:text-slate-200 font-black text-xs uppercase tracking-widest">
                {isOperacional ? (
                  <><ClipboardList size={18} className="mr-2 text-blue-600" /> Iniciar Checklist</>
                ) : (
                  <><FileText size={18} className="mr-2 text-blue-600" /> Relatórios do Prédio</>
                )}
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Cadastro/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <form 
            onSubmit={handleSubmit}
            className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-20 duration-500"
          >
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                  {editingCondo ? 'Editar Condomínio' : 'Novo Condomínio'}
                </h3>
                <p className="text-sm text-slate-500 font-medium">Preencha os dados básicos do empreendimento.</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Condomínio</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    required
                    type="text" 
                    placeholder="Ex: Residencial Jardins"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-bold"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Endereço Completo</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    required
                    type="text" 
                    placeholder="Rua, Número, Bairro, Cidade"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-medium"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total de Blocos</label>
                  <div className="relative">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="number" 
                      min="1"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-bold"
                      value={formData.blocks}
                      onChange={e => setFormData({ ...formData, blocks: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Andares p/ Bloco</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="number" 
                      min="1"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-bold"
                      value={formData.floors}
                      onChange={e => setFormData({ ...formData, floors: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Áreas Comuns (Inclusas no Checklist)</label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_AREAS.slice(0, 15).map(area => {
                    const isSelected = formData.commonAreas?.includes(area);
                    return (
                      <button 
                        key={area}
                        type="button"
                        onClick={() => {
                          const current = formData.commonAreas || [];
                          const updated = isSelected 
                            ? current.filter(a => a !== area)
                            : [...current, area];
                          setFormData({ ...formData, commonAreas: updated });
                        }}
                        className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                          isSelected 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                        }`}
                      >
                        {area}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <button 
                type="submit"
                className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 hover:bg-blue-700 active:scale-[0.98] transition-all uppercase tracking-widest"
              >
                <Save size={24} />
                {editingCondo ? 'Salvar Alterações' : 'Cadastrar Condomínio'}
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredCondos.length === 0 && (
        <div className="py-24 text-center space-y-6 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-300">
            <Building2 size={48} />
          </div>
          <div className="space-y-2">
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Nenhum resultado encontrado</p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">Tente buscar por outro termo ou cadastre um novo condomínio.</p>
          </div>
          {isAdmin && (
            <button onClick={handleOpenCreate} className="text-blue-600 font-black uppercase text-xs tracking-widest hover:underline">Cadastrar Primeiro Item</button>
          )}
        </div>
      )}
    </div>
  );
};

export default CondoManagement;
