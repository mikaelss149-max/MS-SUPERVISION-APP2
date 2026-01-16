
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Layers, 
  Plus, 
  Search, 
  MoreVertical, 
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import { MOCK_CONDOMINIUMS } from '../constants';

const CondoManagement: React.FC = () => {
  const [condos, setCondos] = useState(MOCK_CONDOMINIUMS);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredCondos = condos.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestão de Condomínios</h2>
          <p className="text-slate-500">Administre seus {condos.length} empreendimentos cadastrados.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all">
          <Plus size={20} />
          <span>Novo Condomínio</span>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Filtrar por nome ou endereço..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCondos.map(condo => (
          <div key={condo.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Building2 size={24} className="text-blue-600" />
                </div>
                <button className="p-1 hover:bg-slate-50 rounded text-slate-400">
                  <MoreVertical size={20} />
                </button>
              </div>
              
              <div className="mt-4">
                <h3 className="font-bold text-lg text-slate-900">{condo.name}</h3>
                <div className="flex items-center text-slate-500 text-sm mt-1">
                  <MapPin size={14} className="mr-1" />
                  <span className="truncate">{condo.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Blocos/Torres</p>
                  <p className="text-lg font-bold text-slate-700">{condo.blocks}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Pavimentos</p>
                  <p className="text-lg font-bold text-slate-700">{condo.floors}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">Áreas Principais</p>
                <div className="flex flex-wrap gap-1.5">
                  {condo.commonAreas.slice(0, 4).map((area, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded-md">
                      {area}
                    </span>
                  ))}
                  {condo.commonAreas.length > 4 && (
                    <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded-md">
                      +{condo.commonAreas.length - 4} mais
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button 
                onClick={() => navigate(`/checklist/run/${condo.id}`)}
                className="flex items-center text-blue-600 font-bold text-sm hover:underline"
              >
                <ClipboardList size={16} className="mr-2" />
                Iniciar Vistoria
              </button>
              <button className="p-2 bg-white rounded-full border border-slate-200 text-slate-400 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CondoManagement;
