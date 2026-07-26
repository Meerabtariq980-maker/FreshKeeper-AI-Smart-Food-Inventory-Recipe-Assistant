import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Plus, Calendar, Tag, Box, Info, Loader2 } from "lucide-react";
import { Category, FoodItem } from "../types";
import { getRelativeDate } from "../data/initialData";

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFood: (newItem: Omit<FoodItem, "id" | "createdAt">) => void;
}

const CATEGORIES: Category[] = [
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

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isOpen,
  onClose,
  onAddFood,
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("Vegetables");
  const [quantity, setQuantity] = useState("1 Pack");
  const [purchaseDate, setPurchaseDate] = useState(getRelativeDate(0));
  const [expiryDate, setExpiryDate] = useState(getRelativeDate(7));
  const [storageLocation, setStorageLocation] = useState<"Fridge" | "Pantry" | "Freezer">("Fridge");
  const [notes, setNotes] = useState("");

  const [aiLoading, setAiLoading] = useState(false);
  const [aiStorageTip, setAiStorageTip] = useState<string | null>(null);

  if (!isOpen) return null;

  // Trigger AI auto-estimate for shelf life based on food name
  const handleAiEstimate = async () => {
    if (!name.trim()) return;
    setAiLoading(true);
    setAiStorageTip(null);
    try {
      const res = await fetch("/api/items/suggest-expiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemName: name, category }),
      });
      const data = await res.json();
      if (data.estimatedDays) {
        setExpiryDate(getRelativeDate(data.estimatedDays));
      }
      if (data.suggestedCategory && CATEGORIES.includes(data.suggestedCategory as Category)) {
        setCategory(data.suggestedCategory as Category);
      }
      if (data.storageTip) {
        setAiStorageTip(data.storageTip);
      }
    } catch (err) {
      console.error("AI Estimation failed:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddFood({
      name: name.trim(),
      category,
      quantity: quantity.trim() || "1 item",
      purchaseDate,
      expiryDate,
      storageLocation,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setName("");
    setQuantity("1 Pack");
    setNotes("");
    setAiStorageTip(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-[#0F172A] text-white border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center">
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-[#22C55E] font-bold">New Pantry Item</p>
                <h3 className="text-xl font-serif italic text-white">Add Food Item</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
            {/* Food Name + AI Autofill Button */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Food Name *
              </label>
              <div className="relative flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. Baby Spinach, Whole Milk, Chicken"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:bg-white text-sm font-medium text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAiEstimate}
                  disabled={!name.trim() || aiLoading}
                  className="shrink-0 px-4 py-2.5 bg-green-50 text-[#22C55E] hover:bg-green-100 border border-green-200 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                  title="AI Estimate Expiry & Category"
                >
                  {aiLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#22C55E]" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span className="hidden sm:inline">AI Estimate</span>
                    </>
                  )}
                </button>
              </div>
              {aiStorageTip && (
                <div className="mt-2 text-xs bg-amber-50 text-amber-800 p-3 rounded-2xl border border-amber-200/80 flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                  <span>{aiStorageTip}</span>
                </div>
              )}
            </div>

            {/* Category Dropdown & Quantity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#22C55E]" />
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:bg-white text-sm font-medium text-slate-900"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <Box className="w-3.5 h-3.5 text-[#22C55E]" />
                  Quantity
                </label>
                <input
                  type="text"
                  placeholder="e.g. 500g, 2 pcs"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:bg-white text-sm font-medium text-slate-900"
                />
              </div>
            </div>

            {/* Purchase Date & Expiry Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:bg-white text-xs font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F59E0B] uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" />
                  Expiry Date *
                </label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3.5 py-3 bg-orange-50/50 border border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:bg-white text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Storage Location Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Storage Location
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["Fridge", "Pantry", "Freezer"] as const).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setStorageLocation(loc)}
                    className={`py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                      storageLocation === loc
                        ? "bg-[#22C55E] text-white border-[#22C55E] shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Opened yesterday, use for smoothie"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:bg-white text-xs font-medium text-slate-900"
              />
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-[#22C55E] hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest rounded-full shadow-lg shadow-green-200 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 stroke-[3]" />
                <span>Save Food Item</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

