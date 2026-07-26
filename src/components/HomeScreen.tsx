import React from "react";
import { motion } from "motion/react";
import {
  Plus,
  Utensils,
  ShoppingBag,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Package,
  Sparkles,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { FoodItem, ActivityLog, TabType } from "../types";
import { getDaysRemaining, getExpiryStatus } from "../data/initialData";

interface HomeScreenProps {
  foodItems: FoodItem[];
  activities: ActivityLog[];
  recipesCount: number;
  onNavigateTab: (tab: TabType) => void;
  onOpenAddModal: () => void;
  onConsumeItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onNavigateToRecipesWithItems: (ingredients: string[]) => void;
}

// Category Emoji helper for artistic flair item cards
const getCategoryEmoji = (category: string) => {
  switch (category) {
    case "Vegetables":
      return "🥬";
    case "Fruits":
      return "🍎";
    case "Dairy":
      return "🥛";
    case "Meat":
      return "🥩";
    case "Frozen":
      return "🧊";
    case "Snacks":
      return "🥨";
    case "Drinks":
      return "🧃";
    case "Bakery":
      return "🍞";
    case "Pantry":
      return "🥫";
    default:
      return "🥗";
  }
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  foodItems,
  activities,
  recipesCount,
  onNavigateTab,
  onOpenAddModal,
  onConsumeItem,
  onDeleteItem,
  onNavigateToRecipesWithItems,
}) => {
  // Statistics
  const totalCount = foodItems.length;
  const expiringSoonItems = foodItems.filter(
    (i) => getExpiryStatus(i.expiryDate) === "expiring-soon"
  );
  const expiringSoonCount = expiringSoonItems.length;
  const expiredCount = foodItems.filter(
    (i) => getExpiryStatus(i.expiryDate) === "expired"
  ).length;

  // Upcoming expiry items (sorted by closest expiry)
  const upcomingItems = [...foodItems]
    .map((item) => ({
      ...item,
      days: getDaysRemaining(item.expiryDate),
      status: getExpiryStatus(item.expiryDate),
    }))
    .sort((a, b) => a.days - b.days)
    .slice(0, 4);

  // Dynamic AI suggestion
  const suggestedIngredient = expiringSoonItems.length > 0
    ? expiringSoonItems[0].name
    : foodItems.length > 0
    ? foodItems[0].name
    : "Spinach";

  return (
    <div className="space-y-8 pb-12">
      {/* 4 STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[32px] shadow-xs border border-slate-100 flex flex-col justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">
            Total Items
          </p>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#22C55E] tracking-tight">
            {totalCount}
          </p>
        </div>

        <div className="bg-white p-5 rounded-[32px] shadow-xs border border-slate-100 flex flex-col justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">
            Expiring Soon
          </p>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#F59E0B] tracking-tight">
            {expiringSoonCount}
          </p>
        </div>

        <div className="bg-white p-5 rounded-[32px] shadow-xs border border-slate-100 flex flex-col justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">
            Expired
          </p>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#EF4444] tracking-tight">
            {expiredCount}
          </p>
        </div>

        <div className="bg-white p-5 rounded-[32px] shadow-xs border border-slate-100 flex flex-col justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">
            AI Recipes
          </p>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            {recipesCount}
          </p>
        </div>
      </div>

      {/* TWO COLUMN LAYOUT FOR MAIN DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: UPCOMING EXPIRY LIST */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center mb-2 px-1">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Upcoming Expiry</h2>
              <p className="text-xs text-slate-400">Pantry items needing attention</p>
            </div>
            <button
              onClick={() => onNavigateTab("inventory")}
              className="text-xs text-[#22C55E] font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
            >
              <span>View All ({foodItems.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {upcomingItems.length === 0 ? (
            <div className="bg-white p-8 rounded-[32px] text-center border border-slate-100 shadow-xs">
              <CheckCircle2 className="w-12 h-12 text-[#22C55E] mx-auto mb-2" />
              <p className="text-base font-serif italic text-slate-800">Your pantry is fresh!</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">Add ingredients to start tracking shelf life.</p>
              <button
                onClick={onOpenAddModal}
                className="px-5 py-2.5 bg-[#22C55E] text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-md shadow-green-200"
              >
                + Add Food Item
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white p-4 sm:p-5 rounded-3xl flex items-center justify-between gap-4 shadow-xs border transition-all ${
                    item.status === "expired"
                      ? "border-red-100 bg-red-50/20"
                      : item.status === "expiring-soon"
                      ? "border-amber-100 bg-amber-50/20"
                      : "border-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                      item.status === "expired"
                        ? "bg-red-100 text-[#EF4444]"
                        : item.status === "expiring-soon"
                        ? "bg-orange-100 text-[#F59E0B]"
                        : "bg-green-100 text-[#22C55E]"
                    }`}>
                      {getCategoryEmoji(item.category)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-800 text-sm sm:text-base truncate">{item.name}</h3>
                      <p className="text-xs text-slate-400 font-medium">
                        {item.category} • {item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    {item.status === "expired" ? (
                      <span className="px-3 py-1 bg-red-100 text-[#EF4444] text-[10px] font-black rounded-full uppercase tracking-wider">
                        Expired
                      </span>
                    ) : item.status === "expiring-soon" ? (
                      <span className="px-3 py-1 bg-orange-100 text-[#F59E0B] text-[10px] font-black rounded-full uppercase tracking-wider">
                        {item.days === 0 ? "Today" : `${item.days} Days Left`}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-[#22C55E] text-[10px] font-black rounded-full uppercase tracking-wider">
                        {item.days} Days Left
                      </span>
                    )}
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[11px] text-slate-400 italic">Exp: {item.expiryDate}</p>
                      <button
                        onClick={() => onConsumeItem(item.id)}
                        className="text-[11px] font-bold text-emerald-600 hover:underline"
                        title="Mark consumed"
                      >
                        Used
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="text-slate-300 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: QUICK ACTIONS & ARTISTIC DARK AI BANNER */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* QUICK ACTIONS */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={onOpenAddModal}
                className="h-24 bg-[#22C55E] text-white rounded-3xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-green-200 transition-transform active:scale-95 group hover:bg-emerald-600"
              >
                <Plus className="w-6 h-6 stroke-[3]" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Add Food</span>
              </button>

              <button
                onClick={() => onNavigateTab("recipes")}
                className="h-24 bg-white border border-slate-200/80 text-slate-700 rounded-3xl flex flex-col items-center justify-center gap-1 shadow-xs transition-transform active:scale-95 hover:bg-slate-50"
              >
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-[11px] font-bold uppercase tracking-wider">AI Recipe</span>
              </button>

              <button
                onClick={() => onNavigateTab("shopping")}
                className="h-24 bg-white border border-slate-200/80 text-slate-700 rounded-3xl flex flex-col items-center justify-center gap-1 shadow-xs transition-transform active:scale-95 hover:bg-slate-50"
              >
                <ShoppingBag className="w-5 h-5 text-indigo-500" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Shopping</span>
              </button>
            </div>
          </div>

          {/* ARTISTIC DARK AI SUGGESTION CARD */}
          <div className="bg-slate-900 text-white p-7 sm:p-8 rounded-[36px] relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[220px]">
            <div className="relative z-10">
              <p className="text-[#22C55E] text-xs font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Zero-Waste Suggestion
              </p>
              <h3 className="text-2xl font-serif italic mb-3 leading-tight">
                You have fresh {suggestedIngredient} in your pantry.
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
                Cook a fresh meal today to save waste and reduce environmental impact. Ready in minutes.
              </p>
              <button
                onClick={() => onNavigateToRecipesWithItems([suggestedIngredient])}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3 px-6 rounded-full text-xs font-bold uppercase tracking-widest transition-all active:scale-95 shadow-xs"
              >
                View Meal Recipe
              </button>
            </div>
            {/* Glowing Accent Blur */}
            <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-[#22C55E]/20 blur-3xl rounded-full pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY SECTION */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">
          Recent Activity
        </h3>
        <div className="bg-white rounded-[32px] p-5 border border-slate-100 shadow-xs space-y-3">
          {activities.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-3">No recent activities logged.</p>
          ) : (
            activities.slice(0, 3).map((act) => (
              <div key={act.id} className="flex items-center justify-between gap-3 text-xs py-1">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{act.title}</p>
                    <p className="text-slate-400 text-[11px]">{act.description}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                  {act.timestamp}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

