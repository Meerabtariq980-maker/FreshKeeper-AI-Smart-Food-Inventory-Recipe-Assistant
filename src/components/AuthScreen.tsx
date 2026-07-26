import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Leaf,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChefHat,
  Home,
  Users,
  GraduationCap,
  Info,
} from "lucide-react";
import { UserProfile } from "../types";

interface AuthScreenProps {
  onLoginSuccess: (user: Partial<UserProfile>) => void;
  onRegisterSuccess: (user: Partial<UserProfile>) => void;
}

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80",
];

const HOUSEHOLD_ROLES = [
  { id: "Manager", label: "Household Manager", icon: Home },
  { id: "Chef", label: "Primary Chef / Cook", icon: ChefHat },
  { id: "Roommate", label: "Shared Roommate", icon: Users },
  { id: "Student", label: "Student / Single", icon: GraduationCap },
];

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  onRegisterSuccess,
}) => {
  const [mode, setMode] = useState<"login" | "register">("login");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("alex.morgan@freshkeeper.io");
  const [loginPassword, setLoginPassword] = useState("password123");
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regRole, setRegRole] = useState("Manager");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // UI helpers
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMsg("Please enter both email address and password.");
      return;
    }

    if (!loginEmail.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    // Simulate login
    setSuccessMsg("Signing you in...");
    setTimeout(() => {
      onLoginSuccess({
        email: loginEmail,
        name: loginEmail.split("@")[0].replace(".", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      });
    }, 600);
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (!regEmail.includes("@")) {
      setErrorMsg("Please provide a valid email address.");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg("Passwords do not match. Please check and try again.");
      return;
    }

    if (!agreeTerms) {
      setErrorMsg("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    setSuccessMsg("Creating your account...");
    setTimeout(() => {
      onRegisterSuccess({
        name: regName,
        email: regEmail,
        avatarUrl: selectedAvatar,
        role: regRole,
      });
    }, 700);
  };

  // Demo Login Quick Button
  const handleQuickDemoLogin = () => {
    setSuccessMsg("Logging in with demo account...");
    setTimeout(() => {
      onLoginSuccess({
        name: "Alex Morgan",
        email: "alex.morgan@freshkeeper.io",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      });
    }, 400);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes("@")) return;
    setForgotSent(true);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-[32px] border border-slate-200/80 shadow-2xl overflow-hidden">
        {/* TOP BRAND HEADER */}
        <div className="bg-[#0F172A] text-white p-6 sm:p-8 text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-[#22C55E] text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-green-500/20">
            <Leaf className="w-7 h-7 stroke-[2.5]" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#22C55E] mb-1">
            Smart Household Inventory
          </p>
          <h2 className="text-3xl font-serif italic text-white">FreshKeeper AI</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Organize food supplies, reduce waste, and discover instant AI recipes.
          </p>

          {/* MODE TOGGLE TABS */}
          <div className="mt-6 p-1 bg-slate-900 rounded-2xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => {
                setMode("login");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                mode === "login"
                  ? "bg-[#22C55E] text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode("register");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                mode === "register"
                  ? "bg-[#22C55E] text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* ERROR / SUCCESS NOTIFICATIONS */}
        {errorMsg && (
          <div className="mx-6 mt-6 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-[#EF4444] font-bold flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 mt-6 p-3.5 bg-green-50 border border-green-200 rounded-2xl text-xs text-[#22C55E] font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* FORM CONTENT */}
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {mode === "login" ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLoginSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#22C55E]" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. alex@example.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:bg-white text-sm font-medium text-slate-800"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-[#22C55E]" />
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotModal(true)}
                      className="text-xs font-bold text-[#22C55E] hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:bg-white text-sm font-medium text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 accent-[#22C55E] rounded-md cursor-pointer"
                    />
                    <span>Remember my session</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#22C55E] hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest rounded-full shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>Sign In To FreshKeeper</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* DEMO / QUICK LOGIN BUTTON */}
                <div className="pt-2 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={handleQuickDemoLogin}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                    <span>Try Instant Demo Login</span>
                  </button>
                </div>

                {/* SOCIAL SIGN IN */}
                <div className="pt-4 space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
                    Or continue with
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleQuickDemoLogin}
                      className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Google</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleQuickDemoLogin}
                      className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4 fill-slate-900" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.09c.68-.83 1.14-1.99.1-3.09-1.03.04-2.28.69-2.97 1.51-.62.73-1.16 1.92-1.01 3.05 1.15.09 2.33-.58 2.88-1.47z" />
                      </svg>
                      <span>Apple</span>
                    </button>
                  </div>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="register-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleRegisterSubmit}
                className="space-y-4"
              >
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#22C55E]" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Jordan Miller"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:bg-white text-sm font-medium text-slate-800"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#22C55E]" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. jordan@example.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:bg-white text-sm font-medium text-slate-800"
                  />
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:bg-white text-sm font-medium text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:bg-white text-sm font-medium text-slate-800"
                    />
                  </div>
                </div>

                {/* Household Role */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Your Household Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {HOUSEHOLD_ROLES.map((r) => {
                      const IconComp = r.icon;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setRegRole(r.id)}
                          className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                            regRole === r.id
                              ? "bg-green-50 border-[#22C55E] text-[#22C55E]"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <IconComp className="w-4 h-4 shrink-0" />
                          <span className="text-xs font-bold">{r.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Avatar Preset Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Choose Profile Avatar
                  </label>
                  <div className="flex items-center gap-3 overflow-x-auto pb-1">
                    {AVATAR_PRESETS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedAvatar(url)}
                        className={`w-11 h-11 rounded-full overflow-hidden p-0.5 border-2 transition-transform shrink-0 ${
                          selectedAvatar === url
                            ? "border-[#22C55E] scale-110 shadow-md"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={url}
                          alt="Avatar preset"
                          className="w-full h-full object-cover rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer text-xs font-medium text-slate-600">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-[#22C55E] rounded-md cursor-pointer shrink-0"
                    />
                    <span>
                      I agree to FreshKeeper's <strong className="text-slate-800">Terms of Service</strong> and{" "}
                      <strong className="text-slate-800">Privacy Policy</strong>.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#22C55E] hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest rounded-full shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Create Account</span>
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      <AnimatePresence>
        {forgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl relative border border-slate-100"
            >
              <button
                onClick={() => {
                  setForgotModal(false);
                  setForgotSent(false);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#22C55E] flex items-center justify-center mb-3">
                <Mail className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-serif italic text-slate-800 mb-1">Reset Password</h3>
              <p className="text-xs text-slate-500 mb-4">
                Enter your account email to receive a password reset link.
              </p>

              {forgotSent ? (
                <div className="p-4 bg-green-50 rounded-2xl border border-green-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#22C55E] mx-auto" />
                  <p className="text-xs font-bold text-slate-800">Reset Email Dispatched!</p>
                  <p className="text-[11px] text-slate-500">
                    Check your inbox at <strong>{forgotEmail}</strong> for recovery instructions.
                  </p>
                  <button
                    onClick={() => {
                      setForgotModal(false);
                      setForgotSent(false);
                    }}
                    className="mt-2 px-5 py-2 bg-[#22C55E] text-white font-bold text-xs uppercase tracking-wider rounded-full"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Your account email..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-slate-800 text-white font-bold text-xs uppercase tracking-widest rounded-full"
                  >
                    Send Reset Link
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
