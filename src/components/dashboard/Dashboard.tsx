import React, { useState, useEffect } from 'react';
import {
  Wrench,
  BookOpen,
  Search,
  Zap,
  Bookmark,
  CheckCircle2,
  Users,
  MessageSquare,
  ThumbsUp,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Flame,
  ArrowRight,
  Clock,
  Gauge,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MotorcycleModel, ReplacementGuide, CommunityPost, TechniqueGuide } from '../../types';
import { api } from '../../services/api';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, onOpenSearch }) => {
  const { currentUser, role } = useAuth();

  const [motorcycles, setMotorcycles] = useState<MotorcycleModel[]>([]);
  const [guides, setGuides] = useState<ReplacementGuide[]>([]);
  const [techniques, setTechniques] = useState<TechniqueGuide[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  useEffect(() => {
    async function load() {
      const [mList, gList, tList, pList] = await Promise.all([
        api.getMotorcycles(),
        api.getReplacementGuides(),
        api.getTechniqueGuides(),
        api.getPosts()
      ]);
      setMotorcycles(mList);
      setGuides(gList);
      setTechniques(tList);
      setPosts(pList);
    }
    load();
  }, []);

  const favoriteBikes = motorcycles.filter((m) =>
    currentUser?.favoriteMotorcycleIds.includes(m.id)
  );

  const savedGuidesList = guides.filter((g) =>
    currentUser?.savedGuideIds.includes(g.id)
  );

  const completedCount = currentUser?.completedGuideIds.length || 0;
  const totalGuidesCount = guides.length + techniques.length;
  const overallProgressPercent = Math.round((completedCount / (totalGuidesCount || 1)) * 100);

  return (
    <div className="space-y-8">
      {/* Hero Workshop Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl text-white">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1600&q=80')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/60 z-10"></div>

        <div className="relative z-20 p-6 sm:p-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-500/20 border border-orange-500/40 rounded-full text-xs font-bold text-orange-400 uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5 fill-orange-400" />
            <span>Welcome, {currentUser?.name || 'Rider'} ({role.toUpperCase()})</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Diagnose, Repair & Master Your Motorcycle.
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Motorel Diag is your interactive Philippine motorcycle workshop companion. Perform guided step-by-step inspections, learn replacement procedures, and troubleshoot common issues safely.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('troubleshooting')}
              className="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-orange-900/20 flex items-center space-x-2 transition-all"
            >
              <Wrench className="w-4 h-4 stroke-[2.5]" />
              <span>Start Manual Troubleshooting</span>
            </button>

            <button
              onClick={onOpenSearch}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-xl text-xs sm:text-sm flex items-center space-x-2 transition-all"
            >
              <Search className="w-4 h-4 text-orange-400" />
              <span>Search Manuals & Parts...</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Search Bar Trigger Section */}
      <div
        onClick={onOpenSearch}
        className="bg-white border border-gray-200 hover:border-orange-500 rounded-2xl p-4 cursor-pointer transition-all flex items-center justify-between text-slate-600 text-xs shadow-sm"
      >
        <div className="flex items-center space-x-3">
          <Search className="w-4 h-4 text-orange-600" />
          <span className="text-slate-700 font-medium">Search models, replacement guides, multimeter techniques, and troubleshooting topics...</span>
        </div>
        <kbd className="hidden sm:inline-block px-2 py-1 bg-gray-100 border border-gray-300 rounded text-[10px] text-slate-500 font-mono">
          Press ⌘K
        </kbd>
      </div>

      {/* Continue Learning & Progress Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-bold text-slate-900">Continue Learning & Skill Progress</h2>
          </div>
          <button
            onClick={() => setActiveTab('guides')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center"
          >
            All Guides <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        {/* Overall Progress Meter */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-600 font-semibold">
            <span>Overall Mechanics Mastery</span>
            <span className="text-orange-600 font-bold">{overallProgressPercent}% ({completedCount} / {totalGuidesCount} Guides)</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <div
              className="h-full bg-orange-600 transition-all duration-500"
              style={{ width: `${Math.max(overallProgressPercent, 8)}%` }}
            ></div>
          </div>
        </div>

        {/* In-progress / Popular Techniques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {techniques.slice(0, 3).map((tech) => (
            <div
              key={tech.id}
              onClick={() => setActiveTab('guides')}
              className="p-4 bg-gray-50 border border-gray-200 hover:border-orange-500 rounded-xl cursor-pointer space-y-2 transition-all text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-orange-100 text-orange-800 rounded">
                  {tech.type}
                </span>
                <span className="text-slate-500 font-mono text-[10px]">{tech.estimatedMinutes}m</span>
              </div>
              <h3 className="font-bold text-slate-900 truncate">{tech.title}</h3>
              <p className="text-slate-500 line-clamp-1">{tech.whyItMatters}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Favorite Motorcycles & Quick Specs Lookup */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-orange-600" />
            <span>Favorite Motorcycles & Quick Specs</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {favoriteBikes.length} Saved in Garage
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(favoriteBikes.length > 0 ? favoriteBikes : motorcycles.slice(0, 3)).map((model) => (
            <div
              key={model.id}
              onClick={() => setActiveTab('troubleshooting')}
              className="bg-white border border-gray-200 hover:border-orange-500 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md shadow-sm space-y-3 group"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={model.imageUrl}
                  alt={model.modelName}
                  className="w-14 h-14 rounded-xl object-cover border border-gray-200 group-hover:border-orange-500/50"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] font-bold text-orange-600 uppercase">
                    {model.brandName} • {model.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-orange-600">
                    {model.modelName}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {model.engineDisplacement} • {model.fuelSystem}
                  </p>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                <div>
                  <span className="text-slate-400 block">Oil Capacity:</span>
                  <span className="text-slate-800 font-semibold truncate">{model.oilCapacity}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Spark Plug:</span>
                  <span className="text-slate-800 font-semibold truncate">{model.sparkPlugType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Repairs & Maintenance Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Popular Repairs */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Flame className="w-4 h-4 text-orange-600" />
              <span>Popular Replacement Guides</span>
            </h3>
            <button
              onClick={() => setActiveTab('guides')}
              className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {guides.slice(0, 4).map((guide) => (
              <div
                key={guide.id}
                onClick={() => setActiveTab('guides')}
                className="p-3 bg-gray-50 border border-gray-200 hover:border-orange-500 rounded-xl cursor-pointer flex items-center justify-between transition-all group"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-orange-600 uppercase">
                    {guide.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-orange-600">
                    {guide.title}
                  </h4>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-500 shrink-0">
                  <span>{guide.estimatedMinutes}m</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Essential Maintenance Tips Box */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Philippine Maintenance Checklist</span>
            </h3>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
              <span className="font-bold text-slate-900 block text-xs">
                • Engine Oil Interval (Every 1,500 - 2,500 km)
              </span>
              <p className="text-slate-500">
                Philippine stop-and-go city traffic builds engine heat quickly. Always drain and check oil level.
              </p>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
              <span className="font-bold text-slate-900 block text-xs">
                • Scooter CVT Belt & Roller Cleaning (Every 5,000 km)
              </span>
              <p className="text-slate-500">
                Degrease clutch bell with brake cleaner and sand lining to prevent shudder (kalog).
              </p>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
              <span className="font-bold text-slate-900 block text-xs">
                • FI Fuel Strainer Replacement (Every 15,000 km)
              </span>
              <p className="text-slate-500">
                Keeps fuel pump motor healthy and prevents high RPM hesitation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Community Posts */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-bold text-slate-900">Recent Community Discussions</h2>
          </div>
          <button
            onClick={() => setActiveTab('community')}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center"
          >
            Visit Forum <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.slice(0, 2).map((post) => (
            <div
              key={post.id}
              onClick={() => setActiveTab('community')}
              className="bg-gray-50 border border-gray-200 hover:border-orange-500 rounded-xl p-4 cursor-pointer space-y-2 transition-all"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold uppercase text-orange-700 bg-orange-100 px-2 py-0.5 rounded border border-orange-200">
                  {post.category}
                </span>
                <span className="text-slate-500">{post.authorName} ({post.authorRole})</span>
              </div>
              <h3 className="font-bold text-slate-900 text-xs line-clamp-2">{post.title}</h3>
              <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">{post.content}</p>
              <div className="flex items-center space-x-4 text-[10px] text-slate-500 pt-1">
                <span className="flex items-center space-x-1">
                  <ThumbsUp className="w-3 h-3 text-orange-600" />
                  <span>{post.likes} Likes</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MessageSquare className="w-3 h-3 text-slate-400" />
                  <span>{post.commentsCount} Comments</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
