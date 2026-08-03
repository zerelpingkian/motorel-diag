import React, { useState, useEffect } from 'react';
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  SkipForward,
  ArrowLeft,
  ChevronRight,
  RotateCcw,
  ShieldAlert,
  Clock,
  Gauge,
  BookOpen,
  Share2,
  Printer,
  Sparkles,
  Info,
  MapPin,
  Flame,
  Zap,
  PowerOff,
  Thermometer
} from 'lucide-react';
import {
  Brand,
  MotorcycleModel,
  ProblemCategory,
  Symptom,
  TroubleshootingNode,
  UserInspectionRecord,
  DiagnosisResult
} from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface TroubleshootingFlowProps {
  onNavigateToGuide?: (guideId: string, type: 'replacement' | 'technique') => void;
}

export const TroubleshootingFlow: React.FC<TroubleshootingFlowProps> = ({ onNavigateToGuide }) => {
  const { toggleSavedTroubleshooting, currentUser } = useAuth();

  // Step state in flow
  const [step, setStep] = useState<
    'brand' | 'model' | 'category' | 'symptom' | 'inspection' | 'summary'
  >('brand');

  // Loaded data
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<MotorcycleModel[]>([]);
  const [categories, setCategories] = useState<ProblemCategory[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);

  // Selection state
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedModel, setSelectedModel] = useState<MotorcycleModel | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProblemCategory | null>(null);
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);

  // Diagnostic tree execution state
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [currentNode, setCurrentNode] = useState<TroubleshootingNode | null>(null);
  const [userRecords, setUserRecords] = useState<UserInspectionRecord[]>([]);
  const [finalDiagnosis, setFinalDiagnosis] = useState<DiagnosisResult | null>(null);
  const [loadingNode, setLoadingNode] = useState(false);

  // Initial data loading
  useEffect(() => {
    async function loadInitial() {
      const [bList, mList, cList, sList] = await Promise.all([
        api.getBrands(),
        api.getMotorcycles(),
        api.getProblemCategories(),
        api.getSymptoms()
      ]);
      setBrands(bList);
      setModels(mList);
      setCategories(cList);
      setSymptoms(sList);
    }
    loadInitial();
  }, []);

  // When node ID changes, load the node
  useEffect(() => {
    if (!currentNodeId) return;
    setLoadingNode(true);
    api.getTroubleshootingNode(currentNodeId)
      .then((node) => {
        setCurrentNode(node);
        setLoadingNode(false);
      })
      .catch((err) => {
        console.error('Error loading node', err);
        setLoadingNode(false);
      });
  }, [currentNodeId]);

  // Handlers
  const handleSelectBrand = (b: Brand) => {
    setSelectedBrand(b);
    setStep('model');
  };

  const handleSelectModel = (m: MotorcycleModel) => {
    setSelectedModel(m);
    setStep('category');
  };

  const handleSelectCategory = (c: ProblemCategory) => {
    setSelectedCategory(c);
    setStep('symptom');
  };

  const handleSelectSymptom = (s: Symptom) => {
    setSelectedSymptom(s);
    setCurrentNodeId(s.initialNodeId);
    setUserRecords([]);
    setFinalDiagnosis(null);
    setStep('inspection');
  };

  const handleInspectionAnswer = (answer: 'Normal' | 'Abnormal' | 'Not Sure' | 'Skip') => {
    if (!currentNode) return;

    const newRecord: UserInspectionRecord = {
      stepId: currentNode.inspectionStep.id,
      stepTitle: currentNode.inspectionStep.title,
      userAnswer: answer
    };

    const updatedRecords = [...userRecords, newRecord];
    setUserRecords(updatedRecords);

    // Decision Logic
    if (answer === 'Abnormal') {
      if (currentNode.diagnosisIfAbnormal) {
        setFinalDiagnosis(currentNode.diagnosisIfAbnormal);
        setStep('summary');
      } else if (currentNode.nextStepOnAbnormalId) {
        setCurrentNodeId(currentNode.nextStepOnAbnormalId);
      } else {
        // Fallback diagnosis
        setFinalDiagnosis({
          mostLikelyCause: 'Component Inspection Failed',
          otherCauses: ['Associated electrical harness', 'Component mechanical wear'],
          explanation: 'The physical/electrical inspection yielded an abnormal result.',
          recommendedRepair: 'Inspect or replace the failing component.',
          difficulty: 'Intermediate',
          estimatedMinutes: 30,
          requiredTools: currentNode.inspectionStep.requiredTools
        });
        setStep('summary');
      }
    } else if (answer === 'Normal') {
      if (currentNode.nextStepOnNormalId) {
        setCurrentNodeId(currentNode.nextStepOnNormalId);
      } else if (currentNode.diagnosisIfNormal) {
        setFinalDiagnosis(currentNode.diagnosisIfNormal);
        setStep('summary');
      } else {
        setFinalDiagnosis({
          mostLikelyCause: 'Primary System Normal - Secondary System Issue',
          otherCauses: ['Fuel quality issue', 'Loose ground contact point'],
          explanation: 'All checked physical parameters passed standard specifications.',
          recommendedRepair: 'Perform secondary electrical and fuel pressure continuity checks.',
          difficulty: 'Intermediate',
          estimatedMinutes: 20,
          requiredTools: ['Multimeter']
        });
        setStep('summary');
      }
    } else {
      // Not sure / Skip
      if (currentNode.nextStepOnNormalId) {
        setCurrentNodeId(currentNode.nextStepOnNormalId);
      } else if (currentNode.nextStepOnAbnormalId) {
        setCurrentNodeId(currentNode.nextStepOnAbnormalId);
      } else {
        setFinalDiagnosis({
          mostLikelyCause: 'Inconclusive Inspection Results',
          otherCauses: ['Unchecked electrical or mechanical component'],
          explanation: 'Inspection step was skipped or inconclusive.',
          recommendedRepair: 'Re-run the inspection or consult a certified mechanic.',
          difficulty: 'Beginner',
          estimatedMinutes: 15,
          requiredTools: []
        });
        setStep('summary');
      }
    }
  };

  const resetAll = () => {
    setStep('brand');
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedCategory(null);
    setSelectedSymptom(null);
    setCurrentNodeId(null);
    setCurrentNode(null);
    setUserRecords([]);
    setFinalDiagnosis(null);
  };

  // Helper category icons mapping
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'PowerOff': return PowerOff;
      case 'AlertTriangle': return AlertTriangle;
      case 'Gauge': return Gauge;
      case 'Zap': return Zap;
      case 'ShieldAlert': return ShieldAlert;
      case 'Thermometer': return Thermometer;
      default: return Wrench;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-xs font-bold text-orange-400 uppercase tracking-widest">
            <Wrench className="w-3.5 h-3.5" />
            <span>Interactive Workshop Manual</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Guided Manual Troubleshooting
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Diagnose motorcycle issues through step-by-step physical and multimeter inspections. No ECU scanner required — every step relies on your actual inspection results.
          </p>

          {/* Flow Stepper Progress Bar */}
          <div className="pt-4 flex items-center space-x-2 text-xs text-slate-400 overflow-x-auto pb-1">
            <span className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 ${step === 'brand' ? 'bg-orange-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
              <span>1. Brand</span>
            </span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 ${step === 'model' ? 'bg-orange-500 text-slate-950' : selectedModel ? 'bg-slate-800 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
              <span>2. Model</span>
            </span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 ${step === 'category' ? 'bg-orange-500 text-slate-950' : selectedCategory ? 'bg-slate-800 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
              <span>3. Problem</span>
            </span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 ${step === 'symptom' ? 'bg-orange-500 text-slate-950' : selectedSymptom ? 'bg-slate-800 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
              <span>4. Symptom</span>
            </span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className={`px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1 ${step === 'inspection' ? 'bg-orange-500 text-slate-950' : step === 'summary' ? 'bg-slate-800 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
              <span>5. Inspection</span>
            </span>
          </div>
        </div>
      </div>

      {/* STEP 1: Select Brand */}
      {step === 'brand' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-black text-xs">
                1
              </span>
              <span>Select Motorcycle Brand</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Step 1 of 5</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => handleSelectBrand(brand)}
                className="p-5 bg-white border border-gray-200 hover:border-orange-500 rounded-2xl text-center space-y-2 transition-all hover:shadow-md shadow-sm group text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center font-black text-white text-lg group-hover:bg-orange-600 transition-colors">
                  {brand.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">{brand.country}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Select Model */}
      {step === 'model' && selectedBrand && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setStep('brand')}
                className="p-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl text-slate-700"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-black text-xs">
                  2
                </span>
                <span>Select {selectedBrand.name} Model</span>
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">Step 2 of 5</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {models
              .filter((m) => m.brandId === selectedBrand.id)
              .map((model) => (
                <div
                  key={model.id}
                  onClick={() => handleSelectModel(model)}
                  className="bg-white border border-gray-200 hover:border-orange-500 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md shadow-sm flex space-x-4 items-center group"
                >
                  <img
                    src={model.imageUrl}
                    alt={model.modelName}
                    className="w-20 h-20 rounded-xl object-cover border border-gray-200 group-hover:border-orange-500/50 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-orange-100 text-orange-800 border border-orange-200 rounded-md">
                        {model.category}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500">
                        {model.engineDisplacement}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-orange-600">
                      {model.modelName}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {model.fuelSystem} • {model.transmission}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* STEP 3: Select Problem Category */}
      {step === 'category' && selectedModel && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setStep('model')}
                className="p-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl text-slate-700"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-black text-xs">
                    3
                  </span>
                  <span>Select Problem Category</span>
                </h2>
                <p className="text-xs text-orange-600 font-bold">
                  Selected: {selectedModel.brandName} {selectedModel.modelName}
                </p>
              </div>
            </div>
            <span className="text-xs text-slate-500 font-medium">Step 3 of 5</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const IconComp = getCategoryIcon(cat.iconName);
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat)}
                  className="p-5 bg-white border border-gray-200 hover:border-orange-500 rounded-2xl text-left space-y-3 transition-all hover:shadow-md shadow-sm group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white group-hover:bg-orange-600 transition-colors">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-orange-600">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 4: Select Symptom */}
      {step === 'symptom' && selectedCategory && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setStep('category')}
                className="p-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl text-slate-700"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-black text-xs">
                    4
                  </span>
                  <span>Select Observed Symptom</span>
                </h2>
                <p className="text-xs text-slate-500">Category: {selectedCategory.title}</p>
              </div>
            </div>
            <span className="text-xs text-slate-500 font-medium">Step 4 of 5</span>
          </div>

          <div className="space-y-3">
            {symptoms
              .filter((s) => s.categoryId === selectedCategory.id)
              .map((sym) => (
                <div
                  key={sym.id}
                  onClick={() => handleSelectSymptom(sym)}
                  className="p-5 bg-white border border-gray-200 hover:border-orange-500 rounded-2xl cursor-pointer transition-all shadow-sm flex items-center justify-between group"
                >
                  <div className="space-y-1 max-w-2xl">
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-orange-600">
                      {sym.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {sym.description}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-900 group-hover:bg-orange-600 text-white flex items-center justify-center shrink-0">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* STEP 5: Guided Manual Inspection Card */}
      {step === 'inspection' && currentNode && (
        <div className="space-y-6">
          {/* Top Bar with Bike info & Restart */}
          <div className="flex flex-wrap items-center justify-between bg-white border border-gray-200 rounded-2xl p-4 gap-3 text-xs shadow-sm">
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-1 bg-orange-100 text-orange-800 font-bold rounded-lg border border-orange-200">
                {selectedModel?.brandName} {selectedModel?.modelName}
              </span>
              <span className="text-slate-600">
                Symptom: <strong className="text-slate-900">{selectedSymptom?.title}</strong>
              </span>
            </div>
            <button
              onClick={resetAll}
              className="flex items-center space-x-1.5 text-slate-600 hover:text-orange-600 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Diagnosis</span>
            </button>
          </div>

          {/* Main Inspection Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm relative">
            {/* Title & Step Header */}
            <div className="border-b border-gray-200 pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest flex items-center space-x-1">
                  <Wrench className="w-4 h-4" />
                  <span>Physical Inspection Step {userRecords.length + 1}</span>
                </span>
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-semibold">
                  Manual Test
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {currentNode.inspectionStep.title}
              </h2>
            </div>

            {/* Grid layout for inspection details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: What to inspect & Why it matters */}
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-1.5">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                    What to Inspect
                  </span>
                  <p className="text-slate-900 text-sm leading-relaxed font-semibold">
                    {currentNode.inspectionStep.whatToInspect}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-1.5">
                  <span className="font-bold text-amber-700 uppercase tracking-wider text-[10px] block flex items-center space-x-1">
                    <Info className="w-3.5 h-3.5 text-amber-600" />
                    <span>Why It Matters</span>
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {currentNode.inspectionStep.whyItMatters}
                  </p>
                </div>

                {/* Location & Tools */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                    <span className="font-bold text-slate-500 text-[10px] uppercase flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-orange-600" />
                      <span>Component Location</span>
                    </span>
                    <p className="text-slate-800 text-xs font-medium">
                      {currentNode.inspectionStep.locationDescription}
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                    <span className="font-bold text-slate-500 text-[10px] uppercase flex items-center space-x-1">
                      <Wrench className="w-3 h-3 text-orange-600" />
                      <span>Required Tools</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {currentNode.inspectionStep.requiredTools.map((tool) => (
                        <span key={tool} className="px-1.5 py-0.5 bg-white rounded text-[10px] text-slate-700 border border-gray-300 font-medium">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Step-by-Step Procedure */}
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 text-orange-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Inspection Procedure Steps</span>
                  </h4>
                  <ul className="space-y-2 text-slate-300">
                    {currentNode.inspectionStep.procedure.map((proc, idx) => (
                      <li key={idx} className="bg-slate-800 p-2.5 rounded-lg border border-slate-700 leading-relaxed">
                        {proc}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Normal vs Abnormal Reference Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-xl space-y-1">
                    <span className="font-bold text-green-700 text-[10px] uppercase flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      <span>Normal Condition (OK)</span>
                    </span>
                    <p className="text-slate-800 text-xs font-medium">
                      {currentNode.inspectionStep.normalCondition}
                    </p>
                  </div>

                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1">
                    <span className="font-bold text-red-700 text-[10px] uppercase flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 text-red-600" />
                      <span>Abnormal Condition (Fault)</span>
                    </span>
                    <p className="text-slate-800 text-xs font-medium">
                      {currentNode.inspectionStep.abnormalCondition}
                    </p>
                  </div>
                </div>

                {/* Safety Warning Box */}
                {currentNode.inspectionStep.safetyReminders.length > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-1 text-amber-800 text-xs">
                    <div className="flex items-center space-x-1.5 font-bold text-amber-900">
                      <Flame className="w-3.5 h-3.5 text-amber-600" />
                      <span>Safety Warning</span>
                    </div>
                    <p>{currentNode.inspectionStep.safetyReminders[0]}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Answer Input Buttons */}
            <div className="border-t border-gray-200 pt-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 text-center">
                What did your inspection reveal? Select your result:
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => handleInspectionAnswer('Normal')}
                  className="p-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>NORMAL (OK)</span>
                </button>

                <button
                  onClick={() => handleInspectionAnswer('Abnormal')}
                  className="p-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-95"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>ABNORMAL (Fault)</span>
                </button>

                <button
                  onClick={() => handleInspectionAnswer('Not Sure')}
                  className="p-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>NOT SURE</span>
                </button>

                <button
                  onClick={() => handleInspectionAnswer('Skip')}
                  className="p-3.5 bg-white hover:bg-gray-100 text-slate-700 font-bold rounded-xl border border-gray-300 flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>SKIP STEP</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: Inspection Summary & Recommended Repair */}
      {step === 'summary' && finalDiagnosis && (
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl p-4 text-xs shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              <span className="font-bold text-slate-900">Diagnosis Concluded</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => selectedSymptom && toggleSavedTroubleshooting(selectedSymptom.id)}
                className="px-3 py-1.5 bg-white hover:bg-gray-50 text-slate-700 font-semibold rounded-xl border border-gray-300"
              >
                Bookmark Diagnosis
              </button>
              <button
                onClick={resetAll}
                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl"
              >
                New Diagnosis
              </button>
            </div>
          </div>

          {/* Mandatory Prominent Disclaimer Banner */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-2 text-amber-900 shadow-sm">
            <div className="flex items-center space-x-2 font-black text-amber-800 text-sm uppercase tracking-wider">
              <ShieldAlert className="w-5 h-5 shrink-0 text-amber-700" />
              <span>Diagnostic Disclaimer</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold leading-relaxed">
              "This recommendation is based only on the inspection results provided by the user. It is not an automatic electronic diagnosis."
            </p>
          </div>

          {/* Main Diagnosis Result Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            {/* Motorcycle & Symptom Summary */}
            <div className="border-b border-gray-200 pb-4 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block">
                  Diagnostic Report
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  {selectedModel?.brandName} {selectedModel?.modelName}
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Observed Symptom: <span className="text-slate-900 font-bold">{selectedSymptom?.title}</span>
                </p>
              </div>

              <div className="flex flex-col sm:items-end text-xs space-y-1">
                <span className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-lg text-slate-800 font-semibold">
                  Difficulty: {finalDiagnosis.difficulty}
                </span>
                <span className="text-slate-500 font-medium">
                  Est. Time: <strong className="text-slate-900">{finalDiagnosis.estimatedMinutes} mins</strong>
                </span>
              </div>
            </div>

            {/* Performed Inspections Summary Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Summary of Performed Physical Inspections
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 text-slate-600 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Inspection Step</th>
                      <th className="p-3 text-right">User Finding</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userRecords.map((rec, idx) => (
                      <tr key={idx} className="hover:bg-white">
                        <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-medium text-slate-800">{rec.stepTitle}</td>
                        <td className="p-3 text-right">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                              rec.userAnswer === 'Abnormal'
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : rec.userAnswer === 'Normal'
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {rec.userAnswer}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cause & Explanation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest block">
                  Most Likely Root Cause
                </span>
                <h4 className="text-base font-bold text-slate-900">
                  {finalDiagnosis.mostLikelyCause}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {finalDiagnosis.explanation}
                </p>
              </div>

              <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block">
                  Other Secondary Causes
                </span>
                <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                  {finalDiagnosis.otherCauses.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Repair Action Box */}
            <div className="p-6 bg-slate-900 text-white border-2 border-orange-500 rounded-2xl space-y-4 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-orange-400 flex items-center space-x-1.5">
                  <Wrench className="w-4 h-4" />
                  <span>Recommended Repair Action</span>
                </span>
                <span className="text-xs text-slate-300">
                  Est. Repair Time: {finalDiagnosis.estimatedMinutes} mins
                </span>
              </div>

              <p className="text-sm font-semibold text-white leading-relaxed">
                {finalDiagnosis.recommendedRepair}
              </p>

              {/* Required Tools List */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Required Tools for Repair:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {finalDiagnosis.requiredTools.map((tool) => (
                    <span key={tool} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-md text-xs text-slate-200">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Link to Guide if available */}
              {finalDiagnosis.relatedGuideId && onNavigateToGuide && (
                <div className="pt-2">
                  <button
                    onClick={() => onNavigateToGuide(finalDiagnosis.relatedGuideId!, 'replacement')}
                    className="inline-flex items-center space-x-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Open Step-by-Step Replacement Guide</span>
                  </button>
                </div>
              )}

              {finalDiagnosis.relatedTechniqueId && onNavigateToGuide && (
                <div className="pt-2">
                  <button
                    onClick={() => onNavigateToGuide(finalDiagnosis.relatedTechniqueId!, 'technique')}
                    className="inline-flex items-center space-x-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Open Multimeter / Workshop Technique Guide</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
