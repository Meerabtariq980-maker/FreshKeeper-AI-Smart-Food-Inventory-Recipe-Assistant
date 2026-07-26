import React from "react";
import { motion } from "motion/react";
import { Leaf, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

interface SplashProps {
  onDismiss: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onDismiss }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-emerald-600 via-emerald-500 to-green-600 text-white p-6 md:p-12 overflow-hidden select-none"
    >
      {/* Decorative background blur elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Tag */}
      <div className="w-full flex justify-between items-center z-10">
        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>AI-Powered Food Assistant</span>
        </div>
        <button
          onClick={onDismiss}
          className="text-xs font-semibold hover:underline bg-black/10 px-3 py-1.5 rounded-full hover:bg-black/20 transition-colors"
        >
          Skip Intro
        </button>
      </div>

      {/* Hero Visual & Branding */}
      <div className="flex flex-col items-center text-center max-w-sm z-10 my-auto">
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative mb-6"
        >
          <div className="w-28 h-28 md:w-32 md:h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center text-emerald-600 transform -rotate-3 hover:rotate-0 transition-transform">
            <Leaf className="w-16 h-16 md:w-20 md:h-20 stroke-[2.2]" />
          </div>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-950 p-2 rounded-2xl shadow-lg border-2 border-white"
          >
            <Sparkles className="w-5 h-5 fill-amber-400" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2"
        >
          FreshKeeper AI
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-emerald-100 text-base md:text-lg font-medium max-w-xs mb-8"
        >
          "Reduce Food Waste. Save Money."
        </motion.p>

        {/* Value Highlights */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-3 w-full text-left text-xs mb-6"
        >
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-200 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Expiry Alerts</p>
              <p className="text-emerald-100/80 text-[11px]">3-day smart notifications</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">AI Recipes</p>
              <p className="text-emerald-100/80 text-[11px]">Turn leftovers into meals</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <div className="w-full max-w-sm z-10 flex flex-col gap-3">
        <button
          onClick={onDismiss}
          className="w-full py-4 bg-white text-emerald-700 hover:bg-emerald-50 active:scale-[0.99] font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 text-base transition-all"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-center text-xs text-emerald-100/80 font-medium">
          Smart Household Inventory Management
        </p>
      </div>
    </motion.div>
  );
};
