import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Wrench,
  Search,
  Clock,
  Gauge,
  Bookmark,
  CheckCircle2,
  Filter,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ReplacementGuide, TechniqueGuide } from '../../types';
import { api } from '../../services/api';
import { GuideDetail } from './GuideDetail';
import { useAuth } from '../../context/AuthContext';

export const GuideList: React.FC = () => {
  const { currentUser, toggleSavedGuide } = useAuth();
  const [activeTab, setActiveTab] = useState<'replacement' | 'technique'>('replacement');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [replacements, setReplacements] = useState<ReplacementGuide[]>([]);
  const [techniques, setTechniques] = useState<TechniqueGuide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<{
    guide: ReplacementGuide | TechniqueGuide;
    type: 'replacement' | 'technique';
  } | null>(null);

  useEffect(() => {
    async function load() {
      const [rList, tList] = await Promise.all([
        api.getReplacementGuides(),
        api.getTechniqueGuides()
      ]);
      setReplacements(rList);
      setTechniques(tList);
    }
    load();
  }, []);

  if (selectedGuide) {
    return (
      <GuideDetail
        guide={selectedGuide.guide}
        type={selectedGuide.type}
        onBack={() => setSelectedGuide(null)}
      />
    );
  }

  // Filter lists
  const filteredReplacements = replacements.filter((g) => {
    const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.componentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredTechniques = techniques.filter((g) => {
    const matchesCategory = selectedCategory === 'All' || g.type === selectedCategory;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.whyItMatters.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoriesRepl = ['All', 'Maintenance', 'Engine', 'Electrical', 'Brakes', 'Transmission', 'Fuel System'];
  const categoriesTech = ['All', 'Multimeter', 'Testing', 'Inspection', 'Cleaning', 'Adjustment'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-xs font-bold text-orange-400 uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Technical Knowledge Base</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Repair Guides & Workshop Techniques
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Structured step-by-step procedures, tool requirements, and multimeter diagnostics for Philippine motorcycles.
            </p>
          </div>

          {/* Tab switch */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => {
                setActiveTab('replacement');
                setSelectedCategory('All');
              }}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'replacement'
                  ? 'bg-orange-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Replacement Guides ({replacements.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('technique');
                setSelectedCategory('All');
              }}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'technique'
                  ? 'bg-orange-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Workshop Techniques ({techniques.length})
            </button>
          </div>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides or tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
            {(activeTab === 'replacement' ? categoriesRepl : categoriesTech).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-orange-400 border border-orange-500/50'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid View */}
      {activeTab === 'replacement' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReplacements.map((guide) => {
            const isSaved = currentUser?.savedGuideIds.includes(guide.id);
            const isCompleted = currentUser?.completedGuideIds.includes(guide.id);
            return (
              <div
                key={guide.id}
                onClick={() => setSelectedGuide({ guide, type: 'replacement' })}
                className="bg-white border border-gray-200 hover:border-orange-500 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md shadow-sm flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 bg-orange-100 text-orange-800 border border-orange-200 rounded-md">
                      {guide.category}
                    </span>

                    <div className="flex items-center space-x-1">
                      {isCompleted && (
                        <span className="text-green-700 text-[10px] font-bold bg-green-100 px-2 py-0.5 rounded border border-green-200">
                          Completed ✓
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSavedGuide(guide.id);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-slate-400 hover:text-orange-600"
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-orange-500 text-orange-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-orange-600 transition-colors">
                    {guide.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {guide.summary}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-3 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-orange-600" />
                      <span>{guide.estimatedMinutes}m</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Gauge className="w-3.5 h-3.5 text-orange-600" />
                      <span>{guide.difficulty}</span>
                    </span>
                  </div>

                  <span className="text-orange-600 font-bold group-hover:translate-x-1 transition-transform flex items-center text-xs">
                    View <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'technique' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTechniques.map((tech) => {
            const isSaved = currentUser?.savedGuideIds.includes(tech.id);
            const isCompleted = currentUser?.completedGuideIds.includes(tech.id);
            return (
              <div
                key={tech.id}
                onClick={() => setSelectedGuide({ guide: tech, type: 'technique' })}
                className="bg-white border border-gray-200 hover:border-orange-500 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-md shadow-sm space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-200 rounded-md">
                      Technique: {tech.type}
                    </span>

                    <div className="flex items-center space-x-1">
                      {isCompleted && (
                        <span className="text-green-700 text-[10px] font-bold bg-green-100 px-2 py-0.5 rounded border border-green-200">
                          Mastered ✓
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSavedGuide(tech.id);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-slate-400 hover:text-orange-600"
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-orange-500 text-orange-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-orange-600 transition-colors">
                    {tech.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {tech.whyItMatters}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-3 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-orange-600" />
                      <span>{tech.estimatedMinutes}m</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Gauge className="w-3.5 h-3.5 text-orange-600" />
                      <span>{tech.difficulty}</span>
                    </span>
                  </div>

                  <span className="text-orange-600 font-bold group-hover:translate-x-1 transition-transform flex items-center text-xs">
                    Learn Procedure <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
