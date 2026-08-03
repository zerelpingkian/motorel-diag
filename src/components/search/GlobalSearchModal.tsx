import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Wrench, ChevronRight, CornerDownLeft } from 'lucide-react';
import { MotorcycleModel, ReplacementGuide, TechniqueGuide } from '../../types';
import { api } from '../../services/api';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGuide: (guideId: string, type: 'replacement' | 'technique') => void;
  onSelectTroubleshooting: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectGuide,
  onSelectTroubleshooting
}) => {
  const [query, setQuery] = useState('');
  const [models, setModels] = useState<MotorcycleModel[]>([]);
  const [guides, setGuides] = useState<ReplacementGuide[]>([]);
  const [techniques, setTechniques] = useState<TechniqueGuide[]>([]);

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        api.getMotorcycles(),
        api.getReplacementGuides(),
        api.getTechniqueGuides()
      ]).then(([mList, gList, tList]) => {
        setModels(mList);
        setGuides(gList);
        setTechniques(tList);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredModels = models.filter((m) =>
    m.modelName.toLowerCase().includes(query.toLowerCase()) ||
    m.brandName.toLowerCase().includes(query.toLowerCase())
  );

  const filteredGuides = guides.filter((g) =>
    g.title.toLowerCase().includes(query.toLowerCase()) ||
    g.componentName.toLowerCase().includes(query.toLowerCase()) ||
    g.summary.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTechniques = techniques.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.whyItMatters.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-4 sm:p-6 space-y-4 shadow-2xl text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Bar Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-orange-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            placeholder="Search motorcycle models, oil specs, multimeter guides..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 shadow-inner"
          />
          <button
            onClick={onClose}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Container */}
        <div className="max-h-96 overflow-y-auto space-y-4 pr-1">
          {/* Models */}
          {filteredModels.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Motorcycle Models ({filteredModels.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredModels.slice(0, 4).map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      onSelectTroubleshooting();
                      onClose();
                    }}
                    className="p-3 bg-slate-950 border border-slate-800 hover:border-orange-500 rounded-xl cursor-pointer flex items-center space-x-3 group"
                  >
                    <img src={m.imageUrl} alt={m.modelName} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-orange-400 font-bold block">{m.brandName}</span>
                      <h4 className="font-bold text-white truncate group-hover:text-orange-400 text-xs">{m.modelName}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Replacement Guides */}
          {filteredGuides.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Replacement Guides ({filteredGuides.length})
              </span>
              <div className="space-y-2">
                {filteredGuides.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => {
                      onSelectGuide(g.id, 'replacement');
                      onClose();
                    }}
                    className="p-3 bg-slate-950 border border-slate-800 hover:border-orange-500 rounded-xl cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-0.5 max-w-md">
                      <span className="text-[10px] font-bold text-orange-400 uppercase">{g.category}</span>
                      <h4 className="font-bold text-white group-hover:text-orange-400 text-xs">{g.title}</h4>
                    </div>
                    <span className="text-orange-400 text-[10px] font-bold">Open Guide →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Techniques */}
          {filteredTechniques.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Workshop Techniques ({filteredTechniques.length})
              </span>
              <div className="space-y-2">
                {filteredTechniques.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      onSelectGuide(t.id, 'technique');
                      onClose();
                    }}
                    className="p-3 bg-slate-950 border border-slate-800 hover:border-orange-500 rounded-xl cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-0.5 max-w-md">
                      <span className="text-[10px] font-bold text-amber-300 uppercase">Technique: {t.type}</span>
                      <h4 className="font-bold text-white group-hover:text-orange-400 text-xs">{t.title}</h4>
                    </div>
                    <span className="text-orange-400 text-[10px] font-bold">Learn →</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-800 pt-3 text-[10px] text-slate-500 flex items-center justify-between">
          <span>Motorel Diag Instant Search</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
