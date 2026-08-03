import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  Database,
  Users,
  Wrench,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Tag,
  Cpu,
  Layers,
  Activity,
  FileText,
  X,
  ChevronRight,
  Info,
  MessageSquare,
  Clock,
  ShieldAlert,
  Star,
  ThumbsUp,
  XCircle,
  Filter,
  Search
} from 'lucide-react';
import {
  MotorcycleModel,
  Brand,
  ReplacementGuide,
  ProblemCategory,
  Symptom,
  TroubleshootingNode,
  CommunityPost
} from '../../types';
import { api } from '../../services/api';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'troubleshooting' | 'models' | 'guides' | 'community'>('troubleshooting');
  const [troubleSubTab, setTroubleSubTab] = useState<'brand' | 'model' | 'problem' | 'symptom' | 'inspection'>('brand');

  const [stats, setStats] = useState<any>({});

  // Loaded database items
  const [models, setModels] = useState<MotorcycleModel[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [guides, setGuides] = useState<ReplacementGuide[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [categories, setCategories] = useState<ProblemCategory[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [nodes, setNodes] = useState<Record<string, TroubleshootingNode>>({});

  // --- COMMUNITY MODERATION STATE ---
  const [communityFilter, setCommunityFilter] = useState<'pending' | 'all' | 'approved' | 'rejected'>('pending');
  const [communitySearch, setCommunitySearch] = useState('');
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [editPostTitle, setEditPostTitle] = useState('');
  const [editPostContent, setEditPostContent] = useState('');
  const [editPostCategory, setEditPostCategory] = useState<'Troubleshooting Help' | 'DIY Repairs' | 'Maintenance Tip' | 'General'>('Troubleshooting Help');
  const [editPostSymptomTag, setEditPostSymptomTag] = useState('');

  // --- 1. BRAND FORM STATE ---
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandName, setBrandName] = useState('');
  const [brandCountry, setBrandCountry] = useState('Japan');
  const [brandLogoUrl, setBrandLogoUrl] = useState('');

  // --- 2. MODEL FORM STATE ---
  const [showModelModal, setShowModelModal] = useState(false);
  const [editingModel, setEditingModel] = useState<MotorcycleModel | null>(null);
  const [modelName, setModelName] = useState('');
  const [modelBrandId, setModelBrandId] = useState('');
  const [modelCategory, setModelCategory] = useState<'Scooter' | 'Underbone' | 'Backbone' | 'Big Bike'>('Scooter');
  const [modelCc, setModelCc] = useState('125 cc');
  const [modelFuel, setModelFuel] = useState<'Fuel Injection (FI)' | 'Carburetor'>('Fuel Injection (FI)');
  const [modelTransmission, setModelTransmission] = useState<'Automatic (CVT)' | 'Manual (Chain)' | 'Semi-Automatic'>('Automatic (CVT)');
  const [modelImg, setModelImg] = useState('');
  const [modelDesc, setModelDesc] = useState('');

  // --- 3. PROBLEM CATEGORY FORM STATE ---
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProblemCategory | null>(null);
  const [categoryTitle, setCategoryTitle] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('PowerOff');

  // --- 4. SYMPTOM FORM STATE ---
  const [showSymptomModal, setShowSymptomModal] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState<Symptom | null>(null);
  const [symptomTitle, setSymptomTitle] = useState('');
  const [symptomCategoryId, setSymptomCategoryId] = useState('');
  const [symptomDesc, setSymptomDesc] = useState('');
  const [symptomInitialNodeId, setSymptomInitialNodeId] = useState('');

  // --- 5. INSPECTION / NODE FORM STATE ---
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [editingNode, setEditingNode] = useState<TroubleshootingNode | null>(null);
  const [nodeId, setNodeId] = useState('');
  const [nodeSymptomId, setNodeSymptomId] = useState('');
  const [nodeTitle, setNodeTitle] = useState('');
  const [nodeWhatToInspect, setNodeWhatToInspect] = useState('');
  const [nodeWhyItMatters, setNodeWhyItMatters] = useState('');
  const [nodeLocation, setNodeLocation] = useState('');
  const [nodeTools, setNodeTools] = useState('');
  const [nodeProcedure, setNodeProcedure] = useState('');
  const [nodeNormalCond, setNodeNormalCond] = useState('');
  const [nodeAbnormalCond, setNodeAbnormalCond] = useState('');
  const [nodeSafety, setNodeSafety] = useState('');
  const [nodeNextNormalId, setNodeNextNormalId] = useState('');
  const [nodeNextAbnormalId, setNodeNextAbnormalId] = useState('');
  const [nodeDiagCause, setNodeDiagCause] = useState('');
  const [nodeDiagExplanation, setNodeDiagExplanation] = useState('');
  const [nodeDiagRepair, setNodeDiagRepair] = useState('');
  const [nodeDiagDifficulty, setNodeDiagDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [nodeDiagTime, setNodeDiagTime] = useState<number>(30);

  // --- REPLACEMENT GUIDES STATE ---
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [editingGuide, setEditingGuide] = useState<ReplacementGuide | null>(null);
  const [guideTitle, setGuideTitle] = useState('');
  const [guideCategory, setGuideCategory] = useState<'Maintenance' | 'Engine' | 'Electrical' | 'Fuel System' | 'Brakes' | 'Transmission' | 'Tires & Wheels'>('Maintenance');
  const [guideComponentName, setGuideComponentName] = useState('');
  const [guideDifficulty, setGuideDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [guideEstTime, setGuideEstTime] = useState<number>(20);
  const [guideSummary, setGuideSummary] = useState('');
  const [guideTools, setGuideTools] = useState('');
  const [guideSafety, setGuideSafety] = useState('');
  const [guideMistakes, setGuideMistakes] = useState('');
  const [guideImageUrl, setGuideImageUrl] = useState('');
  const [guideSteps, setGuideSteps] = useState<{ stepNumber: number; title: string; instruction: string; imageUrl?: string }[]>([
    { stepNumber: 1, title: 'Initial Inspection', instruction: 'Inspect component before starting.' }
  ]);

  // --- DELETE CONFIRMATION STATE ---
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'brand' | 'model' | 'category' | 'symptom' | 'node' | 'guide' | 'post';
    id: string;
    name: string;
  } | null>(null);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    setDeleteTarget(null);

    try {
      if (type === 'brand') {
        await api.deleteBrand(id);
        setBrands((prev) => prev.filter((b) => b.id !== id));
      } else if (type === 'model') {
        await api.deleteMotorcycle(id);
        setModels((prev) => prev.filter((m) => m.id !== id));
      } else if (type === 'category') {
        await api.deleteProblemCategory(id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else if (type === 'symptom') {
        await api.deleteSymptom(id);
        setSymptoms((prev) => prev.filter((s) => s.id !== id));
      } else if (type === 'node') {
        await api.deleteTroubleshootingNode(id);
        setNodes((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      } else if (type === 'guide') {
        await api.deleteReplacementGuide(id);
        setGuides((prev) => prev.filter((g) => g.id !== id));
      } else if (type === 'post') {
        await api.deletePost(id);
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(`Error deleting ${type}:`, err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [mList, bList, gList, pList, cList, sList, nMap, sData] = await Promise.all([
      api.getMotorcycles(),
      api.getBrands(),
      api.getReplacementGuides(),
      api.getPosts(),
      api.getProblemCategories(),
      api.getSymptoms(),
      api.getAllTroubleshootingNodes(),
      api.getAdminStats()
    ]);
    setModels(mList || []);
    setBrands(bList || []);
    setGuides(gList || []);
    setPosts(pList || []);
    setCategories(cList || []);
    setSymptoms(sList || []);
    setNodes(nMap || {});
    setStats(sData || {});
  };

  // --- 1. BRAND HANDLERS ---
  const handleOpenAddBrand = () => {
    setEditingBrand(null);
    setBrandName('');
    setBrandCountry('Japan');
    setBrandLogoUrl('');
    setShowBrandModal(true);
  };

  const handleOpenEditBrand = (b: Brand) => {
    setEditingBrand(b);
    setBrandName(b.name);
    setBrandCountry(b.country);
    setBrandLogoUrl(b.logoUrl || '');
    setShowBrandModal(true);
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name: brandName, country: brandCountry, logoUrl: brandLogoUrl };
    try {
      if (editingBrand) {
        const updated = await api.updateBrand(editingBrand.id, payload);
        const finalBrand = { ...editingBrand, ...payload, ...updated };
        setBrands((prev) => prev.map((b) => (b.id === editingBrand.id ? finalBrand : b)));
      } else {
        const created = await api.createBrand(payload);
        const newBrand: Brand = {
          id: created?.id || `b_${Date.now()}`,
          name: brandName,
          country: brandCountry,
          logoUrl: brandLogoUrl
        };
        setBrands((prev) => [...prev, newBrand]);
      }
    } catch (err) {
      console.error('Error saving brand:', err);
      if (editingBrand) {
        setBrands((prev) => prev.map((b) => (b.id === editingBrand.id ? { ...b, ...payload } : b)));
      } else {
        setBrands((prev) => [...prev, { id: `b_${Date.now()}`, ...payload }]);
      }
    }
    setShowBrandModal(false);
  };

  const handleDeleteBrand = (id: string) => {
    const brand = brands.find((b) => b.id === id);
    setDeleteTarget({ type: 'brand', id, name: brand?.name || id });
  };

  // --- 2. MODEL HANDLERS ---
  const handleOpenAddModel = () => {
    setEditingModel(null);
    setModelName('');
    setModelBrandId(brands[0]?.id || 'b_honda');
    setModelCategory('Scooter');
    setModelCc('125 cc');
    setModelFuel('Fuel Injection (FI)');
    setModelTransmission('Automatic (CVT)');
    setModelImg('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80');
    setModelDesc('Motorcycle model entry');
    setShowModelModal(true);
  };

  const handleOpenEditModel = (m: MotorcycleModel) => {
    setEditingModel(m);
    setModelName(m.modelName);
    setModelBrandId(m.brandId);
    setModelCategory(m.category);
    setModelCc(m.engineDisplacement);
    setModelFuel(m.fuelSystem);
    setModelTransmission(m.transmission || 'Automatic (CVT)');
    setModelImg(m.imageUrl);
    setModelDesc(m.description || '');
    setShowModelModal(true);
  };

  const handleSaveModel = async (e: React.FormEvent) => {
    e.preventDefault();
    const brand = brands.find((b) => b.id === modelBrandId);
    const payload: Partial<MotorcycleModel> = {
      brandId: modelBrandId || (brands[0]?.id || 'b_honda'),
      brandName: brand ? brand.name : (brands[0]?.name || 'Honda'),
      modelName: modelName.trim(),
      category: modelCategory || 'Scooter',
      engineDisplacement: modelCc || '125 cc',
      fuelSystem: modelFuel || 'Fuel Injection (FI)',
      transmission: modelTransmission || 'Automatic (CVT)',
      coolingSystem: 'Air Cooled',
      oilCapacity: '0.8 Liters',
      sparkPlugType: 'NGK CPR9EA-9',
      batteryType: '12V 5Ah',
      tireSizeFront: '80/90-14',
      tireSizeRear: '90/90-14',
      imageUrl: modelImg || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      description: modelDesc || 'Motorcycle model database record.',
      commonIssues: ['Regular maintenance check required']
    };

    try {
      if (editingModel) {
        const updated = await api.updateMotorcycle(editingModel.id, payload);
        const finalModel = { ...editingModel, ...payload, ...updated };
        setModels((prev) => prev.map((m) => (m.id === editingModel.id ? finalModel : m)));
      } else {
        const created = await api.createMotorcycle(payload);
        const newModel: MotorcycleModel = {
          id: created?.id || `m_${Date.now()}`,
          ...(payload as MotorcycleModel)
        };
        setModels((prev) => [...prev, newModel]);
      }
    } catch (err) {
      console.error('Error saving model:', err);
      const fallbackModel: MotorcycleModel = {
        id: editingModel ? editingModel.id : `m_${Date.now()}`,
        brandId: modelBrandId || 'b_honda',
        brandName: brand ? brand.name : 'Honda',
        modelName: modelName.trim() || 'New Model',
        category: modelCategory || 'Scooter',
        engineDisplacement: modelCc || '125 cc',
        fuelSystem: modelFuel || 'Fuel Injection (FI)',
        transmission: modelTransmission || 'Automatic (CVT)',
        coolingSystem: 'Air Cooled',
        oilCapacity: '0.8 Liters',
        sparkPlugType: 'Standard',
        batteryType: '12V',
        tireSizeFront: '80/90-14',
        tireSizeRear: '90/90-14',
        imageUrl: modelImg || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
        description: modelDesc || 'Motorcycle model entry',
        commonIssues: []
      };
      if (editingModel) {
        setModels((prev) => prev.map((m) => (m.id === editingModel.id ? fallbackModel : m)));
      } else {
        setModels((prev) => [...prev, fallbackModel]);
      }
    }
    setShowModelModal(false);
  };

  const handleDeleteModel = (id: string) => {
    const model = models.find((m) => m.id === id);
    setDeleteTarget({ type: 'model', id, name: model?.modelName || id });
  };

  // --- 3. PROBLEM CATEGORY HANDLERS ---
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryTitle('');
    setCategoryDesc('');
    setCategoryIcon('PowerOff');
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (c: ProblemCategory) => {
    setEditingCategory(c);
    setCategoryTitle(c.title);
    setCategoryDesc(c.description);
    setCategoryIcon(c.iconName || 'PowerOff');
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: categoryTitle,
      description: categoryDesc,
      iconName: categoryIcon
    };
    if (editingCategory) {
      const updated = await api.updateProblemCategory(editingCategory.id, payload);
      setCategories(categories.map((c) => (c.id === editingCategory.id ? { ...c, ...updated } : c)));
    } else {
      const created = await api.createProblemCategory(payload);
      setCategories([...categories, created]);
    }
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    setDeleteTarget({ type: 'category', id, name: cat?.title || id });
  };

  // --- 4. SYMPTOM HANDLERS ---
  const handleOpenAddSymptom = () => {
    setEditingSymptom(null);
    setSymptomTitle('');
    setSymptomCategoryId(categories[0]?.id || 'cat_wont_start');
    setSymptomDesc('');
    setSymptomInitialNodeId(Object.keys(nodes)[0] || 'node_crank_1_spark');
    setShowSymptomModal(true);
  };

  const handleOpenEditSymptom = (s: Symptom) => {
    setEditingSymptom(s);
    setSymptomTitle(s.title);
    setSymptomCategoryId(s.categoryId);
    setSymptomDesc(s.description);
    setSymptomInitialNodeId(s.initialNodeId);
    setShowSymptomModal(true);
  };

  const handleSaveSymptom = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      categoryId: symptomCategoryId,
      title: symptomTitle,
      description: symptomDesc,
      initialNodeId: symptomInitialNodeId
    };

    if (editingSymptom) {
      const updated = await api.updateSymptom(editingSymptom.id, payload);
      setSymptoms(symptoms.map((s) => (s.id === editingSymptom.id ? { ...s, ...updated } : s)));
    } else {
      const created = await api.createSymptom(payload);
      setSymptoms([...symptoms, created]);
    }
    setShowSymptomModal(false);
  };

  const handleDeleteSymptom = (id: string) => {
    const sym = symptoms.find((s) => s.id === id);
    setDeleteTarget({ type: 'symptom', id, name: sym?.title || id });
  };

  // --- 5. INSPECTION / NODE HANDLERS ---
  const handleOpenAddNode = () => {
    setEditingNode(null);
    const genId = `node_step_${Date.now()}`;
    setNodeId(genId);
    setNodeSymptomId(symptoms[0]?.id || 'sym_cranks_no_start');
    setNodeTitle('Inspection: Voltage & Ignition Test');
    setNodeWhatToInspect('Check voltage across battery terminals or spark plug ignition.');
    setNodeWhyItMatters('Ensures adequate voltage or spark is delivered to ignition circuit.');
    setNodeLocation('Battery compartment under floorboard / cylinder head');
    setNodeTools('Digital Multimeter, Spark Plug Socket');
    setNodeProcedure('1. Turn ignition switch ON.\n2. Measure voltage or observe spark plug electrode.');
    setNodeNormalCond('Voltage is 12.4V DC or higher; sharp blue spark produced.');
    setNodeAbnormalCond('Voltage below 12.0V DC; faint orange or missing spark.');
    setNodeSafety('Wear protective gloves when handling high voltage or battery leads.');
    setNodeNextNormalId('');
    setNodeNextAbnormalId('');
    setNodeDiagCause('Weak Battery or Faulty Ignition Plug/Coil');
    setNodeDiagExplanation('Insufficient voltage or broken coil prevents spark ignition.');
    setNodeDiagRepair('Recharge/replace 12V battery or install new NGK spark plug.');
    setNodeDiagDifficulty('Beginner');
    setNodeDiagTime(15);
    setShowNodeModal(true);
  };

  const handleOpenEditNode = (n: TroubleshootingNode) => {
    setEditingNode(n);
    setNodeId(n.id);
    setNodeSymptomId(n.symptomId);
    setNodeTitle(n.inspectionStep?.title || '');
    setNodeWhatToInspect(n.inspectionStep?.whatToInspect || '');
    setNodeWhyItMatters(n.inspectionStep?.whyItMatters || '');
    setNodeLocation(n.inspectionStep?.locationDescription || '');
    setNodeTools((n.inspectionStep?.requiredTools || []).join(', '));
    setNodeProcedure((n.inspectionStep?.procedure || []).join('\n'));
    setNodeNormalCond(n.inspectionStep?.normalCondition || '');
    setNodeAbnormalCond(n.inspectionStep?.abnormalCondition || '');
    setNodeSafety((n.inspectionStep?.safetyReminders || []).join(', '));
    setNodeNextNormalId(n.nextStepOnNormalId || '');
    setNodeNextAbnormalId(n.nextStepOnAbnormalId || '');

    if (n.diagnosisIfAbnormal) {
      setNodeDiagCause(n.diagnosisIfAbnormal.mostLikelyCause || '');
      setNodeDiagExplanation(n.diagnosisIfAbnormal.explanation || '');
      setNodeDiagRepair(n.diagnosisIfAbnormal.recommendedRepair || '');
      setNodeDiagDifficulty(n.diagnosisIfAbnormal.difficulty || 'Intermediate');
      setNodeDiagTime(n.diagnosisIfAbnormal.estimatedMinutes || 30);
    } else {
      setNodeDiagCause('');
      setNodeDiagExplanation('');
      setNodeDiagRepair('');
      setNodeDiagDifficulty('Intermediate');
      setNodeDiagTime(30);
    }

    setShowNodeModal(true);
  };

  const handleSaveNode = async (e: React.FormEvent) => {
    e.preventDefault();
    const procArray = nodeProcedure.split('\n').filter((s) => s.trim().length > 0);
    const toolArray = nodeTools.split(',').map((s) => s.trim()).filter(Boolean);
    const safetyArray = nodeSafety.split(',').map((s) => s.trim()).filter(Boolean);

    const payload: TroubleshootingNode = {
      id: nodeId,
      symptomId: nodeSymptomId,
      inspectionStep: {
        id: `step_${nodeId}`,
        title: nodeTitle,
        whatToInspect: nodeWhatToInspect,
        whyItMatters: nodeWhyItMatters,
        locationDescription: nodeLocation,
        requiredTools: toolArray,
        procedure: procArray,
        normalCondition: nodeNormalCond,
        abnormalCondition: nodeAbnormalCond,
        safetyReminders: safetyArray
      },
      nextStepOnNormalId: nodeNextNormalId || undefined,
      nextStepOnAbnormalId: nodeNextAbnormalId || undefined,
      diagnosisIfAbnormal: nodeDiagCause
        ? {
            mostLikelyCause: nodeDiagCause,
            otherCauses: [],
            explanation: nodeDiagExplanation,
            recommendedRepair: nodeDiagRepair,
            difficulty: nodeDiagDifficulty,
            estimatedMinutes: Number(nodeDiagTime) || 30,
            requiredTools: toolArray
          }
        : undefined
    };

    const saved = await api.updateTroubleshootingNode(nodeId, payload);
    setNodes({ ...nodes, [nodeId]: saved });
    setShowNodeModal(false);
  };

  const handleDeleteNode = (id: string) => {
    const node = nodes[id];
    setDeleteTarget({ type: 'node', id, name: node?.inspectionStep?.title || id });
  };

  // --- REPLACEMENT GUIDE HANDLERS ---
  const handleOpenAddGuide = () => {
    setEditingGuide(null);
    setGuideTitle('');
    setGuideCategory('Maintenance');
    setGuideComponentName('');
    setGuideDifficulty('Beginner');
    setGuideEstTime(20);
    setGuideSummary('');
    setGuideTools('8mm Socket, Screwdriver, Clean Cloth');
    setGuideSafety('Always wear eye protection and gloves.');
    setGuideMistakes('Over-tightening bolts without torque specification.');
    setGuideImageUrl('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80');
    setGuideSteps([
      { stepNumber: 1, title: 'Preparation & Safety Check', instruction: 'Park motorcycle on center stand and allow engine to cool down.' }
    ]);
    setShowGuideModal(true);
  };

  const handleOpenEditGuide = (guide: ReplacementGuide) => {
    setEditingGuide(guide);
    setGuideTitle(guide.title || '');
    setGuideCategory(guide.category || 'Maintenance');
    setGuideComponentName(guide.componentName || '');
    setGuideDifficulty(guide.difficulty || 'Beginner');
    setGuideEstTime(guide.estimatedMinutes || 20);
    setGuideSummary(guide.summary || '');
    setGuideTools((guide.requiredTools || []).join(', '));
    setGuideSafety((guide.safetyReminders || []).join(', '));
    setGuideMistakes((guide.commonMistakes || []).join(', '));
    setGuideImageUrl(guide.imageUrl || '');
    setGuideSteps(
      guide.steps && guide.steps.length > 0
        ? guide.steps.map((s, idx) => ({
            stepNumber: s.stepNumber || idx + 1,
            title: s.title || `Step ${idx + 1}`,
            instruction: s.instruction || '',
            imageUrl: s.imageUrl || ''
          }))
        : [{ stepNumber: 1, title: 'Step 1', instruction: '' }]
    );
    setShowGuideModal(true);
  };

  const handleSaveGuide = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<ReplacementGuide> = {
      title: guideTitle,
      category: guideCategory,
      componentName: guideComponentName || guideTitle,
      difficulty: guideDifficulty,
      estimatedMinutes: Number(guideEstTime) || 20,
      summary: guideSummary,
      requiredTools: guideTools.split(',').map((s) => s.trim()).filter(Boolean),
      safetyReminders: guideSafety.split(',').map((s) => s.trim()).filter(Boolean),
      commonMistakes: guideMistakes.split(',').map((s) => s.trim()).filter(Boolean),
      imageUrl: guideImageUrl,
      steps: guideSteps.map((s, idx) => ({
        stepNumber: idx + 1,
        title: s.title || `Step ${idx + 1}`,
        instruction: s.instruction || '',
        imageUrl: s.imageUrl || ''
      }))
    };

    try {
      if (editingGuide) {
        const updated = await api.updateReplacementGuide(editingGuide.id, payload);
        const finalGuide = { ...editingGuide, ...payload, ...updated };
        setGuides((prev) => prev.map((g) => (g.id === editingGuide.id ? finalGuide : g)));
      } else {
        const created = await api.createReplacementGuide(payload);
        const newGuide: ReplacementGuide = {
          id: created?.id || `rg_${Date.now()}`,
          ...(payload as ReplacementGuide)
        };
        setGuides((prev) => [...prev, newGuide]);
      }
    } catch (err) {
      console.error('Error saving guide:', err);
      if (editingGuide) {
        setGuides((prev) =>
          prev.map((g) => (g.id === editingGuide.id ? ({ ...g, ...payload } as ReplacementGuide) : g))
        );
      } else {
        setGuides((prev) => [...prev, { id: `rg_${Date.now()}`, ...payload } as ReplacementGuide]);
      }
    }

    setShowGuideModal(false);
  };

  const handleDeleteGuide = (id: string) => {
    const guide = guides.find((g) => g.id === id);
    setDeleteTarget({ type: 'guide', id, name: guide?.title || id });
  };

  const handleAddStep = () => {
    setGuideSteps([
      ...guideSteps,
      {
        stepNumber: guideSteps.length + 1,
        title: `Step ${guideSteps.length + 1}`,
        instruction: ''
      }
    ]);
  };

  const handleRemoveStep = (index: number) => {
    if (guideSteps.length <= 1) return;
    const updated = guideSteps.filter((_, idx) => idx !== index);
    setGuideSteps(updated.map((s, idx) => ({ ...s, stepNumber: idx + 1 })));
  };

  const handleStepChange = (index: number, field: string, value: string) => {
    const updated = [...guideSteps];
    updated[index] = { ...updated[index], [field]: value };
    setGuideSteps(updated);
  };

  // --- COMMUNITY MODERATION HANDLERS ---
  const handleApproveCommunityPost = async (postId: string) => {
    await api.moderatePost(postId, 'approve');
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status: 'approved', spamFlagged: false } : p))
    );
  };

  const handleDismissCommunityPost = async (postId: string) => {
    await api.moderatePost(postId, 'reject');
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, status: 'rejected' } : p))
    );
  };

  const handleDeleteCommunityPost = (post: CommunityPost) => {
    setDeleteTarget({
      type: 'post',
      id: post.id,
      name: `Community Post: "${post.title}"`
    });
  };

  const handleOpenEditCommunityPost = (post: CommunityPost) => {
    setEditingPost(post);
    setEditPostTitle(post.title);
    setEditPostContent(post.content);
    setEditPostCategory(post.category);
    setEditPostSymptomTag(post.symptomTag || '');
    setShowEditPostModal(true);
  };

  const handleSaveCommunityPostEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !editPostTitle || !editPostContent) return;

    const updated = await api.updatePost(editingPost.id, {
      title: editPostTitle,
      content: editPostContent,
      category: editPostCategory,
      symptomTag: editPostSymptomTag || undefined
    });

    setPosts((prev) => prev.map((p) => (p.id === editingPost.id ? updated : p)));
    setShowEditPostModal(false);
    setEditingPost(null);
  };

  const nodeListArray: TroubleshootingNode[] = Object.values(nodes);

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-xs font-bold text-red-400 uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Motorel System Administrator Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Database & Content Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Manage motorcycle brands, models, problem categories, symptoms, guided troubleshooting inspection nodes, and repair guides.
            </p>
          </div>

          <button
            onClick={loadData}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Database</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
          <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
            <span className="text-slate-400 block font-medium">Brands</span>
            <span className="text-lg font-black text-white">{brands.length}</span>
          </div>
          <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
            <span className="text-slate-400 block font-medium">Models</span>
            <span className="text-lg font-black text-white">{models.length}</span>
          </div>
          <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
            <span className="text-slate-400 block font-medium">Problem Categories</span>
            <span className="text-lg font-black text-white">{categories.length}</span>
          </div>
          <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
            <span className="text-slate-400 block font-medium">Symptoms</span>
            <span className="text-lg font-black text-white">{symptoms.length}</span>
          </div>
          <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl space-y-1">
            <span className="text-slate-400 block font-medium">Inspection Steps</span>
            <span className="text-lg font-black text-white">{nodeListArray.length}</span>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-t border-slate-800 pt-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('troubleshooting')}
            className={`px-4 py-2 rounded-xl transition-all shadow-sm flex items-center space-x-2 ${
              activeTab === 'troubleshooting'
                ? 'bg-orange-500 text-slate-950 font-black'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Guided Manual Troubleshooting</span>
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`px-4 py-2 rounded-xl transition-all shadow-sm flex items-center space-x-2 ${
              activeTab === 'models'
                ? 'bg-orange-500 text-slate-950 font-black'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Manage Motorcycles ({models.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('guides')}
            className={`px-4 py-2 rounded-xl transition-all shadow-sm flex items-center space-x-2 ${
              activeTab === 'guides'
                ? 'bg-orange-500 text-slate-950 font-black'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Manage Guides ({guides.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`px-4 py-2 rounded-xl transition-all shadow-sm flex items-center space-x-2 ${
              activeTab === 'community'
                ? 'bg-orange-500 text-slate-950 font-black'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Community Posts & Spam Moderation</span>
            {posts.filter((p) => p.status === 'pending').length > 0 && (
              <span className="px-2 py-0.5 bg-red-600 text-white rounded-full text-[10px] font-black animate-pulse">
                {posts.filter((p) => p.status === 'pending').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* --- TAB: GUIDED MANUAL TROUBLESHOOTING --- */}
      {activeTab === 'troubleshooting' && (
        <div className="space-y-5">
          {/* Troubleshooting Sub-Navigation (5 Layers) */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                  <Wrench className="w-4 h-4 text-orange-600" />
                  <span>Guided Manual Troubleshooting Manager</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Manage all 5 steps of the diagnostic decision tree: 1. Brand &rarr; 2. Model &rarr; 3. Problem &rarr; 4. Symptom &rarr; 5. Inspection
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-gray-100 text-xs font-bold">
              <button
                onClick={() => setTroubleSubTab('brand')}
                className={`px-3 py-2 rounded-xl border text-center transition-all ${
                  troubleSubTab === 'brand'
                    ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                    : 'bg-gray-50 text-slate-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                1. Brand ({brands.length})
              </button>
              <button
                onClick={() => setTroubleSubTab('model')}
                className={`px-3 py-2 rounded-xl border text-center transition-all ${
                  troubleSubTab === 'model'
                    ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                    : 'bg-gray-50 text-slate-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                2. Model ({models.length})
              </button>
              <button
                onClick={() => setTroubleSubTab('problem')}
                className={`px-3 py-2 rounded-xl border text-center transition-all ${
                  troubleSubTab === 'problem'
                    ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                    : 'bg-gray-50 text-slate-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                3. Problem ({categories.length})
              </button>
              <button
                onClick={() => setTroubleSubTab('symptom')}
                className={`px-3 py-2 rounded-xl border text-center transition-all ${
                  troubleSubTab === 'symptom'
                    ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                    : 'bg-gray-50 text-slate-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                4. Symptom ({symptoms.length})
              </button>
              <button
                onClick={() => setTroubleSubTab('inspection')}
                className={`px-3 py-2 rounded-xl border text-center transition-all ${
                  troubleSubTab === 'inspection'
                    ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                    : 'bg-gray-50 text-slate-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                5. Inspection ({nodeListArray.length})
              </button>
            </div>
          </div>

          {/* Sub-tab 1: BRANDS */}
          {troubleSubTab === 'brand' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">1. Motorcycle Brands</h4>
                <button
                  onClick={handleOpenAddBrand}
                  className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Brand</span>
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="p-3.5">Brand Name</th>
                      <th className="p-3.5">Country</th>
                      <th className="p-3.5">Brand ID</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {brands.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50/80">
                        <td className="p-3.5 font-bold text-slate-900">{b.name}</td>
                        <td className="p-3.5 text-slate-700 font-medium">{b.country}</td>
                        <td className="p-3.5 text-slate-500 font-mono text-[11px]">{b.id}</td>
                        <td className="p-3.5 text-right space-x-1.5">
                          <button
                            onClick={() => handleOpenEditBrand(b)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300"
                            title="Edit Brand"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBrand(b.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200"
                            title="Delete Brand"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-tab 2: MODELS */}
          {troubleSubTab === 'model' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">2. Motorcycle Models</h4>
                <button
                  onClick={handleOpenAddModel}
                  className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Model</span>
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="p-3.5">Model Name</th>
                      <th className="p-3.5">Brand</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Displacement</th>
                      <th className="p-3.5">Fuel System</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {models.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50/80">
                        <td className="p-3.5 font-bold text-slate-900 flex items-center space-x-2">
                          <img
                            src={m.imageUrl}
                            alt={m.modelName}
                            className="w-8 h-8 rounded-lg object-cover border border-gray-300"
                            referrerPolicy="no-referrer"
                          />
                          <span>{m.modelName}</span>
                        </td>
                        <td className="p-3.5 text-slate-700 font-medium">{m.brandName}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-[10px] font-semibold border border-orange-200">
                            {m.category}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-700 font-medium">{m.engineDisplacement}</td>
                        <td className="p-3.5 text-slate-700 font-medium">{m.fuelSystem}</td>
                        <td className="p-3.5 text-right space-x-1.5">
                          <button
                            onClick={() => handleOpenEditModel(m)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300"
                            title="Edit Model"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteModel(m.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200"
                            title="Delete Model"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-tab 3: PROBLEMS */}
          {troubleSubTab === 'problem' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">3. Problem Categories</h4>
                <button
                  onClick={handleOpenAddCategory}
                  className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Problem Category</span>
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="p-3.5">Category Title</th>
                      <th className="p-3.5">Description</th>
                      <th className="p-3.5">Icon</th>
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categories.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50/80">
                        <td className="p-3.5 font-bold text-slate-900">{c.title}</td>
                        <td className="p-3.5 text-slate-700 max-w-xs">{c.description}</td>
                        <td className="p-3.5 text-slate-600 font-mono text-[11px]">{c.iconName || 'PowerOff'}</td>
                        <td className="p-3.5 text-slate-500 font-mono text-[11px]">{c.id}</td>
                        <td className="p-3.5 text-right space-x-1.5">
                          <button
                            onClick={() => handleOpenEditCategory(c)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300"
                            title="Edit Category"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(c.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-tab 4: SYMPTOMS */}
          {troubleSubTab === 'symptom' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">4. Symptoms</h4>
                <button
                  onClick={handleOpenAddSymptom}
                  className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Symptom</span>
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="p-3.5">Symptom Title</th>
                      <th className="p-3.5">Problem Category</th>
                      <th className="p-3.5">Initial Node</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {symptoms.map((s) => {
                      const cat = categories.find((c) => c.id === s.categoryId);
                      return (
                        <tr key={s.id} className="hover:bg-gray-50/80">
                          <td className="p-3.5 font-bold text-slate-900">{s.title}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-[10px] font-semibold border border-orange-200">
                              {cat ? cat.title : s.categoryId}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-600 font-mono text-[11px]">{s.initialNodeId}</td>
                          <td className="p-3.5 text-right space-x-1.5">
                            <button
                              onClick={() => handleOpenEditSymptom(s)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300"
                              title="Edit Symptom"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSymptom(s.id)}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200"
                              title="Delete Symptom"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-tab 5: INSPECTIONS */}
          {troubleSubTab === 'inspection' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">5. Inspection Steps & Decision Nodes</h4>
                <button
                  onClick={handleOpenAddNode}
                  className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Inspection Step</span>
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="p-3.5">Inspection Title</th>
                      <th className="p-3.5">Symptom ID</th>
                      <th className="p-3.5">What to Inspect</th>
                      <th className="p-3.5">Normal / Abnormal Condition</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {nodeListArray.map((n) => (
                      <tr key={n.id} className="hover:bg-gray-50/80">
                        <td className="p-3.5 font-bold text-slate-900">{n.inspectionStep?.title || n.id}</td>
                        <td className="p-3.5 text-slate-600 font-mono text-[11px]">{n.symptomId}</td>
                        <td className="p-3.5 text-slate-700 max-w-xs truncate">{n.inspectionStep?.whatToInspect}</td>
                        <td className="p-3.5 text-slate-600 text-[11px] max-w-xs space-y-1">
                          <div className="text-emerald-700"><span className="font-bold">Normal:</span> {n.inspectionStep?.normalCondition}</div>
                          <div className="text-red-700"><span className="font-bold">Abnormal:</span> {n.inspectionStep?.abnormalCondition}</div>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5">
                          <button
                            onClick={() => handleOpenEditNode(n)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300"
                            title="Edit Inspection Node"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteNode(n.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200"
                            title="Delete Inspection Node"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TAB: MODELS --- */}
      {activeTab === 'models' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Motorcycle Database Records</h3>
            <button
              onClick={handleOpenAddModel}
              className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Motorcycle Model</span>
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                <tr>
                  <th className="p-3.5">Model Name</th>
                  <th className="p-3.5">Brand</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Displacement</th>
                  <th className="p-3.5">Fuel System</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {models.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/80">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center space-x-2">
                      <img
                        src={m.imageUrl}
                        alt={m.modelName}
                        className="w-8 h-8 rounded-lg object-cover border border-gray-300"
                        referrerPolicy="no-referrer"
                      />
                      <span>{m.modelName}</span>
                    </td>
                    <td className="p-3.5 text-slate-700 font-medium">{m.brandName}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-[10px] font-semibold border border-orange-200">
                        {m.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700 font-medium">{m.engineDisplacement}</td>
                    <td className="p-3.5 text-slate-700 font-medium">{m.fuelSystem}</td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => handleOpenEditModel(m)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteModel(m.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB: GUIDES --- */}
      {activeTab === 'guides' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Replacement Guides Records</h3>
              <p className="text-xs text-slate-500">Create, edit, or remove step-by-step motorcycle repair guides.</p>
            </div>
            <button
              onClick={handleOpenAddGuide}
              className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Guide</span>
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                <tr>
                  <th className="p-3.5">Guide Title</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Component</th>
                  <th className="p-3.5">Difficulty</th>
                  <th className="p-3.5">Est. Time</th>
                  <th className="p-3.5">Steps</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {guides.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50/80">
                    <td className="p-3.5 font-bold text-slate-900">
                      <div className="flex items-center space-x-2">
                        {g.imageUrl && (
                          <img
                            src={g.imageUrl}
                            alt={g.title}
                            className="w-8 h-8 rounded-lg object-cover border border-gray-200"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <span>{g.title}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-800 font-semibold rounded text-[10px] border border-orange-200">
                        {g.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700 font-medium">{g.componentName}</td>
                    <td className="p-3.5 text-slate-700 font-medium">{g.difficulty}</td>
                    <td className="p-3.5 text-slate-700 font-medium">{g.estimatedMinutes} mins</td>
                    <td className="p-3.5 text-slate-700 font-medium">{g.steps?.length || 0} steps</td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => handleOpenEditGuide(g)}
                        title="Edit Guide"
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 transition-all"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGuide(g.id)}
                        title="Delete Guide"
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB: COMMUNITY POSTS & SPAM MODERATION --- */}
      {activeTab === 'community' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-200 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-orange-600" />
                  <span>Community Q&A & Spam Moderation Panel</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Control community questions, repair tips, anti-spam filters, post ratings, and user posts.
                </p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
                <button
                  onClick={() => setCommunityFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-1.5 ${
                    communityFilter === 'pending'
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-sm'
                      : 'bg-gray-100 text-slate-600 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending ({posts.filter((p) => p.status === 'pending').length})</span>
                </button>

                <button
                  onClick={() => setCommunityFilter('all')}
                  className={`px-3 py-1.5 rounded-xl border transition-all ${
                    communityFilter === 'all'
                      ? 'bg-slate-900 text-white font-bold border-slate-900 shadow-sm'
                      : 'bg-gray-100 text-slate-600 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <span>All ({posts.length})</span>
                </button>

                <button
                  onClick={() => setCommunityFilter('approved')}
                  className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-1.5 ${
                    communityFilter === 'approved'
                      ? 'bg-green-600 text-white font-bold border-green-600 shadow-sm'
                      : 'bg-gray-100 text-slate-600 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approved ({posts.filter((p) => p.status === 'approved').length})</span>
                </button>

                <button
                  onClick={() => setCommunityFilter('rejected')}
                  className={`px-3 py-1.5 rounded-xl border transition-all ${
                    communityFilter === 'rejected'
                      ? 'bg-red-600 text-white font-bold border-red-600 shadow-sm'
                      : 'bg-gray-100 text-slate-600 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <span>Dismissed ({posts.filter((p) => p.status === 'rejected').length})</span>
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by author name, title, or content..."
                value={communitySearch}
                onChange={(e) => setCommunitySearch(e.target.value)}
                className="w-full bg-slate-50 border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Posts List */}
            <div className="space-y-3">
              {posts
                .filter((p) => {
                  if (communityFilter === 'pending') return p.status === 'pending';
                  if (communityFilter === 'approved') return p.status === 'approved';
                  if (communityFilter === 'rejected') return p.status === 'rejected';
                  return true;
                })
                .filter((p) => {
                  if (!communitySearch) return true;
                  const q = communitySearch.toLowerCase();
                  return (
                    p.authorName.toLowerCase().includes(q) ||
                    p.title.toLowerCase().includes(q) ||
                    p.content.toLowerCase().includes(q)
                  );
                })
                .map((post) => (
                  <div
                    key={post.id}
                    className={`p-4 rounded-xl border transition-all space-y-3 ${
                      post.spamFlagged
                        ? 'bg-red-50/50 border-red-200'
                        : post.status === 'pending'
                        ? 'bg-amber-50/50 border-amber-200'
                        : 'bg-slate-50 border-gray-200'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{post.authorName}</span>
                        <span className="px-2 py-0.5 bg-white border border-gray-300 rounded text-[10px] font-bold uppercase text-slate-700">
                          {post.authorRole}
                        </span>

                        {post.status === 'pending' && (
                          <span className="px-2 py-0.5 bg-amber-100 border border-amber-300 text-amber-800 rounded font-bold text-[10px] flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Pending Review</span>
                          </span>
                        )}

                        {post.status === 'approved' && (
                          <span className="px-2 py-0.5 bg-green-100 border border-green-300 text-green-800 rounded font-bold text-[10px] flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                            <span>Approved</span>
                          </span>
                        )}

                        {post.status === 'rejected' && (
                          <span className="px-2 py-0.5 bg-red-100 border border-red-300 text-red-800 rounded font-bold text-[10px]">
                            Dismissed / Rejected
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-slate-400">
                        {new Date(post.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {post.spamFlagged && (
                      <div className="p-2.5 bg-red-100/80 border border-red-300 rounded-lg text-red-800 text-[11px] font-semibold flex items-center space-x-2">
                        <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                        <span>Anti-Spam Alert: {post.spamReason || 'Suspicious links or content detected'}</span>
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded font-bold text-[10px] uppercase">
                          {post.category}
                        </span>
                        {post.symptomTag && (
                          <span className="px-2 py-0.5 bg-gray-200 text-slate-700 rounded font-medium text-[10px]">
                            {post.symptomTag}
                          </span>
                        )}
                        <span className="text-[11px] text-amber-600 font-bold flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{post.averageRating ? post.averageRating.toFixed(1) : 'Unrated'} ({post.ratingCount || 0} votes)</span>
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm">{post.title}</h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-normal bg-white p-3 rounded-lg border border-gray-200">
                        {post.content}
                      </p>
                    </div>

                    {/* Moderation Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200/80 pt-2.5 text-xs">
                      <div className="flex items-center space-x-3 text-slate-500 font-medium">
                        <span className="flex items-center space-x-1">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{post.likes} Likes</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{post.commentsCount} Comments</span>
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {post.status !== 'approved' && (
                          <button
                            onClick={() => handleApproveCommunityPost(post.id)}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-xs flex items-center space-x-1 shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve Post</span>
                          </button>
                        )}

                        {post.status !== 'rejected' && (
                          <button
                            onClick={() => handleDismissCommunityPost(post.id)}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs flex items-center space-x-1 shadow-sm"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Dismiss / Reject</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenEditCommunityPost(post)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-xs flex items-center space-x-1 shadow-sm"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteCommunityPost(post)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center space-x-1 shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              {posts.filter((p) => {
                if (communityFilter === 'pending') return p.status === 'pending';
                if (communityFilter === 'approved') return p.status === 'approved';
                if (communityFilter === 'rejected') return p.status === 'rejected';
                return true;
              }).length === 0 && (
                <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-gray-200">
                  No community posts found matching this moderation filter.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT COMMUNITY POST MODAL (ADMIN) --- */}
      {showEditPostModal && editingPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl text-xs text-slate-700">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Admin Edit Community Post</h3>
              <button onClick={() => setShowEditPostModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveCommunityPostEdit} className="space-y-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={editPostCategory}
                  onChange={(e: any) => setEditPostCategory(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                >
                  <option value="Troubleshooting Help">Troubleshooting Help</option>
                  <option value="DIY Repairs">DIY Repairs</option>
                  <option value="Maintenance Tip">Maintenance Tip</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Post Title</label>
                <input
                  type="text"
                  value={editPostTitle}
                  onChange={(e) => setEditPostTitle(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Symptom Tag</label>
                <input
                  type="text"
                  value={editPostSymptomTag}
                  onChange={(e) => setEditPostSymptomTag(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Post Content</label>
                <textarea
                  rows={5}
                  value={editPostContent}
                  onChange={(e) => setEditPostContent(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditPostModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 font-semibold rounded-xl border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Save Post Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showBrandModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-xs text-slate-700">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingBrand ? 'Edit Brand' : 'Add Brand'}
              </h3>
              <button onClick={() => setShowBrandModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveBrand} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. Honda, Yamaha, Suzuki"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Country of Origin</label>
                <input
                  type="text"
                  placeholder="e.g. Japan, Italy, Taiwan"
                  value={brandCountry}
                  onChange={(e) => setBrandCountry(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Logo / Image URL (optional)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={brandLogoUrl}
                  onChange={(e) => setBrandLogoUrl(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBrandModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl font-semibold border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-sm"
                >
                  {editingBrand ? 'Update Brand' : 'Save Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: MODEL MODAL --- */}
      {showModelModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-xs text-slate-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingModel ? 'Edit Motorcycle Model' : 'Add Motorcycle Model'}
              </h3>
              <button onClick={() => setShowModelModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveModel} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Brand</label>
                <select
                  value={modelBrandId}
                  onChange={(e) => setModelBrandId(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Model Name</label>
                <input
                  type="text"
                  placeholder="e.g. Click 125i V3"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={modelCategory}
                    onChange={(e: any) => setModelCategory(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Scooter">Scooter</option>
                    <option value="Underbone">Underbone</option>
                    <option value="Backbone">Backbone</option>
                    <option value="Big Bike">Big Bike</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Displacement</label>
                  <input
                    type="text"
                    value={modelCc}
                    onChange={(e) => setModelCc(e.target.value)}
                    placeholder="e.g. 125 cc"
                    className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fuel System</label>
                  <select
                    value={modelFuel}
                    onChange={(e: any) => setModelFuel(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Fuel Injection (FI)">Fuel Injection (FI)</option>
                    <option value="Carburetor">Carburetor</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Transmission</label>
                  <select
                    value={modelTransmission}
                    onChange={(e: any) => setModelTransmission(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Automatic (CVT)">Automatic (CVT)</option>
                    <option value="Manual (Chain)">Manual (Chain)</option>
                    <option value="Semi-Automatic">Semi-Automatic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={modelImg}
                  onChange={(e) => setModelImg(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModelModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl font-semibold border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-sm"
                >
                  {editingModel ? 'Update Model' : 'Save Model'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: PROBLEM CATEGORY MODAL --- */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-xs text-slate-700">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingCategory ? 'Edit Problem Category' : 'Add Problem Category'}
              </h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category Title</label>
                <input
                  type="text"
                  placeholder="e.g. Won't Start / Electrical Issues"
                  value={categoryTitle}
                  onChange={(e) => setCategoryTitle(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe what kind of faults fall under this category..."
                  value={categoryDesc}
                  onChange={(e) => setCategoryDesc(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Icon Identifier</label>
                <select
                  value={categoryIcon}
                  onChange={(e) => setCategoryIcon(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                >
                  <option value="PowerOff">PowerOff (Won't Start)</option>
                  <option value="AlertTriangle">AlertTriangle (FI Light)</option>
                  <option value="Gauge">Gauge (Acceleration)</option>
                  <option value="Zap">Zap (Electrical)</option>
                  <option value="ShieldAlert">ShieldAlert (Brakes)</option>
                  <option value="Thermometer">Thermometer (Overheating)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl font-semibold border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-sm"
                >
                  {editingCategory ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: SYMPTOM MODAL --- */}
      {showSymptomModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-xs text-slate-700">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingSymptom ? 'Edit Symptom' : 'Add Symptom'}
              </h3>
              <button onClick={() => setShowSymptomModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveSymptom} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Problem Category</label>
                <select
                  value={symptomCategoryId}
                  onChange={(e) => setSymptomCategoryId(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Symptom Title</label>
                <input
                  type="text"
                  placeholder="e.g. Engine Cranks normally but Will NOT Fire"
                  value={symptomTitle}
                  onChange={(e) => setSymptomTitle(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Short explanation of what rider experiences..."
                  value={symptomDesc}
                  onChange={(e) => setSymptomDesc(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Initial Inspection Node ID</label>
                <input
                  type="text"
                  placeholder="e.g. node_crank_1_spark"
                  value={symptomInitialNodeId}
                  onChange={(e) => setSymptomInitialNodeId(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSymptomModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl font-semibold border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-sm"
                >
                  {editingSymptom ? 'Update Symptom' : 'Save Symptom'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 5: INSPECTION NODE MODAL --- */}
      {showNodeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-xl text-xs text-slate-700 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingNode ? 'Edit Inspection Step Node' : 'Add Inspection Step Node'}
              </h3>
              <button onClick={() => setShowNodeModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleSaveNode} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Node ID</label>
                  <input
                    type="text"
                    value={nodeId}
                    onChange={(e) => setNodeId(e.target.value)}
                    required
                    disabled={!!editingNode}
                    className="w-full bg-slate-50 border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Symptom</label>
                  <select
                    value={nodeSymptomId}
                    onChange={(e) => setNodeSymptomId(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    {symptoms.map((s) => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Inspection Title</label>
                <input
                  type="text"
                  placeholder="e.g. Inspection 1: Spark Plug High Voltage Test"
                  value={nodeTitle}
                  onChange={(e) => setNodeTitle(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">What To Inspect</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Check whether ignition system delivers strong electric spark..."
                    value={nodeWhatToInspect}
                    onChange={(e) => setNodeWhatToInspect(e.target.value)}
                    required
                    className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Why It Matters</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Essential for combustion process..."
                    value={nodeWhyItMatters}
                    onChange={(e) => setNodeWhyItMatters(e.target.value)}
                    required
                    className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Cylinder head spark plug well"
                    value={nodeLocation}
                    onChange={(e) => setNodeLocation(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Required Tools (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Spark Plug Socket, Insulated Pliers"
                    value={nodeTools}
                    onChange={(e) => setNodeTools(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Procedure Steps (One per line)</label>
                <textarea
                  rows={3}
                  placeholder="1. Turn ignition switch OFF&#10;2. Remove spark plug boot..."
                  value={nodeProcedure}
                  onChange={(e) => setNodeProcedure(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Normal Condition Result</label>
                  <input
                    type="text"
                    placeholder="e.g. Bright BLUE-WHITE spark jumps crisp"
                    value={nodeNormalCond}
                    onChange={(e) => setNodeNormalCond(e.target.value)}
                    required
                    className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Abnormal Condition Result</label>
                  <input
                    type="text"
                    placeholder="e.g. NO spark at all, or tiny faint yellow spark"
                    value={nodeAbnormalCond}
                    onChange={(e) => setNodeAbnormalCond(e.target.value)}
                    required
                    className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Next Node ID if Normal (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. node_crank_2_fuel"
                    value={nodeNextNormalId}
                    onChange={(e) => setNodeNextNormalId(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Next Node ID if Abnormal (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. node_crank_3_ignition"
                    value={nodeNextAbnormalId}
                    onChange={(e) => setNodeNextAbnormalId(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
              </div>

              {/* Diagnosis if Abnormal */}
              <div className="border-t border-gray-200 pt-3 space-y-3">
                <span className="font-bold text-slate-900 block text-xs">Diagnosis Result (If Abnormal Condition Met)</span>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Most Likely Cause</label>
                  <input
                    type="text"
                    placeholder="e.g. Defective Spark Plug or Faulty Ignition System"
                    value={nodeDiagCause}
                    onChange={(e) => setNodeDiagCause(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Recommended Repair Action</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Replace spark plug with new NGK plug..."
                      value={nodeDiagRepair}
                      onChange={(e) => setNodeDiagRepair(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Explanation</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Without ignition spark, fuel in cylinder cannot ignite..."
                      value={nodeDiagExplanation}
                      onChange={(e) => setNodeDiagExplanation(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Repair Difficulty</label>
                    <select
                      value={nodeDiagDifficulty}
                      onChange={(e: any) => setNodeDiagDifficulty(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Estimated Minutes</label>
                    <input
                      type="number"
                      value={nodeDiagTime}
                      onChange={(e) => setNodeDiagTime(Number(e.target.value))}
                      className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowNodeModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl font-semibold border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-sm"
                >
                  {editingNode ? 'Update Inspection Node' : 'Save Inspection Node'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 6: REPLACEMENT GUIDE MODAL --- */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-xl text-xs text-slate-700 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingGuide ? 'Edit Replacement Guide' : 'Add New Replacement Guide'}
              </h3>
              <button
                onClick={() => setShowGuideModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGuide} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Guide Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Engine Oil & Filter Change"
                    value={guideTitle}
                    onChange={(e) => setGuideTitle(e.target.value)}
                    required
                    className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={guideCategory}
                    onChange={(e: any) => setGuideCategory(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Maintenance">Maintenance</option>
                    <option value="Engine">Engine</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Fuel System">Fuel System</option>
                    <option value="Brakes">Brakes</option>
                    <option value="Transmission">Transmission</option>
                    <option value="Tires & Wheels">Tires & Wheels</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Component Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Engine Oil"
                    value={guideComponentName}
                    onChange={(e) => setGuideComponentName(e.target.value)}
                    required
                    className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Difficulty</label>
                  <select
                    value={guideDifficulty}
                    onChange={(e: any) => setGuideDifficulty(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Est. Time (Minutes)</label>
                  <input
                    type="number"
                    value={guideEstTime}
                    onChange={(e) => setGuideEstTime(Number(e.target.value))}
                    required
                    min={1}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Cover Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={guideImageUrl}
                  onChange={(e) => setGuideImageUrl(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Guide Summary</label>
                <textarea
                  rows={2}
                  placeholder="Overview of what this repair guide covers..."
                  value={guideSummary}
                  onChange={(e) => setGuideSummary(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Required Tools (comma separated)</label>
                  <input
                    type="text"
                    placeholder="12mm Wrench, Oil Pan, Funnel"
                    value={guideTools}
                    onChange={(e) => setGuideTools(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Safety Reminders (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Allow engine to cool down, Wear gloves"
                    value={guideSafety}
                    onChange={(e) => setGuideSafety(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Step by Step Editor */}
              <div className="border-t border-gray-200 pt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Step-by-Step Instructions ({guideSteps.length})</span>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Step</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {guideSteps.map((step, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-800 text-[11px]">Step #{idx + 1}</span>
                        {guideSteps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStep(idx)}
                            className="text-red-500 hover:text-red-700 text-[11px] font-bold"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Step Title (e.g. Drain Old Oil)"
                        value={step.title}
                        onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                        required
                        className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                      />

                      <textarea
                        rows={2}
                        placeholder="Detailed instruction on how to perform this step..."
                        value={step.instruction}
                        onChange={(e) => handleStepChange(idx, 'instruction', e.target.value)}
                        required
                        className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                      />

                      <input
                        type="text"
                        placeholder="Step Image URL (optional)"
                        value={step.imageUrl || ''}
                        onChange={(e) => handleStepChange(idx, 'imageUrl', e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowGuideModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl font-semibold border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-sm"
                >
                  {editingGuide ? 'Update Guide' : 'Save New Guide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl text-xs text-slate-700">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="p-2.5 bg-red-100 rounded-xl border border-red-200">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Confirm Delete</h3>
                <p className="text-[11px] text-slate-500 capitalize">Deleting {deleteTarget.type}</p>
              </div>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">{deleteTarget.name}</strong>? This action will remove it permanently from the database.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-sm transition-all"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
