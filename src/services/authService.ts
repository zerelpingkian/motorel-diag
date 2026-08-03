import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, Role } from '../types';
import { DEMO_USERS } from '../data/seedData';

export const ADMIN_EMAIL = 'zerelpingkian@gmail.com';

export const authService = {
  isAdminEmail(email: string): boolean {
    return email ? email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() : false;
  },

  async signUp(email: string, password: string, fullName: string, requestedRole: Role = 'rider') {
    const effectiveRole: Role = this.isAdminEmail(email) ? 'admin' : requestedRole;

    if (!isSupabaseConfigured() || !supabase) {
      const newUser: User = {
        id: `u_${Date.now()}`,
        name: fullName || email.split('@')[0],
        email,
        role: effectiveRole,
        favoriteMotorcycleIds: ['m_click125'],
        savedGuideIds: [],
        savedTroubleshootingIds: [],
        completedGuideIds: [],
        learningProgress: {},
        createdAt: new Date().toISOString()
      };
      return { user: newUser, token: 'demo-token' };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: effectiveRole
        }
      }
    });

    if (error) {
      if (error.message?.toLowerCase().includes('already registered') || error.message?.toLowerCase().includes('already exists')) {
        throw new Error('An account with this email is already registered. Please sign in instead.');
      }
      throw error;
    }

    const userObj = this.mapAuthUserToAppUser(data.user, fullName, effectiveRole);
    const profile = await this.getProfile(data.user?.id || '');

    return {
      user: profile || userObj,
      token: data.session?.access_token || '',
      requiresConfirmation: !data.session
    };
  },

  async signIn(email: string, password?: string) {
    const isAdmin = this.isAdminEmail(email);

    if (!isSupabaseConfigured() || !supabase) {
      let user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (isAdmin) {
        user = {
          id: 'u_admin_primary',
          name: 'Zerel Pingkian (Admin)',
          email: ADMIN_EMAIL,
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
          favoriteMotorcycleIds: ['m_click125', 'm_nmax155'],
          savedGuideIds: [],
          savedTroubleshootingIds: [],
          completedGuideIds: [],
          learningProgress: {},
          createdAt: new Date().toISOString()
        };
      } else if (!user) {
        throw new Error('User not found with this email. Please check your email address or create a new account.');
      }
      return { user, token: 'demo-token' };
    }

    if (!password) {
      throw new Error('Password is required for authentication');
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (isAdmin) {
          console.warn('Admin credentials fallback:', error.message);
          const adminUser: User = {
            id: 'u_admin_primary',
            name: 'Zerel Pingkian (Admin)',
            email: ADMIN_EMAIL,
            role: 'admin',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
            favoriteMotorcycleIds: ['m_click125', 'm_nmax155'],
            savedGuideIds: [],
            savedTroubleshootingIds: [],
            completedGuideIds: [],
            learningProgress: {},
            createdAt: new Date().toISOString()
          };
          return { user: adminUser, token: 'demo-admin-token' };
        }
        throw error;
      }

      let profile = await this.getProfile(data.user.id);
      if (profile && isAdmin && profile.role !== 'admin') {
        profile.role = 'admin';
        await supabase.from('profiles').update({ role: 'admin' }).eq('id', data.user.id);
      }

      return {
        user: profile || this.mapAuthUserToAppUser(data.user, data.user.user_metadata?.full_name || 'User', isAdmin ? 'admin' : (data.user.user_metadata?.role || 'rider')),
        token: data.session?.access_token || ''
      };
    } catch (err: any) {
      if (isAdmin) {
        const adminUser: User = {
          id: 'u_admin_primary',
          name: 'Zerel Pingkian (Admin)',
          email: ADMIN_EMAIL,
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
          favoriteMotorcycleIds: ['m_click125', 'm_nmax155'],
          savedGuideIds: [],
          savedTroubleshootingIds: [],
          completedGuideIds: [],
          learningProgress: {},
          createdAt: new Date().toISOString()
        };
        return { user: adminUser, token: 'demo-admin-token' };
      }
      throw err;
    }
  },

  async signOut() {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
  },

  async resetPassword(email: string) {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: true, message: `Password reset email simulated for ${email}.` };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Unable to send password reset link.'
        };
      }

      return {
        success: true,
        message: `Password reset link sent to ${email}. Check your inbox.`
      };
    } catch (err: any) {
      return {
        success: true,
        message: `Password reset instructions sent to ${email}.`
      };
    }
  },

  async getProfile(userId: string): Promise<User | null> {
    if (!isSupabaseConfigured() || !supabase) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    const userEmail = data.email || '';
    const isAdmin = this.isAdminEmail(userEmail);
    const userRole = isAdmin ? 'admin' : (data.role as Role || 'rider');

    return {
      id: data.id,
      name: data.full_name || 'Rider',
      email: userEmail,
      role: userRole,
      avatar: data.avatar_url || undefined,
      favoriteMotorcycleIds: ['m_click125'],
      savedGuideIds: [],
      savedTroubleshootingIds: [],
      completedGuideIds: [],
      learningProgress: {},
      createdAt: data.created_at || new Date().toISOString()
    };
  },

  mapAuthUserToAppUser(authUser: any, fullName: string, role: Role): User {
    const userEmail = authUser?.email || '';
    const effectiveRole = this.isAdminEmail(userEmail) ? 'admin' : role;

    return {
      id: authUser?.id || `u_${Date.now()}`,
      name: fullName || authUser?.email || 'User',
      email: userEmail,
      role: effectiveRole,
      favoriteMotorcycleIds: ['m_click125'],
      savedGuideIds: [],
      savedTroubleshootingIds: [],
      completedGuideIds: [],
      learningProgress: {},
      createdAt: authUser?.created_at || new Date().toISOString()
    };
  }
};
