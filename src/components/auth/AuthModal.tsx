import React, { useState } from 'react';
import { X, Wrench, ShieldCheck, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'register' | 'forgot';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signin',
  onClose
}) => {
  const { login, register, requestPasswordReset } = useAuth();
  const [mode, setMode] = useState<'signin' | 'register' | 'forgot'>(initialMode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('rider');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const res = await login(email, password);
        if (res.success) {
          onClose();
        } else {
          setErrorMsg(res.error || 'Unable to sign in. Please check your credentials.');
        }
      } else if (mode === 'register') {
        const res = await register(name, email, selectedRole, password);
        if (res.success) {
          if (res.message) {
            setSuccessMsg(res.message);
            setTimeout(() => onClose(), 2500);
          } else {
            onClose();
          }
        } else {
          setErrorMsg(res.error || 'Registration failed. Email may already be registered.');
        }
      } else if (mode === 'forgot') {
        const res = await requestPasswordReset(email);
        if (res.success) {
          setSuccessMsg(res.message || `Password reset instructions sent to ${email}`);
        } else {
          setErrorMsg(res.error || 'Failed to send password reset link.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-sm w-full p-6 space-y-5 shadow-xl text-xs text-slate-700 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-1 text-center">
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-sm mx-auto shadow-md">
            MD
          </div>
          <h2 className="text-lg font-bold text-slate-900 pt-2">
            {mode === 'signin' && 'Sign In to Motorel Diag'}
            {mode === 'register' && 'Create Motorel Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-slate-500 text-[11px]">
            Access saved guides, bookmarks, and learning stats
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center font-medium space-y-1.5">
            <div>{errorMsg}</div>
            {mode === 'signin' && errorMsg.toLowerCase().includes('not found') && (
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setMode('register');
                }}
                className="inline-block px-3 py-1 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 text-[11px] shadow-sm transition-all"
              >
                Create Account with {email || 'this email'}
              </button>
            )}
          </div>
        )}

        {successMsg && (
          <div className="p-2.5 bg-green-50 border border-green-200 rounded-xl text-green-700 text-center font-medium">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Juan Dela Cruz"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Email Address</label>
            <input
              type="email"
              placeholder="e.g. rider@motorel.ph"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
            />
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Account Role</label>
              <select
                value={selectedRole}
                onChange={(e: any) => setSelectedRole(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-orange-500"
              >
                <option value="rider">Rider / Motorcycle Owner</option>
                <option value="mechanic">Mechanic</option>
                <option value="student">Student</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-bold rounded-xl shadow-md transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Processing...</span>
            ) : (
              <>
                {mode === 'signin' && 'Sign In'}
                {mode === 'register' && 'Create Account'}
                {mode === 'forgot' && 'Send Reset Link'}
              </>
            )}
          </button>
        </form>

        <div className="border-t border-gray-200 pt-3 text-center space-y-1.5 text-[11px] text-slate-500">
          {mode === 'signin' && (
            <>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-1">
                <p className="text-[10px] font-bold text-slate-700">Quick Fill Credentials:</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('zerelpingkian@gmail.com');
                      setPassword('admin12345');
                    }}
                    className="px-2 py-0.5 bg-orange-100 hover:bg-orange-200 text-orange-800 font-semibold rounded text-[10px]"
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('rider@motorel.ph');
                      setPassword('rider12345');
                    }}
                    className="px-2 py-0.5 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold rounded text-[10px]"
                  >
                    Rider (Juan)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('mechanic@motorel.ph');
                      setPassword('mechanic12345');
                    }}
                    className="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold rounded text-[10px]"
                  >
                    Mechanic (Benjie)
                  </button>
                </div>
              </div>

              <p>
                Don't have an account?{' '}
                <button onClick={() => setMode('register')} className="text-orange-600 font-bold hover:underline">
                  Create Account
                </button>
              </p>
              <button onClick={() => setMode('forgot')} className="text-slate-400 hover:text-slate-600 text-[10px]">
                Forgot password?
              </button>
            </>
          )}

          {mode === 'register' && (
            <p>
              Already registered?{' '}
              <button onClick={() => setMode('signin')} className="text-orange-600 font-bold hover:underline">
                Sign In
              </button>
            </p>
          )}

          {mode === 'forgot' && (
            <button onClick={() => setMode('signin')} className="text-orange-600 font-bold hover:underline">
              Return to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
