import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CommunityPost, CommunityComment } from '../types';
import { SEED_COMMUNITY_POSTS } from '../data/seedData';

export const communityService = {
  async getPosts(): Promise<CommunityPost[]> {
    if (!isSupabaseConfigured() || !supabase) return SEED_COMMUNITY_POSTS;

    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(full_name, role)');

    if (error || !data || data.length === 0) return SEED_COMMUNITY_POSTS;

    return data.map((p: any) => ({
      id: p.id,
      userId: p.author_id,
      authorName: p.profiles?.full_name || 'Rider',
      authorRole: (p.profiles?.role as any) || 'rider',
      title: p.title,
      content: p.content,
      category: 'Troubleshooting Help',
      likes: 0,
      likedBy: [],
      commentsCount: 0,
      isSolved: false,
      createdAt: p.created_at
    }));
  },

  async createPost(title: string, content: string, userId: string): Promise<CommunityPost> {
    if (!isSupabaseConfigured() || !supabase) {
      const newPost: CommunityPost = {
        id: `post_${Date.now()}`,
        userId,
        authorName: 'You',
        authorRole: 'rider',
        title,
        content,
        category: 'Troubleshooting Help',
        likes: 0,
        likedBy: [],
        commentsCount: 0,
        isSolved: false,
        createdAt: new Date().toISOString()
      };
      return newPost;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert({
        author_id: userId,
        title,
        content
      })
      .select('*, profiles(full_name, role)')
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.author_id,
      authorName: data.profiles?.full_name || 'Rider',
      authorRole: (data.profiles?.role as any) || 'rider',
      title: data.title,
      content: data.content,
      category: 'Troubleshooting Help',
      likes: 0,
      likedBy: [],
      commentsCount: 0,
      isSolved: false,
      createdAt: data.created_at
    };
  },

  async getComments(postId: string): Promise<CommunityComment[]> {
    if (!isSupabaseConfigured() || !supabase) return [];

    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(full_name, role)')
      .eq('post_id', postId);

    if (error || !data) return [];

    return data.map((c: any) => ({
      id: c.id,
      postId: c.post_id,
      userId: c.author_id,
      authorName: c.profiles?.full_name || 'Mechanic',
      authorRole: (c.profiles?.role as any) || 'mechanic',
      content: c.comment,
      createdAt: c.created_at
    }));
  },

  async addComment(postId: string, commentText: string, userId: string): Promise<CommunityComment> {
    if (!isSupabaseConfigured() || !supabase) {
      return {
        id: `c_${Date.now()}`,
        postId,
        userId,
        authorName: 'Mechanic',
        authorRole: 'mechanic',
        content: commentText,
        createdAt: new Date().toISOString()
      };
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        author_id: userId,
        comment: commentText
      })
      .select('*, profiles(full_name, role)')
      .single();

    if (error) throw error;

    return {
      id: data.id,
      postId: data.post_id,
      userId: data.author_id,
      authorName: data.profiles?.full_name || 'Rider',
      authorRole: (data.profiles?.role as any) || 'rider',
      content: data.comment,
      createdAt: data.created_at
    };
  }
};
