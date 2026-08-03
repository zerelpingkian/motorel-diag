import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, Role } from '../types';

export const profileService = {
  async updateProfile(userId: string, updates: { full_name?: string; username?: string; avatar_url?: string; role?: Role }): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
  },

  async uploadAvatar(userId: string, file: File): Promise<string> {
    if (!isSupabaseConfigured() || !supabase) {
      return URL.createObjectURL(file);
    }

    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    await this.updateProfile(userId, { avatar_url: data.publicUrl });
    return data.publicUrl;
  }
};
