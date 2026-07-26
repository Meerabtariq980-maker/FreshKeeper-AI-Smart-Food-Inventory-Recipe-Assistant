import React from "react";
import { motion } from "motion/react";
import {
  Home,
  Package,
  Sparkles,
  ShoppingBag,
  User,
  Plus,
} from "lucide-react";
import { TabType } from "../types";

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenAddModal: () => void;
  alertCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddModal,
  alertCount = 0,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "home", label: "Home", icon: <Home className="w-4 h-4" /> },
    { id: "inventory", label: "Inventory", icon: <Package className="w-4 h-4" />, badge: alertCount },
    { id: "recipes", label: "Recipes", icon: <Sparkles className="w-4 h-4" /> },
    { id: "shopping", label: "List", icon: <ShoppingBag className="w-4 h-4" /> },
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={onOpenAddModal}
        className="fixed bottom-22 right-5 sm:right-8 z-40 w-14 h-14 bg-[#22C55E] text-white rounded-full shadow-2xl shadow-green-400/50 flex items-center justify-center border-2 border-white focus:outline-none transition-transform"
        title="+ Add Food Item"
      >
        <Plus className="w-7 h-7 stroke-[3]" />
      </motion.button>

      {/* Bottom Bar Container */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-xl px-2 py-2">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className="relative flex flex-col items-center justify-center py-1.5 px-3 min-w-[60px] rounded-2xl transition-all"
              >
                {/* Active Dot Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabDot"
                    className="w-1.5 h-1.5 bg-[#22C55E] rounded-full mb-1"
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  />
                )}

                {/* Icon with alert badge */}
                <div
                  className={`relative transition-colors ${
                    isActive ? "text-[#22C55E]" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab.icon}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-2 bg-[#EF4444] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-[10px] font-black uppercase tracking-widest mt-0.5 transition-colors ${
                    isActive ? "text-[#22C55E]" : "text-slate-400"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

