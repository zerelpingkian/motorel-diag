import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Dashboard } from './components/dashboard/Dashboard';
import { TroubleshootingFlow } from './components/troubleshooting/TroubleshootingFlow';
import { GuideList } from './components/guides/GuideList';
import { CommunityForum } from './components/community/CommunityForum';
import { AdminPanel } from './components/admin/AdminPanel';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { AuthModal } from './components/auth/AuthModal';
import { UserProfileModal } from './components/profile/UserProfileModal';
import { RoadmapModal } from './components/future/RoadmapModal';

function MainApp() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modal controls
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [profileOpen, setProfileOpen] = useState(false);
  const [roadmapOpen, setRoadmapOpen] = useState(false);

  // Keyboard shortcut for ⌘K search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAuth={(mode) => {
          setAuthMode(mode || 'signin');
          setAuthOpen(true);
        }}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenRoadmap={() => setRoadmapOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            onOpenSearch={() => setSearchOpen(true)}
          />
        )}

        {activeTab === 'troubleshooting' && (
          <TroubleshootingFlow
            onNavigateToGuide={(guideId) => {
              setActiveTab('guides');
            }}
          />
        )}

        {activeTab === 'guides' && <GuideList />}

        {activeTab === 'community' && <CommunityForum />}

        {activeTab === 'admin' && (
          role === 'admin' ? (
            <AdminPanel />
          ) : (
            <div className="bg-white border border-red-200 rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto shadow-sm my-12">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto font-black text-xl">
                ✕
              </div>
              <h2 className="text-xl font-bold text-slate-900">Admin Access Restricted</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                You must be signed in with an authorized Administrator account (<span className="font-semibold text-slate-800">zerelpingkian@gmail.com</span>) to view and manage application database records.
              </p>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
              >
                Return to Dashboard
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenRoadmap={() => setRoadmapOpen(true)}
      />

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectGuide={() => setActiveTab('guides')}
        onSelectTroubleshooting={() => setActiveTab('troubleshooting')}
      />

      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />

      <UserProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        onNavigateToGuide={() => setActiveTab('guides')}
      />

      <RoadmapModal
        isOpen={roadmapOpen}
        onClose={() => setRoadmapOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
