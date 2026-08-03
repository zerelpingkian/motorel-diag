import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ReplacementGuide, TechniqueGuide } from '../types';
import { SEED_REPLACEMENT_GUIDES, SEED_TECHNIQUE_GUIDES } from '../data/seedData';

export const guideService = {
  async getReplacementGuides(): Promise<ReplacementGuide[]> {
    if (!isSupabaseConfigured() || !supabase) return SEED_REPLACEMENT_GUIDES;

    const { data, error } = await supabase
      .from('guides')
      .select('*, guide_steps(*)');

    if (error || !data || data.length === 0) return SEED_REPLACEMENT_GUIDES;

    return data.map((g: any) => ({
      id: g.id,
      title: g.title,
      category: 'Maintenance',
      componentName: g.title,
      estimatedMinutes: g.estimated_time || 20,
      difficulty: g.difficulty as any || 'Beginner',
      requiredTools: g.tools_required || [],
      safetyReminders: g.safety_notes ? [g.safety_notes] : [],
      summary: g.description || '',
      steps: (g.guide_steps || [])
        .sort((a: any, b: any) => a.step_number - b.step_number)
        .map((s: any) => ({
          stepNumber: s.step_number,
          title: s.title,
          instruction: s.description,
          imageUrl: s.image_url
        })),
      commonMistakes: []
    }));
  },

  async getTechniqueGuides(): Promise<TechniqueGuide[]> {
    if (!isSupabaseConfigured() || !supabase) return SEED_TECHNIQUE_GUIDES;
    return SEED_TECHNIQUE_GUIDES;
  },

  async createReplacementGuide(guideData: Partial<ReplacementGuide>): Promise<ReplacementGuide> {
    if (!isSupabaseConfigured() || !supabase) {
      const newGuide: ReplacementGuide = {
        id: `rg_${Date.now()}`,
        title: guideData.title || 'New Repair Guide',
        category: guideData.category || 'Maintenance',
        componentName: guideData.componentName || guideData.title || 'General Component',
        estimatedMinutes: guideData.estimatedMinutes || 20,
        difficulty: guideData.difficulty || 'Beginner',
        requiredTools: guideData.requiredTools || [],
        safetyReminders: guideData.safetyReminders || [],
        summary: guideData.summary || '',
        steps: guideData.steps || [],
        commonMistakes: guideData.commonMistakes || [],
        imageUrl: guideData.imageUrl || ''
      };
      return newGuide;
    }

    const { data: guide, error } = await supabase
      .from('guides')
      .insert({
        title: guideData.title,
        description: guideData.summary,
        estimated_time: guideData.estimatedMinutes,
        difficulty: guideData.difficulty,
        tools_required: guideData.requiredTools,
        safety_notes: guideData.safetyReminders?.[0] || ''
      })
      .select()
      .single();

    if (error || !guide) {
      console.warn('Supabase guide insert error, returning local guide object:', error);
      return {
        id: `rg_${Date.now()}`,
        title: guideData.title || 'New Repair Guide',
        category: guideData.category || 'Maintenance',
        componentName: guideData.componentName || guideData.title || 'General Component',
        estimatedMinutes: guideData.estimatedMinutes || 20,
        difficulty: guideData.difficulty || 'Beginner',
        requiredTools: guideData.requiredTools || [],
        safetyReminders: guideData.safetyReminders || [],
        summary: guideData.summary || '',
        steps: guideData.steps || [],
        commonMistakes: guideData.commonMistakes || [],
        imageUrl: guideData.imageUrl || ''
      };
    }

    if (guideData.steps && guideData.steps.length > 0) {
      const stepsToInsert = guideData.steps.map((s, idx) => ({
        guide_id: guide.id,
        step_number: s.stepNumber || idx + 1,
        title: s.title,
        description: s.instruction,
        image_url: s.imageUrl
      }));
      await supabase.from('guide_steps').insert(stepsToInsert);
    }

    return {
      id: guide.id,
      title: guide.title,
      category: guideData.category || 'Maintenance',
      componentName: guideData.componentName || guide.title,
      estimatedMinutes: guide.estimated_time || 20,
      difficulty: guide.difficulty || 'Beginner',
      requiredTools: guide.tools_required || [],
      safetyReminders: guide.safety_notes ? [guide.safety_notes] : [],
      summary: guide.description || '',
      steps: guideData.steps || [],
      commonMistakes: []
    };
  },

  async updateReplacementGuide(id: string, guideData: Partial<ReplacementGuide>): Promise<ReplacementGuide> {
    if (!isSupabaseConfigured() || !supabase) {
      return { id, ...guideData } as ReplacementGuide;
    }

    await supabase
      .from('guides')
      .update({
        title: guideData.title,
        description: guideData.summary,
        estimated_time: guideData.estimatedMinutes,
        difficulty: guideData.difficulty,
        tools_required: guideData.requiredTools,
        safety_notes: guideData.safetyReminders?.[0] || ''
      })
      .eq('id', id);

    return { id, ...guideData } as ReplacementGuide;
  },

  async deleteReplacementGuide(id: string): Promise<{ success: boolean }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: true };
    }

    await supabase.from('guide_steps').delete().eq('guide_id', id);
    await supabase.from('guides').delete().eq('id', id);
    return { success: true };
  }
};
