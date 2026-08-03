import {
  User,
  Brand,
  MotorcycleModel,
  ReplacementGuide,
  TechniqueGuide,
  ProblemCategory,
  Symptom,
  TroubleshootingNode,
  CommunityPost,
  CommunityComment
} from '../types';
import {
  SEED_BRANDS,
  SEED_MODELS,
  SEED_REPLACEMENT_GUIDES,
  SEED_TECHNIQUE_GUIDES,
  SEED_PROBLEM_CATEGORIES,
  SEED_SYMPTOMS,
  SEED_NODES,
  SEED_COMMUNITY_POSTS,
  DEMO_USERS
} from '../data/seedData';
import { isSupabaseConfigured } from '../lib/supabase';
import { authService } from './authService';
import { motorcycleService } from './motorcycleService';
import { guideService } from './guideService';
import { troubleshootingService } from './troubleshootingService';
import { communityService } from './communityService';
import { bookmarkService } from './bookmarkService';
import { progressService } from './progressService';

async function fetchJson<T>(url: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      let errorMsg = `HTTP ${res.status}: ${res.statusText}`;
      try {
        const errJson = await res.json();
        if (errJson && errJson.error) {
          errorMsg = errJson.error;
        }
      } catch (e) {
        // ignore json parse error
      }
      throw new Error(errorMsg);
    }
    return await res.json();
  } catch (err) {
    if (fallbackData !== undefined && (err as Error).message.includes('Failed to fetch')) {
      return fallbackData;
    }
    throw err;
  }
}

export const api = {
  // Auth
  async login(email: string, password?: string): Promise<{ user: User; token: string }> {
    if (isSupabaseConfigured()) {
      return authService.signIn(email, password);
    }
    return fetchJson('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  },

  async register(name: string, email: string, role: string, password?: string): Promise<{ user: User; token: string; requiresConfirmation?: boolean }> {
    if (isSupabaseConfigured()) {
      return authService.signUp(email, password || 'password123', name, role as any);
    }
    return fetchJson('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role })
    });
  },

  // Brands & Models
  async getBrands(): Promise<Brand[]> {
    if (isSupabaseConfigured()) return motorcycleService.getBrands();
    return fetchJson('/api/brands', undefined, SEED_BRANDS);
  },

  async createBrand(data: Partial<Brand>): Promise<Brand> {
    const fallback: Brand = {
      id: `b_${Date.now()}`,
      name: data.name || 'New Brand',
      country: data.country || 'Japan',
      logoUrl: data.logoUrl
    };
    return fetchJson('/api/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, fallback);
  },

  async updateBrand(id: string, data: Partial<Brand>): Promise<Brand> {
    const fallback: Brand = {
      id,
      name: data.name || 'Brand',
      country: data.country || 'Japan',
      logoUrl: data.logoUrl,
      ...data
    };
    return fetchJson(`/api/brands/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, fallback);
  },

  async deleteBrand(id: string): Promise<{ success: boolean }> {
    return fetchJson(`/api/brands/${id}`, { method: 'DELETE' }, { success: true });
  },

  async getMotorcycles(): Promise<MotorcycleModel[]> {
    if (isSupabaseConfigured()) return motorcycleService.getModels();
    return fetchJson('/api/motorcycles', undefined, SEED_MODELS);
  },

  async createMotorcycle(data: Partial<MotorcycleModel>): Promise<MotorcycleModel> {
    const newModel: MotorcycleModel = {
      id: `m_${Date.now()}`,
      brandId: data.brandId || 'b_honda',
      brandName: data.brandName || 'Honda',
      modelName: data.modelName || 'New Model',
      category: data.category || 'Scooter',
      engineDisplacement: data.engineDisplacement || '125 cc',
      fuelSystem: data.fuelSystem || 'Fuel Injection (FI)',
      transmission: data.transmission || 'Automatic (CVT)',
      coolingSystem: data.coolingSystem || 'Air Cooled',
      oilCapacity: data.oilCapacity || '0.8 Liters',
      sparkPlugType: data.sparkPlugType || 'NGK',
      batteryType: data.batteryType || '12V',
      tireSizeFront: data.tireSizeFront || '80/90-14',
      tireSizeRear: data.tireSizeRear || '90/90-14',
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      description: data.description || '',
      commonIssues: data.commonIssues || []
    };
    if (isSupabaseConfigured()) {
      try { return await motorcycleService.createModel(data); } catch (e) { console.warn('Supabase create error:', e); }
    }
    return fetchJson('/api/motorcycles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, newModel);
  },

  async updateMotorcycle(id: string, data: Partial<MotorcycleModel>): Promise<MotorcycleModel> {
    const updatedModel: MotorcycleModel = {
      id,
      brandId: data.brandId || 'b_honda',
      brandName: data.brandName || 'Honda',
      modelName: data.modelName || 'Model',
      category: data.category || 'Scooter',
      engineDisplacement: data.engineDisplacement || '125 cc',
      fuelSystem: data.fuelSystem || 'Fuel Injection (FI)',
      transmission: data.transmission || 'Automatic (CVT)',
      coolingSystem: data.coolingSystem || 'Air Cooled',
      oilCapacity: data.oilCapacity || '0.8 Liters',
      sparkPlugType: data.sparkPlugType || 'NGK',
      batteryType: data.batteryType || '12V',
      tireSizeFront: data.tireSizeFront || '80/90-14',
      tireSizeRear: data.tireSizeRear || '90/90-14',
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      description: data.description || '',
      commonIssues: data.commonIssues || [],
      ...data
    };
    return fetchJson(`/api/motorcycles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, updatedModel);
  },

  async deleteMotorcycle(id: string): Promise<{ success: boolean }> {
    return fetchJson(`/api/motorcycles/${id}`, { method: 'DELETE' }, { success: true });
  },

  // Guides
  async getReplacementGuides(): Promise<ReplacementGuide[]> {
    if (isSupabaseConfigured()) return guideService.getReplacementGuides();
    return fetchJson('/api/guides/replacement', undefined, SEED_REPLACEMENT_GUIDES);
  },

  async createReplacementGuide(guideData: Partial<ReplacementGuide>): Promise<ReplacementGuide> {
    const fallback: ReplacementGuide = {
      id: `rg_${Date.now()}`,
      title: guideData.title || 'New Guide',
      category: guideData.category || 'Maintenance',
      componentName: guideData.componentName || guideData.title || 'General Component',
      difficulty: guideData.difficulty || 'Intermediate',
      estimatedMinutes: guideData.estimatedMinutes || 30,
      summary: guideData.summary || '',
      requiredTools: guideData.requiredTools || [],
      safetyReminders: guideData.safetyReminders || [],
      commonMistakes: guideData.commonMistakes || [],
      steps: guideData.steps || [],
      imageUrl: guideData.imageUrl || ''
    };
    if (isSupabaseConfigured()) {
      try { return await guideService.createReplacementGuide(guideData); } catch (e) { console.warn('Supabase create guide error:', e); }
    }
    return fetchJson('/api/guides/replacement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(guideData)
    }, fallback);
  },

  async updateReplacementGuide(id: string, guideData: Partial<ReplacementGuide>): Promise<ReplacementGuide> {
    const fallback: ReplacementGuide = {
      id,
      title: guideData.title || 'Guide',
      category: guideData.category || 'Maintenance',
      componentName: guideData.componentName || guideData.title || 'General Component',
      difficulty: guideData.difficulty || 'Intermediate',
      estimatedMinutes: guideData.estimatedMinutes || 30,
      summary: guideData.summary || '',
      requiredTools: guideData.requiredTools || [],
      safetyReminders: guideData.safetyReminders || [],
      commonMistakes: guideData.commonMistakes || [],
      steps: guideData.steps || [],
      imageUrl: guideData.imageUrl || '',
      ...guideData
    };
    return fetchJson(`/api/guides/replacement/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(guideData)
    }, fallback);
  },

  async deleteReplacementGuide(id: string): Promise<{ success: boolean }> {
    return fetchJson(`/api/guides/replacement/${id}`, { method: 'DELETE' }, { success: true });
  },

  async getTechniqueGuides(): Promise<TechniqueGuide[]> {
    if (isSupabaseConfigured()) return guideService.getTechniqueGuides();
    return fetchJson('/api/guides/techniques', undefined, SEED_TECHNIQUE_GUIDES);
  },

  // Troubleshooting
  async getProblemCategories(): Promise<ProblemCategory[]> {
    if (isSupabaseConfigured()) return troubleshootingService.getCategories();
    return fetchJson('/api/troubleshooting/categories', undefined, SEED_PROBLEM_CATEGORIES);
  },

  async createProblemCategory(data: Partial<ProblemCategory>): Promise<ProblemCategory> {
    return fetchJson('/api/troubleshooting/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async updateProblemCategory(id: string, data: Partial<ProblemCategory>): Promise<ProblemCategory> {
    return fetchJson(`/api/troubleshooting/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async deleteProblemCategory(id: string): Promise<{ success: boolean }> {
    return fetchJson(`/api/troubleshooting/categories/${id}`, { method: 'DELETE' }, { success: true });
  },

  async getSymptoms(categoryId?: string): Promise<Symptom[]> {
    if (isSupabaseConfigured()) return troubleshootingService.getSymptoms(categoryId);
    const url = categoryId ? `/api/troubleshooting/symptoms?categoryId=${categoryId}` : '/api/troubleshooting/symptoms';
    const fallback = categoryId ? SEED_SYMPTOMS.filter(s => s.categoryId === categoryId) : SEED_SYMPTOMS;
    return fetchJson(url, undefined, fallback);
  },

  async createSymptom(data: Partial<Symptom>): Promise<Symptom> {
    return fetchJson('/api/troubleshooting/symptoms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async updateSymptom(id: string, data: Partial<Symptom>): Promise<Symptom> {
    return fetchJson(`/api/troubleshooting/symptoms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async deleteSymptom(id: string): Promise<{ success: boolean }> {
    return fetchJson(`/api/troubleshooting/symptoms/${id}`, { method: 'DELETE' }, { success: true });
  },

  async getAllTroubleshootingNodes(): Promise<Record<string, TroubleshootingNode>> {
    return fetchJson('/api/troubleshooting/nodes', undefined, SEED_NODES);
  },

  async getTroubleshootingNode(nodeId: string): Promise<TroubleshootingNode> {
    if (isSupabaseConfigured()) {
      const node = await troubleshootingService.getNode(nodeId);
      if (node) return node;
    }
    return fetchJson(`/api/troubleshooting/nodes/${nodeId}`, undefined, SEED_NODES[nodeId]);
  },

  async createTroubleshootingNode(data: Partial<TroubleshootingNode>): Promise<TroubleshootingNode> {
    return fetchJson('/api/troubleshooting/nodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async updateTroubleshootingNode(id: string, data: Partial<TroubleshootingNode>): Promise<TroubleshootingNode> {
    return fetchJson(`/api/troubleshooting/nodes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async deleteTroubleshootingNode(id: string): Promise<{ success: boolean }> {
    return fetchJson(`/api/troubleshooting/nodes/${id}`, { method: 'DELETE' }, { success: true });
  },

  // Community
  async getPosts(): Promise<CommunityPost[]> {
    if (isSupabaseConfigured()) return communityService.getPosts();
    return fetchJson('/api/community/posts', undefined, SEED_COMMUNITY_POSTS);
  },

  async createPost(postData: Partial<CommunityPost>): Promise<CommunityPost> {
    if (isSupabaseConfigured() && postData.userId) {
      return communityService.createPost(postData.title || '', postData.content || '', postData.userId);
    }
    return fetchJson('/api/community/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
  },

  async updatePost(postId: string, postData: Partial<CommunityPost>): Promise<CommunityPost> {
    return fetchJson(`/api/community/posts/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
  },

  async deletePost(postId: string): Promise<{ success: boolean }> {
    return fetchJson(`/api/community/posts/${postId}`, {
      method: 'DELETE'
    }, { success: true });
  },

  async ratePost(postId: string, userId: string, rating: number): Promise<CommunityPost> {
    return fetchJson(`/api/community/posts/${postId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, rating })
    });
  },

  async moderatePost(postId: string, action: 'approve' | 'reject' | 'delete'): Promise<any> {
    return fetchJson(`/api/community/posts/${postId}/moderate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
  },

  async likePost(postId: string, userId: string): Promise<CommunityPost> {
    return fetchJson(`/api/community/posts/${postId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
  },

  async getComments(postId: string): Promise<CommunityComment[]> {
    if (isSupabaseConfigured()) return communityService.getComments(postId);
    return fetchJson(`/api/community/posts/${postId}/comments`, undefined, []);
  },

  async addComment(postId: string, commentData: Partial<CommunityComment>): Promise<CommunityComment> {
    if (isSupabaseConfigured() && commentData.userId) {
      return communityService.addComment(postId, commentData.content || '', commentData.userId);
    }
    return fetchJson(`/api/community/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData)
    });
  },

  // Users & Admin
  async updateUserProfile(userId: string, data: Partial<User>): Promise<User> {
    return fetchJson(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async getAdminStats(): Promise<any> {
    return fetchJson('/api/admin/stats', undefined, {
      totalUsers: DEMO_USERS.length,
      totalModels: SEED_MODELS.length,
      totalGuides: SEED_REPLACEMENT_GUIDES.length + SEED_TECHNIQUE_GUIDES.length,
      totalTroubleshootingTrees: Object.keys(SEED_NODES).length,
      totalCommunityPosts: SEED_COMMUNITY_POSTS.length
    });
  },

  // Sub-services exported for direct backend integration
  auth: authService,
  motorcycles: motorcycleService,
  guides: guideService,
  troubleshooting: troubleshootingService,
  community: communityService,
  bookmarks: bookmarkService,
  progress: progressService
};
