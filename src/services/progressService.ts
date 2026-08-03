import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const progressService = {
  async getLearningProgress(userId: string): Promise<Record<string, number>> {
    if (!isSupabaseConfigured() || !supabase) return {};

    const { data, error } = await supabase
      .from('learning_progress')
      .select('guide_id, progress_percentage')
      .eq('user_id', userId);

    if (error || !data) return {};

    const progressMap: Record<string, number> = {};
    data.forEach((item) => {
      progressMap[item.guide_id] = item.progress_percentage || 0;
    });

    return progressMap;
  },

  async updateProgress(userId: string, guideId: string, percentage: number): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) return;

    await supabase
      .from('learning_progress')
      .upsert({
        user_id: userId,
        guide_id: guideId,
        progress_percentage: Math.min(100, Math.max(0, percentage)),
        completed: percentage >= 100,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,guide_id' });
  }
};
