import React, { useState } from 'react';
import {
  Wrench,
  Search,
  BookOpen,
  HelpCircle,
  Users,
  ShieldCheck,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Zap,
  Bookmark,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenAuth: (mode?: 'signin' | 'register') => void;
  onOpenProfile: () => void;
  onOpenRoadmap: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenAuth,
  onOpenProfile,
  onOpenRoadmap
}) => {
  const { currentUser, role, isAuthenticated, logout, switchDemoUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Zap },
    { id: 'troubleshooting', label: 'Manual Troubleshooting', icon: Wrench, highlight: true },
    { id: 'guides', label: 'Guides & Techniques', icon: BookOpen },
    { id: 'community', label: 'Community', icon: Users },
    ...(role === 'admin' ? [{ id: 'admin', label: 'Admin Panel', icon: ShieldCheck }] : [])
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 bg-orange-600 rounded-lg flex items-center justify-center font-black text-white shadow-md shadow-orange-900/20">
              M
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-black tracking-wide uppercase text-white">
                  MOTOREL
                </span>
                <span className="text-lg font-black tracking-wide uppercase text-orange-500">
                  DIAG
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Workshop & Repair Guide Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-150 ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-900/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Global Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800 border border-slate-700 hover:border-orange-500/60 rounded-lg text-xs text-slate-200 hover:text-white transition-all shadow-inner"
              title="Global Search"
            >
              <Search className="w-3.5 h-3.5 text-orange-400" />
              <span>Search...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-900 border border-slate-700 rounded text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Roadmap Future Badge */}
            <button
              onClick={onOpenRoadmap}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-xs font-semibold text-amber-300 transition-all"
              title="Future Expansion Features"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Roadmap</span>
            </button>

            {/* Role Indicator / Admin Persona Switcher */}
            {currentUser?.role === 'admin' ? (
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200"
                >
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span className="capitalize">{role} Mode</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-xs text-slate-300">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800">
                      Switch Persona (Demo)
                    </div>
                    {(['rider', 'mechanic', 'student', 'admin'] as Role[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          switchDemoUser(r);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 ${
                          role === r ? 'text-orange-400 font-bold bg-slate-800/50' : ''
                        }`}
                      >
                        <span className="capitalize">{r}</span>
                        {role === r && <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-lg text-xs font-medium text-slate-300">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <span className="capitalize">{role} Mode</span>
              </div>
            )}

            {/* Auth / Profile Button */}
            {isAuthenticated && currentUser ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenProfile}
                  className="flex items-center space-x-2 p-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-200 transition-all"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-md object-cover ring-1 ring-orange-500/50"
                  />
                  <span className="font-semibold max-w-[100px] truncate pr-1">
                    {currentUser.name}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-3 py-1.5 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-md shadow-orange-900/20 transition-all"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-300 hover:text-white"
            >
              <Search className="w-5 h-5 text-orange-400" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                    isActive
                      ? 'bg-orange-500 text-slate-950'
                      : 'text-slate-300 bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col space-y-2">
            <button
              onClick={() => {
                onOpenRoadmap();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs font-semibold text-amber-300"
            >
              <span className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Roadmap & Future Features</span>
              </span>
              <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-bold">
                NEW
              </span>
            </button>

            {isAuthenticated && currentUser ? (
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    onOpenProfile();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-sm font-bold text-slate-200"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <span>{currentUser.name} ({role})</span>
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-red-400 hover:text-red-300 text-xs font-semibold"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    onOpenAuth('signin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-orange-500 text-slate-950 font-bold rounded-xl text-xs text-center"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
