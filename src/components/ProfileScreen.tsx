import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Moon,
  Sun,
  Bell,
  Info,
  Shield,
  Leaf,
  DollarSign,
  ChevronRight,
  X,
  RotateCcw,
  LogOut,
  User,
} from "lucide-react";
import { UserProfile } from "../types";

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onResetData: () => void;
  onLogout?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateProfile,
  onResetData,
  onLogout,
}) => {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      {/* PROFILE HEADER CARD */}
      <div className="bg-[#0F172A] text-white rounded-[32px] p-6 border border-slate-800 shadow-xl text-center relative overflow-hidden">
        <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-4 border-[#22C55E]/40 shadow-lg mb-3">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <p className="text-xs uppercase tracking-widest text-[#22C55E] font-bold">
          {user.role ? `${user.role}` : "Household Member"}
        </p>
        <h2 className="text-3xl font-serif italic text-white mt-0.5">{user.name}</h2>
        <p className="text-xs text-slate-400 font-medium">{user.email}</p>

        {/* Impact Badges */}
        <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#22C55E] uppercase tracking-wider mb-1">
              <DollarSign className="w-4 h-4" />
              <span>Money Saved</span>
            </div>
            <p className="text-2xl font-serif italic text-white">${user.monthlySavings}</p>
            <p className="text-[11px] text-slate-400 font-medium">This month</p>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-400 uppercase tracking-wider mb-1">
              <Leaf className="w-4 h-4" />
              <span>Waste Prevented</span>
            </div>
            <p className="text-2xl font-serif italic text-white">{user.wastePreventedKg} kg</p>
            <p className="text-[11px] text-slate-400 font-medium">CO2 reduced</p>
          </div>
        </div>
      </div>

      {/* SETTINGS OPTIONS */}
      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-xs space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">
          App Preferences
        </p>

        <div className="space-y-2">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center">
                {user.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#F59E0B]" />}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Dark Mode</p>
                <p className="text-xs text-slate-400">Enable high-contrast dark theme</p>
              </div>
            </div>
            <button
              onClick={() => onUpdateProfile({ darkMode: !user.darkMode })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                user.darkMode ? "bg-[#22C55E]" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  user.darkMode ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-50 text-[#22C55E] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Expiry Notifications</p>
                <p className="text-xs text-slate-400">Alerts for items expiring in 3 days</p>
              </div>
            </div>
            <button
              onClick={() => onUpdateProfile({ notificationsEnabled: !user.notificationsEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                user.notificationsEnabled ? "bg-[#22C55E]" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  user.notificationsEnabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* INFORMATION & LEGAL */}
      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-xs space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">
          Information
        </p>

        <div className="space-y-1">
          {/* About App */}
          <button
            onClick={() => setShowAboutModal(true)}
            className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-[#22C55E]" />
              <span className="text-sm font-bold text-slate-800">About FreshKeeper AI</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Privacy Policy */}
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-[#22C55E]" />
              <span className="text-sm font-bold text-slate-800">Privacy Policy</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* ACCOUNT & SIGN OUT */}
      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-800">Account Credentials</h4>
          <p className="text-xs text-slate-400">Logged in as {user.email}</p>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-full flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        )}
      </div>

      {/* DANGER ZONE / LOGOUT */}
      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-xs flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-800">Reset Demo Data</h4>
          <p className="text-xs text-slate-400">Restore default sample pantry & shopping lists</p>
        </div>
        <button
          onClick={onResetData}
          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-[#EF4444] font-bold text-xs uppercase tracking-widest rounded-full border border-red-200 flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset App</span>
        </button>
      </div>

      {/* ABOUT MODAL */}
      <AnimatePresence>
        {showAboutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-[32px] p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowAboutModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-[#22C55E] text-white flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 stroke-[2.5]" />
              </div>

              <h3 className="text-2xl font-serif italic text-slate-800 mb-1">About FreshKeeper AI</h3>
              <p className="text-xs font-bold text-[#22C55E] uppercase tracking-widest mb-4">Version 2.4.0</p>

              <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
                <p>
                  <strong>FreshKeeper AI</strong> is built to empower households, students, and working professionals to eliminate avoidable food waste.
                </p>
                <p>
                  By tracking shelf-life with smart expiry notifications and generating custom zero-waste recipes via Gemini AI, users save up to $1,800+ annually while reducing carbon emissions.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <button
                  onClick={() => setShowAboutModal(false)}
                  className="w-full py-3 bg-[#22C55E] text-white font-bold text-xs uppercase tracking-widest rounded-full"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PRIVACY POLICY MODAL */}
      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-[32px] p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 stroke-[2.5]" />
              </div>

              <h3 className="text-2xl font-serif italic text-slate-800 mb-2">Privacy Policy</h3>

              <div className="text-xs text-slate-600 space-y-3 leading-relaxed max-h-60 overflow-y-auto pr-1">
                <p>
                  Your privacy is paramount. FreshKeeper AI stores all food item records, purchase dates, and shopping preferences locally in your browser session.
                </p>
                <p>
                  Recipe requests use secure server-side proxy calls to Gemini AI without attaching personal user telemetry.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-full py-3 bg-slate-800 text-white font-bold text-xs uppercase tracking-widest rounded-full"
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

