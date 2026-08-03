import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ProblemCategory, Symptom, TroubleshootingNode } from '../types';
import { SEED_PROBLEM_CATEGORIES, SEED_SYMPTOMS, SEED_NODES } from '../data/seedData';

export const troubleshootingService = {
  async getCategories(): Promise<ProblemCategory[]> {
    if (!isSupabaseConfigured() || !supabase) return SEED_PROBLEM_CATEGORIES;

    const { data, error } = await supabase
      .from('problems')
      .select('*');

    if (error || !data || data.length === 0) return SEED_PROBLEM_CATEGORIES;

    return data.map((p: any) => ({
      id: p.id,
      title: p.title,
      iconName: 'Zap',
      description: p.description || ''
    }));
  },

  async getSymptoms(categoryId?: string): Promise<Symptom[]> {
    if (!isSupabaseConfigured() || !supabase) {
      if (categoryId) return SEED_SYMPTOMS.filter(s => s.categoryId === categoryId);
      return SEED_SYMPTOMS;
    }

    let query = supabase.from('symptoms').select('*');
    if (categoryId) {
      query = query.eq('problem_id', categoryId);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      if (categoryId) return SEED_SYMPTOMS.filter(s => s.categoryId === categoryId);
      return SEED_SYMPTOMS;
    }

    return data.map((s: any) => ({
      id: s.id,
      categoryId: s.problem_id,
      title: s.title,
      description: 'Step-by-step diagnostic tree',
      initialNodeId: `node_${s.id}`
    }));
  },

  async getNode(nodeId: string): Promise<TroubleshootingNode | null> {
    if (!isSupabaseConfigured() || !supabase) {
      return SEED_NODES[nodeId] || null;
    }

    // Try finding step in DB
    const stepId = nodeId.replace('node_', '');
    const { data: step, error } = await supabase
      .from('inspection_steps')
      .select('*, troubleshooting_rules(*, possible_causes(*))')
      .eq('id', stepId)
      .single();

    if (error || !step) {
      return SEED_NODES[nodeId] || null;
    }

    const rules = step.troubleshooting_rules || [];
    const normalRule = rules.find((r: any) => r.selected_answer === 'Normal');
    const abnormalRule = rules.find((r: any) => r.selected_answer === 'Abnormal');

    return {
      id: `node_${step.id}`,
      symptomId: step.symptom_id,
      inspectionStep: {
        id: step.id,
        title: step.title,
        whatToInspect: step.description || '',
        whyItMatters: 'Critical verification step.',
        locationDescription: step.location || 'Engine compartment',
        requiredTools: step.tools_needed || [],
        procedure: [step.inspection_procedure],
        normalCondition: step.normal_result || 'Normal voltage and continuity',
        abnormalCondition: step.abnormal_result || 'Fault detected or out of spec',
        safetyReminders: step.safety_note ? [step.safety_note] : []
      },
      nextStepOnNormalId: normalRule?.next_inspection_step_id ? `node_${normalRule.next_inspection_step_id}` : undefined,
      nextStepOnAbnormalId: abnormalRule?.next_inspection_step_id ? `node_${abnormalRule.next_inspection_step_id}` : undefined,
      diagnosisIfAbnormal: abnormalRule?.possible_causes ? {
        mostLikelyCause: abnormalRule.possible_causes.title,
        otherCauses: [],
        explanation: abnormalRule.possible_causes.explanation || '',
        recommendedRepair: abnormalRule.possible_causes.repair_recommendation || '',
        difficulty: (abnormalRule.possible_causes.difficulty as any) || 'Intermediate',
        estimatedMinutes: abnormalRule.possible_causes.estimated_time || 30,
        requiredTools: abnormalRule.possible_causes.tools_required || []
      } : undefined
    };
  }
};
