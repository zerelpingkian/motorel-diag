import React from 'react';
import { Wrench, ShieldAlert, Sparkles, CheckCircle2, Heart } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenRoadmap: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenRoadmap }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
          {/* Col 1: Brand Info & Strict Disclaimer */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-black text-slate-950 text-sm">
                MD
              </div>
              <span className="text-lg font-black text-white tracking-wider">
                MOTOREL DIAG
              </span>
              <span className="text-[10px] bg-slate-800 text-orange-400 px-2 py-0.5 rounded font-mono border border-slate-700">
                v2.4 PH
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
              Interactive motorcycle repair and learning platform designed for riders, students, and mechanics in the Philippines. Empowering manual inspection procedures and structured DIY maintenance.
            </p>

            {/* Strict Notice Box */}
            <div className="p-3.5 bg-slate-900/90 border border-amber-500/30 rounded-2xl space-y-1.5 text-xs">
              <div className="flex items-center space-x-2 text-amber-400 font-bold">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Important Safety & Technical Notice</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Motorel Diag is <strong>NOT an ECU scanner</strong>. It does <strong>NOT connect to the motorcycle</strong>, read OBD/FI fault codes automatically, or generate fake sensor values. Every recommendation is based solely on manual inspection results provided by the user.
              </p>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform Modules
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('troubleshooting')} className="hover:text-orange-400 transition-colors">
                  Manual Troubleshooting
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('guides')} className="hover:text-orange-400 transition-colors">
                  Replacement Guides
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('guides')} className="hover:text-orange-400 transition-colors">
                  Multimeter & Workshop Techniques
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('community')} className="hover:text-orange-400 transition-colors">
                  Mechanic Q&A Community
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Target Philippine Brands & Specs */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Supported Motorcycle Brands
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['Honda Click 125', 'Yamaha NMAX 155', 'Beat FI', 'Mio i125', 'ADV160', 'Raider R150', 'Wave 110', 'Barako 175', 'China Bikes'].map((b) => (
                <span key={b} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-slate-300 font-medium">
                  {b}
                </span>
              ))}
            </div>
            <div className="pt-2">
              <button
                onClick={onOpenRoadmap}
                className="inline-flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>View Future Roadmap (AI & Offline)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Motorel Diag Philippines. Built for Philippine Riders & Mechanics.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Offline-ready guide manual architecture</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
