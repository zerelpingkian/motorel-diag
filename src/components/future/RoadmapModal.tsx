import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Bot,
  Camera,
  History,
  Bell,
  Printer,
  QrCode,
  Download,
  Languages,
  CheckCircle2
} from 'lucide-react';

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoadmapModal: React.FC<RoadmapModalProps> = ({ isOpen, onClose }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'FIL' | 'BIS'>('EN');

  if (!isOpen) return null;

  const features = [
    {
      icon: Bot,
      title: 'AI Troubleshooting Assistant',
      description: 'Gemini-powered natural language symptom assistant for custom engine questions.',
      status: 'In Development'
    },
    {
      icon: Camera,
      title: 'Photo-Based Problem Identification',
      description: 'Snap photos of spark plugs, tire treads, or belt wear for automated visual wear analysis.',
      status: 'Planned Q4'
    },
    {
      icon: History,
      title: 'Motorcycle Maintenance History Log',
      description: 'Log oil changes, belt replacements, and odometer readings with expense tracking.',
      status: 'Coming Soon'
    },
    {
      icon: Bell,
      title: 'Smart Maintenance Reminders',
      description: 'Automated SMS or push notifications based on estimated monthly mileage.',
      status: 'In Development'
    },
    {
      icon: Printer,
      title: 'Printable Repair Guides & PDF Export',
      description: 'Generate clean 1-page workshop printables for grease-hand mechanic benches.',
      status: 'Ready Preview'
    },
    {
      icon: QrCode,
      title: 'QR Code Motorcycle Sticker Support',
      description: 'Scan QR code sticker placed under motorcycle seat to load exact model specs instantly.',
      status: 'In Development'
    },
    {
      icon: Download,
      title: 'Offline Guide Downloads',
      description: 'PWA Progressive Web App download for full guide access in remote provincial routes.',
      status: 'Planned'
    },
    {
      icon: Languages,
      title: 'Multi-Language Support (English, Filipino, Bisaya)',
      description: 'Localized diagnostic procedures for mechanics across Luzon, Visayas, and Mindanao.',
      status: 'Language Preview Below'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl text-xs text-slate-200 relative max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 font-bold uppercase tracking-widest text-[10px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Future Architecture & Feature Expansion</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Motorel Diag Platform Roadmap
          </h2>
          <p className="text-slate-400">
            Designed modular architecture to support future AI, offline, and multi-language capabilities.
          </p>
        </div>

        {/* Language Toggle Preview Frame */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center space-x-1.5">
              <Languages className="w-4 h-4 text-orange-400" />
              <span>Language Framework Preview</span>
            </span>

            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-[10px] font-bold">
              <button
                onClick={() => setSelectedLanguage('EN')}
                className={`px-2.5 py-1 rounded ${selectedLanguage === 'EN' ? 'bg-orange-500 text-slate-950' : 'text-slate-400'}`}
              >
                English
              </button>
              <button
                onClick={() => setSelectedLanguage('FIL')}
                className={`px-2.5 py-1 rounded ${selectedLanguage === 'FIL' ? 'bg-orange-500 text-slate-950' : 'text-slate-400'}`}
              >
                Filipino
              </button>
              <button
                onClick={() => setSelectedLanguage('BIS')}
                className={`px-2.5 py-1 rounded ${selectedLanguage === 'BIS' ? 'bg-orange-500 text-slate-950' : 'text-slate-400'}`}
              >
                Bisaya
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg text-slate-300 font-medium leading-relaxed">
            {selectedLanguage === 'EN' && (
              <p>"Perform visual inspection of spark plug electrode gap before checking ignition voltage."</p>
            )}
            {selectedLanguage === 'FIL' && (
              <p>"Suriin muna ang spark plug electrode bago sukatin ang boltahe ng kuryente sa ignition."</p>
            )}
            {selectedLanguage === 'BIS' && (
              <p>"I-check una ang distansya sa spark plug electrode sa dili pa sukdon ang boltahe sa ignition."</p>
            )}
          </div>
        </div>

        {/* Features List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center space-x-1.5 text-xs">
                    <Icon className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>{feat.title}</span>
                  </span>
                  <span className="text-[9px] bg-slate-900 text-amber-300 px-1.5 py-0.5 rounded border border-slate-800 font-mono">
                    {feat.status}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed pl-5">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="border-t border-slate-800 pt-3 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl"
          >
            Close Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};
