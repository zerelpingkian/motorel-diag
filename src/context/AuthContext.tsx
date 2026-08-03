import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role, MotorcycleModel } from '../types';
import { DEMO_USERS } from '../data/seedData';
import { api } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  role: Role;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, role: Role, password?: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => void;
  switchDemoUser: (userRole: Role) => void;
  toggleFavoriteMotorcycle: (modelId: string) => void;
  toggleSavedGuide: (guideId: string) => void;
  toggleSavedTroubleshooting: (symptomId: string) => void;
  updateGuideProgress: (guideId: string, percent: number) => void;
  markGuideCompleted: (guideId: string) => void;
  updateProfileName: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [overrideRole, setOverrideRole] = useState<Role | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('motorel_user');
    if (saved) {
      if (saved === 'null' || saved === 'logged_out') {
        return null;
      }
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return DEMO_USERS[0]; // default Juan Dela Cruz (Rider) for initial visit
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('motorel_user', JSON.stringify(currentUser));
    } else {
      localStorage.setItem('motorel_user', 'logged_out');
    }
  }, [currentUser]);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setOverrideRole(null);
      const res = await api.login(email, password);
      if (res.user) {
        setCurrentUser(res.user);
        return { success: true };
      }
      return { success: false, error: 'Invalid email or password.' };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message || 'Invalid login credentials or unconfirmed account.' };
    }
  };

  const register = async (name: string, email: string, role: Role, password?: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    try {
      setOverrideRole(null);
      const res = await api.register(name, email, role, password);
      if (res.user) {
        setCurrentUser(res.user);
        if (res.requiresConfirmation) {
          return {
            success: true,
            message: 'Account created! (Note: If email confirmation is enabled in your Supabase project, check your inbox).'
          };
        }
        return { success: true };
      }
      return { success: false, error: 'Failed to create account.' };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e.message || 'Registration failed. Please check your credentials or try again.' };
    }
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      return await api.auth.resetPassword(email);
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to send password reset link.' };
    }
  };

  const logout = () => {
    setOverrideRole(null);
    setCurrentUser(null);
  };

  const switchDemoUser = (targetRole: Role) => {
    if (currentUser?.role === 'admin') {
      setOverrideRole(targetRole);
    } else {
      const found = DEMO_USERS.find((u) => u.role === targetRole) || DEMO_USERS[0];
      setCurrentUser(found);
      setOverrideRole(null);
    }
  };

  const effectiveRole: Role = (currentUser?.role === 'admin' && overrideRole)
    ? overrideRole
    : (currentUser ? currentUser.role : 'rider');

  const toggleFavoriteMotorcycle = (modelId: string) => {
    if (!currentUser) return;
    const exists = currentUser.favoriteMotorcycleIds.includes(modelId);
    const updatedIds = exists
      ? currentUser.favoriteMotorcycleIds.filter((id) => id !== modelId)
      : [...currentUser.favoriteMotorcycleIds, modelId];

    const updatedUser = { ...currentUser, favoriteMotorcycleIds: updatedIds };
    setCurrentUser(updatedUser);
    api.updateUserProfile(currentUser.id, { favoriteMotorcycleIds: updatedIds }).catch(() => {});
  };

  const toggleSavedGuide = (guideId: string) => {
    if (!currentUser) return;
    const exists = currentUser.savedGuideIds.includes(guideId);
    const updatedIds = exists
      ? currentUser.savedGuideIds.filter((id) => id !== guideId)
      : [...currentUser.savedGuideIds, guideId];

    const updatedUser = { ...currentUser, savedGuideIds: updatedIds };
    setCurrentUser(updatedUser);
    api.updateUserProfile(currentUser.id, { savedGuideIds: updatedIds }).catch(() => {});
  };

  const toggleSavedTroubleshooting = (symptomId: string) => {
    if (!currentUser) return;
    const exists = currentUser.savedTroubleshootingIds.includes(symptomId);
    const updatedIds = exists
      ? currentUser.savedTroubleshootingIds.filter((id) => id !== symptomId)
      : [...currentUser.savedTroubleshootingIds, symptomId];

    const updatedUser = { ...currentUser, savedTroubleshootingIds: updatedIds };
    setCurrentUser(updatedUser);
    api.updateUserProfile(currentUser.id, { savedTroubleshootingIds: updatedIds }).catch(() => {});
  };

  const updateGuideProgress = (guideId: string, percent: number) => {
    if (!currentUser) return;
    const updatedProgress = { ...currentUser.learningProgress, [guideId]: percent };
    const updatedUser = { ...currentUser, learningProgress: updatedProgress };
    setCurrentUser(updatedUser);
    api.updateUserProfile(currentUser.id, { learningProgress: updatedProgress }).catch(() => {});
  };

  const markGuideCompleted = (guideId: string) => {
    if (!currentUser) return;
    const completedSet = new Set<string>(currentUser.completedGuideIds);
    completedSet.add(guideId);
    const updatedCompleted = Array.from(completedSet);
    const updatedProgress = { ...currentUser.learningProgress, [guideId]: 100 };

    const updatedUser = {
      ...currentUser,
      completedGuideIds: updatedCompleted,
      learningProgress: updatedProgress
    };
    setCurrentUser(updatedUser);
    api.updateUserProfile(currentUser.id, {
      completedGuideIds: updatedCompleted,
      learningProgress: updatedProgress
    }).catch(() => {});
  };

  const updateProfileName = (name: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, name };
    setCurrentUser(updatedUser);
    api.updateUserProfile(currentUser.id, { name }).catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: effectiveRole,
        isAuthenticated: !!currentUser,
        login,
        register,
        requestPasswordReset,
        logout,
        switchDemoUser,
        toggleFavoriteMotorcycle,
        toggleSavedGuide,
        toggleSavedTroubleshooting,
        updateGuideProgress,
        markGuideCompleted,
        updateProfileName
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
