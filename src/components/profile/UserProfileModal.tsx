import React, { useState } from 'react';
import { X, User, Bookmark, CheckCircle2, Wrench, ShieldCheck, Edit2, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToGuide: (guideId: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onNavigateToGuide
}) => {
  const { currentUser, role, logout, updateProfileName } = useAuth();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser?.name || '');

  if (!isOpen || !currentUser) return null;

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateProfileName(nameInput.trim());
      setEditingName(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-xs text-slate-200 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        {/* User Info Header */}
        <div className="flex items-center space-x-4 border-b border-slate-800 pb-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-500 shadow-md"
          />
          <div className="space-y-1 min-w-0 flex-1">
            {editingName ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white"
                />
                <button
                  onClick={handleSaveName}
                  className="px-2 py-1 bg-orange-500 text-slate-950 font-bold rounded-lg text-[10px]"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white truncate">{currentUser.name}</h2>
                <button
                  onClick={() => {
                    setNameInput(currentUser.name);
                    setEditingName(true);
                  }}
                  className="p-1 text-slate-500 hover:text-orange-400"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <p className="text-slate-400 text-[11px]">{currentUser.email}</p>
            <span className="inline-block px-2 py-0.5 bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase rounded border border-orange-500/30">
              Role: {role}
            </span>
          </div>
        </div>

        {/* User Learning Stats Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 block">Saved Guides</span>
            <span className="text-base font-black text-white">{currentUser.savedGuideIds.length}</span>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 block">Completed</span>
            <span className="text-base font-black text-emerald-400">{currentUser.completedGuideIds.length}</span>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 block">Garage Bikes</span>
            <span className="text-base font-black text-amber-400">{currentUser.favoriteMotorcycleIds.length}</span>
          </div>
        </div>

        {/* Saved Guides List */}
        <div className="space-y-2">
          <h3 className="font-bold text-slate-300 text-xs uppercase tracking-wider flex items-center space-x-1.5">
            <Bookmark className="w-4 h-4 text-orange-400" />
            <span>Bookmarked Guides ({currentUser.savedGuideIds.length})</span>
          </h3>

          <div className="max-h-36 overflow-y-auto space-y-1.5">
            {currentUser.savedGuideIds.length === 0 ? (
              <p className="text-slate-500 italic p-2">No guides bookmarked yet.</p>
            ) : (
              currentUser.savedGuideIds.map((id) => (
                <div
                  key={id}
                  onClick={() => {
                    onNavigateToGuide(id);
                    onClose();
                  }}
                  className="p-2.5 bg-slate-950 border border-slate-800 hover:border-orange-500 rounded-xl cursor-pointer flex justify-between items-center"
                >
                  <span className="font-medium text-slate-200 text-xs truncate">{id}</span>
                  <span className="text-orange-400 font-bold text-[10px]">Open →</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
          <span className="text-[10px] text-slate-500">Motorel Member since 2026</span>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 rounded-xl font-bold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
