import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Gauge,
  Wrench,
  ShieldAlert,
  CheckCircle2,
  Bookmark,
  Share2,
  AlertCircle,
  HelpCircle,
  Flame,
  Check
} from 'lucide-react';
import { ReplacementGuide, TechniqueGuide } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface GuideDetailProps {
  guide: ReplacementGuide | TechniqueGuide;
  type: 'replacement' | 'technique';
  onBack: () => void;
}

export const GuideDetail: React.FC<GuideDetailProps> = ({ guide, type, onBack }) => {
  const { toggleSavedGuide, markGuideCompleted, currentUser } = useAuth();
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  const isSaved = currentUser?.savedGuideIds.includes(guide.id) || false;
  const isCompleted = currentUser?.completedGuideIds.includes(guide.id) || false;

  const toggleStep = (stepNumber: number) => {
    const updated = { ...checkedSteps, [stepNumber]: !checkedSteps[stepNumber] };
    setCheckedSteps(updated);

    // If all steps checked, automatically mark completed
    const totalSteps = guide.steps.length;
    const countChecked = Object.values(updated).filter(Boolean).length;
    if (countChecked === totalSteps) {
      markGuideCompleted(guide.id);
    }
  };

  const isReplacement = type === 'replacement';
  const replacementData = isReplacement ? (guide as ReplacementGuide) : null;
  const techniqueData = !isReplacement ? (guide as TechniqueGuide) : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between text-xs">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-slate-700 rounded-xl transition-all font-semibold shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Guides</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => toggleSavedGuide(guide.id)}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all shadow-sm ${
              isSaved
                ? 'bg-orange-100 text-orange-800 border-orange-300 font-bold'
                : 'bg-white text-slate-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-orange-600 text-orange-600' : ''}`} />
            <span>{isSaved ? 'Saved in Library' : 'Bookmark Guide'}</span>
          </button>

          <button
            onClick={() => markGuideCompleted(guide.id)}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isCompleted
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isCompleted ? 'Completed ✓' : 'Mark as Done'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl text-white relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-md text-[10px] font-bold uppercase tracking-wider">
                {isReplacement ? replacementData?.category : techniqueData?.type}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {isReplacement ? 'Component Replacement' : 'Workshop Technique'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {guide.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {isReplacement ? replacementData?.summary : techniqueData?.whyItMatters}
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 text-xs">
            <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 font-semibold flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>{guide.estimatedMinutes} mins</span>
            </span>
            <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 font-semibold flex items-center space-x-1.5">
              <Gauge className="w-3.5 h-3.5 text-orange-400" />
              <span>Level: {guide.difficulty}</span>
            </span>
          </div>
        </div>

        {/* Required Tools & Safety Reminders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Tools */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <Wrench className="w-4 h-4 text-orange-400" />
              <span>Required Tools & Materials</span>
            </h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {guide.requiredTools.map((tool) => (
                <span
                  key={tool}
                  className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 font-medium"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Safety */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 text-amber-200">
            <h3 className="font-bold text-amber-400 text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>Safety Reminders</span>
            </h3>
            <ul className="space-y-1 list-disc list-inside text-xs leading-relaxed text-amber-200/90">
              {guide.safetyReminders.map((rem, idx) => (
                <li key={idx}>{rem}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Technique Result Interpretation box if technique */}
        {techniqueData && (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
            <h3 className="font-bold text-emerald-400 text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>How to Interpret Results & Measurements</span>
            </h3>
            <pre className="text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800">
              {techniqueData.howToInterpretResults}
            </pre>
          </div>
        )}
      </div>

      {/* Step-by-Step Instructions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-orange-600" />
            <span>Step-by-Step Instructions</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {Object.values(checkedSteps).filter(Boolean).length} of {guide.steps.length} completed
          </span>
        </div>

        <div className="space-y-4">
          {guide.steps.map((stepItem) => {
            const isChecked = !!checkedSteps[stepItem.stepNumber];
            return (
              <div
                key={stepItem.stepNumber}
                className={`bg-white border rounded-2xl p-5 sm:p-6 transition-all space-y-3 shadow-sm ${
                  isChecked
                    ? 'border-green-500 bg-green-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleStep(stepItem.stepNumber)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-all shrink-0 ${
                        isChecked
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-900 text-white hover:bg-orange-600'
                      }`}
                    >
                      {isChecked ? <Check className="w-4 h-4 stroke-[3]" /> : stepItem.stepNumber}
                    </button>
                    <h3 className={`font-bold text-sm sm:text-base ${isChecked ? 'text-green-800 line-through' : 'text-slate-900'}`}>
                      {stepItem.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-10">
                  {stepItem.instruction}
                </p>

                {stepItem.imageUrl && (
                  <div className="pl-10 pt-2">
                    <img
                      src={stepItem.imageUrl}
                      alt={stepItem.title}
                      className="w-full max-h-60 object-cover rounded-xl border border-gray-200"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Pro Tip or Warning */}
                <div className="pl-10 space-y-2 pt-1 text-xs">
                  {stepItem.proTip && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-start space-x-2 text-slate-800">
                      <span className="px-1.5 py-0.5 bg-orange-600 text-white font-bold text-[10px] rounded uppercase shrink-0">
                        Pro Tip
                      </span>
                      <span className="text-slate-700 font-medium">{stepItem.proTip}</span>
                    </div>
                  )}

                  {stepItem.warning && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-red-900 font-medium">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{stepItem.warning}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Common Mistakes Section (if Replacement) */}
      {replacementData && replacementData.commonMistakes.length > 0 && (
        <div className="p-6 bg-white border border-gray-200 rounded-2xl space-y-3 text-xs shadow-sm">
          <h3 className="font-bold text-amber-800 text-sm flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Common Mistakes to Avoid</span>
          </h3>
          <ul className="space-y-2 text-slate-700">
            {replacementData.commonMistakes.map((mistake, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-gray-50 p-3 rounded-xl border border-gray-200 font-medium">
                <span className="text-red-600 font-bold shrink-0">✕</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
