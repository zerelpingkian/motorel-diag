import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const bookmarkService = {
  async getSavedGuideIds(userId: string): Promise<string[]> {
    if (!isSupabaseConfigured() || !supabase) return [];

    const { data, error } = await supabase
      .from('bookmarks')
      .select('guide_id')
      .eq('user_id', userId);

    if (error || !data) return [];
    return data.map((b) => b.guide_id);
  },

  async toggleBookmark(userId: string, guideId: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return true;

    const { data: existing } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('guide_id', guideId)
      .single();

    if (existing) {
      await supabase.from('bookmarks').delete().eq('id', existing.id);
      return false; // removed
    } else {
      await supabase.from('bookmarks').insert({ user_id: userId, guide_id: guideId });
      return true; // added
    }
  }
};
