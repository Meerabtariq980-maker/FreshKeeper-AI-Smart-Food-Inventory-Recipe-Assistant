import React from "react";
import { Bell, Sparkles, Leaf } from "lucide-react";
import { UserProfile, FoodItem } from "../types";
import { getExpiryStatus } from "../data/initialData";

interface HeaderProps {
  user: UserProfile;
  foodItems: FoodItem[];
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onShowSplash: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  foodItems,
  onOpenNotifications,
  onOpenProfile,
  onShowSplash,
}) => {
  // Determine dynamic greeting based on hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Date String
  const currentDateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  // Count active alert items (expired or expiring in 3 days)
  const alertCount = foodItems.filter((item) => {
    const status = getExpiryStatus(item.expiryDate);
    return status === "expired" || status === "expiring-soon";
  }).length;

  const freshPercentage = foodItems.length > 0
    ? Math.round(((foodItems.length - alertCount) / foodItems.length) * 100)
    : 100;

  return (
    <header className="sticky top-0 z-30 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-8 py-4">
      <div className="max-w-5xl mx-auto flex items-end justify-between gap-4">
        {/* Brand Logo & Greeting */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onShowSplash}
            className="w-11 h-11 rounded-2xl bg-[#22C55E] text-white flex items-center justify-center shadow-lg shadow-green-200 hover:scale-105 active:scale-95 transition-transform"
            title="FreshKeeper AI - View Intro"
          >
            <Leaf className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-0.5 flex items-center gap-1.5">
              <span>{currentDateStr}</span>
              <span>•</span>
              <span className="text-[#22C55E] font-extrabold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500 inline" /> FreshKeeper
              </span>
            </p>
            <h1 className="text-2xl sm:text-3xl font-serif italic text-slate-800 tracking-normal">
              {getGreeting()}, {user.name.split(" ")[0]}
            </h1>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Freshness Score Badge */}
          <div className="hidden md:flex flex-col text-right mr-1">
            <span className="text-xs font-bold text-slate-800">Freshness Score</span>
            <span className="text-[11px] font-semibold text-emerald-600">{freshPercentage}% Fresh</span>
          </div>

          {/* Notification Bell Button */}
          <button
            onClick={onOpenNotifications}
            className="relative w-11 h-11 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all border border-slate-200/80 shadow-xs"
            title="Expiry Notifications"
          >
            <Bell className="w-5 h-5" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                {alertCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar with artistic gradient border */}
          <button
            onClick={onOpenProfile}
            className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-[#22C55E] to-[#4ADE80] shadow-md hover:scale-105 transition-transform"
            title="Go to Profile"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover rounded-full border-2 border-white"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

