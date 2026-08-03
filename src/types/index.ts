export type Role = 'rider' | 'mechanic' | 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  favoriteMotorcycleIds: string[];
  savedGuideIds: string[];
  savedTroubleshootingIds: string[];
  completedGuideIds: string[];
  learningProgress: Record<string, number>; // guideId -> percent
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  country: string;
  logoUrl?: string;
}

export interface MotorcycleModel {
  id: string;
  brandId: string;
  brandName: string;
  modelName: string;
  category: 'Scooter' | 'Underbone' | 'Backbone' | 'Big Bike';
  engineDisplacement: string; // e.g. "125cc", "155cc"
  fuelSystem: 'Fuel Injection (FI)' | 'Carburetor';
  transmission: 'Automatic (CVT)' | 'Manual (Chain)' | 'Semi-Automatic';
  coolingSystem: 'Liquid Cooled' | 'Air Cooled';
  oilCapacity: string;
  sparkPlugType: string;
  batteryType: string;
  tireSizeFront: string;
  tireSizeRear: string;
  imageUrl: string;
  description: string;
  commonIssues: string[];
}

export interface GuideStep {
  stepNumber: number;
  title: string;
  instruction: string;
  imageUrl?: string;
  proTip?: string;
  warning?: string;
}

export interface ReplacementGuide {
  id: string;
  title: string;
  category: 'Maintenance' | 'Engine' | 'Electrical' | 'Fuel System' | 'Brakes' | 'Transmission' | 'Tires & Wheels';
  componentName: string;
  estimatedMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  requiredTools: string[];
  safetyReminders: string[];
  summary: string;
  steps: GuideStep[];
  commonMistakes: string[];
  applicableModelIds?: string[]; // empty means applicable to all
  imageUrl?: string;
}

export interface TechniqueGuide {
  id: string;
  title: string;
  type: 'Multimeter' | 'Testing' | 'Inspection' | 'Cleaning' | 'Bleeding' | 'Adjustment';
  estimatedMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  whyItMatters: string;
  requiredTools: string[];
  safetyReminders: string[];
  howToInterpretResults: string;
  steps: GuideStep[];
  imageUrl?: string;
}

export interface InspectionStep {
  id: string;
  title: string;
  whatToInspect: string;
  whyItMatters: string;
  locationDescription: string;
  requiredTools: string[];
  procedure: string[];
  normalCondition: string;
  abnormalCondition: string;
  safetyReminders: string[];
  imageUrl?: string;
}

export interface TroubleshootingNode {
  id: string;
  symptomId: string;
  inspectionStep: InspectionStep;
  nextStepOnNormalId?: string;
  nextStepOnAbnormalId?: string;
  diagnosisIfAbnormal?: DiagnosisResult;
  diagnosisIfNormal?: DiagnosisResult;
}

export interface DiagnosisResult {
  mostLikelyCause: string;
  otherCauses: string[];
  explanation: string;
  recommendedRepair: string;
  relatedGuideId?: string;
  relatedTechniqueId?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  requiredTools: string[];
}

export interface ProblemCategory {
  id: string;
  title: string;
  iconName: string;
  description: string;
}

export interface Symptom {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  initialNodeId: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  authorName: string;
  authorRole: Role;
  motorcycleModelId?: string;
  motorcycleModelName?: string;
  title: string;
  content: string;
  category: 'Troubleshooting Help' | 'DIY Repairs' | 'Maintenance Tip' | 'General';
  symptomTag?: string;
  imageUrl?: string;
  likes: number;
  likedBy: string[];
  commentsCount: number;
  isSolved: boolean;
  status?: 'approved' | 'pending' | 'rejected';
  spamFlagged?: boolean;
  spamReason?: string;
  ratings?: Record<string, number>; // userId -> rating (1 to 5)
  averageRating?: number;
  ratingCount?: number;
  createdAt: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  userId: string;
  authorName: string;
  authorRole: Role;
  content: string;
  isBestAnswer?: boolean;
  createdAt: string;
}

export interface UserInspectionRecord {
  stepId: string;
  stepTitle: string;
  userAnswer: 'Normal' | 'Abnormal' | 'Not Sure' | 'Skip';
  notes?: string;
}

export interface SavedDiagnosis {
  id: string;
  userId: string;
  motorcycleModelId: string;
  motorcycleName: string;
  symptomTitle: string;
  inspectionsPerformed: UserInspectionRecord[];
  diagnosisResult: DiagnosisResult;
  dateSaved: string;
}
