import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Utensils,
  Clock,
  Gauge,
  BookOpen,
  ShoppingBag,
  HeartPulse,
  Leaf,
  X,
  Loader2,
} from "lucide-react";
import { FoodItem, Recipe } from "../types";
import { getExpiryStatus } from "../data/initialData";

interface AiRecipeScreenProps {
  foodItems: FoodItem[];
  preselectedIngredients?: string[];
  onAddMissingToShoppingList: (ingredients: string[]) => void;
  onIncrementRecipeCount: () => void;
}

export const AiRecipeScreen: React.FC<AiRecipeScreenProps> = ({
  foodItems,
  preselectedIngredients = [],
  onAddMissingToShoppingList,
  onIncrementRecipeCount,
}) => {
  // Available ingredients from current inventory (prefer expiring soon)
  const availableItems = foodItems.map((i) => ({
    name: i.name,
    status: getExpiryStatus(i.expiryDate),
  }));

  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(
    preselectedIngredients.length > 0
      ? preselectedIngredients
      : availableItems.slice(0, 3).map((i) => i.name)
  );

  const [customInput, setCustomInput] = useState("");
  const [dietaryPreference, setDietaryPreference] = useState("Quick & Easy");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [addedToListSuccess, setAddedToListSuccess] = useState(false);

  // Toggle ingredient chip
  const toggleIngredient = (name: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  // Add custom ingredient
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    if (!selectedIngredients.includes(customInput.trim())) {
      setSelectedIngredients((prev) => [...prev, customInput.trim()]);
    }
    setCustomInput("");
  };

  // Call API to generate recipe
  const handleGenerateRecipe = async () => {
    if (selectedIngredients.length === 0) {
      setError("Please select at least one ingredient.");
      return;
    }

    setLoading(true);
    setError(null);
    setAddedToListSuccess(false);

    try {
      const response = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: selectedIngredients,
          preferences: dietaryPreference,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to generate recipe.");
      }

      setGeneratedRecipe(data);
      onIncrementRecipeCount();
    } catch (err: any) {
      console.error("Recipe generation error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToShopping = () => {
    if (!generatedRecipe) return;
    onAddMissingToShoppingList(generatedRecipe.ingredientsUsed);
    setAddedToListSuccess(true);
    setTimeout(() => setAddedToListSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER TITLE */}
      <div className="bg-[#0F172A] text-white p-6 rounded-[32px] border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#22C55E]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[#22C55E] font-bold">Culinary Studio</p>
            <h2 className="text-3xl font-serif italic text-white">AI Recipe Generator</h2>
          </div>
        </div>
        <p className="text-xs text-slate-400 font-medium ml-16">
          Transform available pantry ingredients into zero-waste meals
        </p>
      </div>

      {/* INGREDIENTS MULTI-SELECT CHIPS */}
      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Pantry Selection</p>
            <h3 className="text-lg font-serif italic text-slate-800 flex items-center gap-2">
              <span>Select Ingredients ({selectedIngredients.length} active)</span>
            </h3>
          </div>
          <button
            onClick={() => setSelectedIngredients([])}
            className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600"
          >
            Clear All
          </button>
        </div>

        {/* Chips list */}
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
          {availableItems.length === 0 ? (
            <p className="text-xs text-slate-400 py-2">
              No items in inventory. Add food items or type custom ingredients below!
            </p>
          ) : (
            availableItems.map((item, idx) => {
              const isSelected = selectedIngredients.includes(item.name);
              return (
                <button
                  key={`${item.name}-${idx}`}
                  onClick={() => toggleIngredient(item.name)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border ${
                    isSelected
                      ? "bg-[#22C55E] text-white border-[#22C55E] shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.status === "expired"
                        ? "bg-[#EF4444]"
                        : item.status === "expiring-soon"
                        ? "bg-[#F59E0B]"
                        : "bg-[#22C55E]"
                    }`}
                  />
                  <span>{item.name}</span>
                  {isSelected && <X className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              );
            })
          )}
        </div>

        {/* Custom Ingredient Input */}
        <form onSubmit={handleAddCustom} className="flex gap-2 pt-2 border-t border-slate-100">
          <input
            type="text"
            placeholder="Add extra pantry ingredient (e.g. Rice, Olive Oil, Garlic)..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-full shrink-0"
          >
            + Add
          </button>
        </form>

        {/* Dietary Preference Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            Recipe Style & Preference
          </label>
          <div className="flex flex-wrap gap-2">
            {["Quick & Easy", "Zero Waste Special", "High Protein", "Comfort Food", "Vegetarian"].map((pref) => (
              <button
                key={pref}
                onClick={() => setDietaryPreference(pref)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                  dietaryPreference === pref
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        {/* Error message if any */}
        {error && (
          <div className="p-3 bg-red-50 text-[#EF4444] text-xs font-medium rounded-2xl border border-red-200">
            {error}
          </div>
        )}

        {/* Large Generate Button */}
        <button
          onClick={handleGenerateRecipe}
          disabled={loading || selectedIngredients.length === 0}
          className="w-full py-4 bg-[#22C55E] hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest rounded-full shadow-lg shadow-green-200 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Crafting Recipe...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Recipe</span>
            </>
          )}
        </button>
      </div>

      {/* RECIPE OUTPUT CARD */}
      <AnimatePresence>
        {generatedRecipe && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-xl space-y-6"
          >
            {/* Header / Title */}
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#22C55E] uppercase tracking-widest mb-1">
                <Sparkles className="w-4 h-4" />
                <span>AI Generated Recipe</span>
              </div>
              <h3 className="text-3xl font-serif italic text-slate-800">
                {generatedRecipe.recipeName}
              </h3>

              <div className="flex items-center gap-3 mt-3 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-1.5 bg-green-50 text-[#22C55E] px-3.5 py-1.5 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span>{generatedRecipe.cookingTime}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3.5 py-1.5 rounded-full">
                  <Gauge className="w-4 h-4 text-slate-500" />
                  <span>Difficulty: {generatedRecipe.difficulty}</span>
                </div>
              </div>
            </div>

            {/* Ingredients Used */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-[#22C55E]" />
                Ingredients Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {generatedRecipe.ingredientsUsed.map((ing, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-50 text-slate-800 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-slate-200/60"
                  >
                    ✓ {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Step-by-step Instructions */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#22C55E]" />
                Step-by-Step Instructions
              </h4>
              <ol className="space-y-3">
                {generatedRecipe.instructions.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="w-6 h-6 rounded-full bg-[#22C55E] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Nutrition & Food Waste Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-green-50/70 p-4 rounded-2xl border border-green-200/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  <HeartPulse className="w-4 h-4 text-[#22C55E]" />
                  <span>Nutrition Tip</span>
                </div>
                <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                  {generatedRecipe.nutritionTips}
                </p>
              </div>

              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
                  <Leaf className="w-4 h-4 text-[#F59E0B]" />
                  <span>Food Waste Tip</span>
                </div>
                <p className="text-xs text-amber-900 font-medium leading-relaxed">
                  {generatedRecipe.foodWasteTip}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <button
                onClick={handleAddToShopping}
                className="w-full sm:w-auto px-6 py-3 bg-[#22C55E] hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest rounded-full shadow-md shadow-green-200 flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {addedToListSuccess
                    ? "✓ Added to Shopping List!"
                    : "Add Missing Items to Shopping List"}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
