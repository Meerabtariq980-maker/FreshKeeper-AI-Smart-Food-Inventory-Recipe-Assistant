import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Package,
  UtensilsCrossed,
} from "lucide-react";
import { Category, FoodItem } from "../types";
import { getDaysRemaining, getExpiryStatus } from "../data/initialData";

interface InventoryScreenProps {
  foodItems: FoodItem[];
  onOpenAddModal: () => void;
  onOpenEditModal: (item: FoodItem) => void;
  onConsumeItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onCookRecipe: (ingredients: string[]) => void;
}

const CATEGORIES: ("All" | Category)[] = [
  "All",
  "Vegetables",
  "Fruits",
  "Dairy",
  "Meat",
  "Frozen",
  "Snacks",
  "Drinks",
  "Bakery",
  "Pantry",
];

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
      return "📦";
  }
};

export const InventoryScreen: React.FC<InventoryScreenProps> = ({
  foodItems,
  onOpenAddModal,
  onOpenEditModal,
  onConsumeItem,
  onDeleteItem,
  onCookRecipe,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | Category>("All");
  const [sortBy, setSortBy] = useState<"expiry" | "name" | "category">("expiry");

  // Filter items based on search query & selected category
  const filteredItems = foodItems
    .filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "expiry") {
        return getDaysRemaining(a.expiryDate) - getDaysRemaining(b.expiryDate);
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return a.category.localeCompare(b.category);
    });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Add Button */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Pantry Collection</p>
          <h2 className="text-3xl font-serif italic text-slate-800">Food Inventory</h2>
        </div>
        <button
          onClick={onOpenAddModal}
          className="px-5 py-2.5 bg-[#22C55E] hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest rounded-full shadow-lg shadow-green-200 flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Item</span>
        </button>
      </div>

      {/* SEARCH BAR & SORT SELECTOR */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/80 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#22C55E] shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest shrink-0 hidden sm:inline">
            Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3.5 py-3 bg-white border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#22C55E] shadow-xs"
          >
            <option value="expiry">Expiry (Soonest)</option>
            <option value="name">Name (A-Z)</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>

      {/* CATEGORY FILTERS CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-[#22C55E] text-white shadow-md shadow-green-200"
                : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FOOD CARDS GRID */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-[32px] p-10 text-center border border-slate-100 shadow-xs">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-serif italic text-slate-800">No items found</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 mb-4">
            Try adjusting your search query or filter category.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-slate-200"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const days = getDaysRemaining(item.expiryDate);
            const status = getExpiryStatus(item.expiryDate);

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-white rounded-[32px] p-5 border shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 ${
                  status === "expired"
                    ? "border-red-100 bg-red-50/10"
                    : status === "expiring-soon"
                    ? "border-orange-100 bg-orange-50/10"
                    : "border-slate-100"
                }`}
              >
                {/* Top Section */}
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                      status === "expired"
                        ? "bg-red-100"
                        : status === "expiring-soon"
                        ? "bg-orange-100"
                        : "bg-green-50"
                    }`}
                  >
                    {getCategoryEmoji(item.category)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-800 text-base truncate">
                        {item.name}
                      </h3>

                      {/* Status Badge */}
                      {status === "expired" ? (
                        <span className="bg-red-100 text-[#EF4444] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1">
                          Expired
                        </span>
                      ) : status === "expiring-soon" ? (
                        <span className="bg-orange-100 text-[#F59E0B] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1">
                          {days === 0 ? "Expires Today" : `${days}d Left`}
                        </span>
                      ) : (
                        <span className="bg-green-100 text-[#22C55E] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
                          Fresh ({days}d)
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400 font-medium">
                      <span className="text-[#22C55E] font-bold">
                        {item.category}
                      </span>
                      <span>• Qty: {item.quantity}</span>
                      {item.storageLocation && (
                        <span>• {item.storageLocation}</span>
                      )}
                    </div>

                    <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-2 italic">
                      <span>Pur: {item.purchaseDate}</span>
                      <span>•</span>
                      <span className="font-medium text-slate-600">Exp: {item.expiryDate}</span>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-slate-500 italic mt-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    {status === "expiring-soon" && (
                      <button
                        onClick={() => onCookRecipe([item.name])}
                        className="px-3.5 py-1.5 font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-full border border-emerald-200 flex items-center gap-1"
                        title="AI Cook Recipe"
                      >
                        <UtensilsCrossed className="w-3.5 h-3.5" />
                        <span>Cook</span>
                      </button>
                    )}
                    <button
                      onClick={() => onConsumeItem(item.id)}
                      className="px-3.5 py-1.5 font-bold text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-full flex items-center gap-1 transition-colors"
                      title="Mark as consumed"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                      <span>Consumed</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenEditModal(item)}
                      className="p-2 text-slate-400 hover:text-[#22C55E] rounded-xl transition-colors"
                      title="Edit Item"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-2 text-slate-300 hover:text-[#EF4444] rounded-xl transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

