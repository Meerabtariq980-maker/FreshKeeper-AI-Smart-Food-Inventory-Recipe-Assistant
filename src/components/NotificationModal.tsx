import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Trash2, CheckCircle2, UtensilsCrossed, Bell, Clock } from "lucide-react";
import { FoodItem } from "../types";
import { getDaysRemaining, getExpiryStatus } from "../data/initialData";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  foodItems: FoodItem[];
  onConsumeItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onNavigateToRecipes: (ingredients: string[]) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  foodItems,
  onConsumeItem,
  onDeleteItem,
  onNavigateToRecipes,
}) => {
  if (!isOpen) return null;

  const alertItems = foodItems
    .map((item) => ({
      ...item,
      days: getDaysRemaining(item.expiryDate),
      status: getExpiryStatus(item.expiryDate),
    }))
    .filter((item) => item.status === "expired" || item.status === "expiring-soon")
    .sort((a, b) => a.days - b.days);

  const expiredItems = alertItems.filter((item) => item.status === "expired");
  const expiringSoonItems = alertItems.filter((item) => item.status === "expiring-soon");

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] shadow-2xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-100"
        >
          {/* Modal Header */}
          <div className="px-6 py-5 bg-[#0F172A] text-white border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-[#F59E0B] flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-[#F59E0B] font-bold">Household Alerts</p>
                <h3 className="text-xl font-serif italic text-white">Expiry Notifications</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {alertItems.length === 0 ? (
              <div className="text-center py-10">
                <CheckCircle2 className="w-14 h-14 text-[#22C55E] mx-auto mb-3" />
                <h4 className="text-lg font-serif italic text-slate-800">All clear!</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                  You have no expired items or items expiring in the next 3 days. Excellent job managing your pantry!
                </p>
              </div>
            ) : (
              <>
                {/* Expired Items Section (RED) */}
                {expiredItems.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#EF4444]">
                        Expired ({expiredItems.length})
                      </h4>
                    </div>

                    <div className="space-y-3">
                      {expiredItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-red-50/70 border border-red-200/80 rounded-2xl p-4 shadow-xs flex flex-col gap-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-slate-800 text-base">{item.name}</h5>
                                <span className="bg-red-100 text-[#EF4444] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                  Expired
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                                Category: {item.category} • Qty: {item.quantity}
                              </p>
                            </div>
                            <span className="text-xs font-bold text-[#EF4444] bg-white px-2.5 py-1 rounded-full border border-red-100">
                              {Math.abs(item.days)} day{Math.abs(item.days) === 1 ? "" : "s"} ago
                            </span>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-red-200/50">
                            <button
                              onClick={() => onConsumeItem(item.id)}
                              className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 bg-white hover:bg-slate-50 rounded-full border border-slate-200 flex items-center gap-1.5 transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                              <span>Consumed</span>
                            </button>
                            <button
                              onClick={() => onDeleteItem(item.id)}
                              className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#EF4444] hover:bg-red-600 rounded-full flex items-center gap-1.5 shadow-xs transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Discard</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expiring Soon Section (ORANGE) */}
                {expiringSoonItems.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#F59E0B]">
                        Expires Soon ({expiringSoonItems.length})
                      </h4>
                    </div>

                    <div className="space-y-3">
                      {expiringSoonItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 shadow-xs flex flex-col gap-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-slate-800 text-base">{item.name}</h5>
                                <span className="bg-amber-100 text-[#F59E0B] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {item.days === 0
                                    ? "Expires Today"
                                    : `${item.days} Day${item.days === 1 ? "" : "s"} Left`}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                                Category: {item.category} • Qty: {item.quantity}
                              </p>
                            </div>
                            <span className="text-xs font-medium text-slate-400">
                              Exp: {item.expiryDate}
                            </span>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-200/50">
                            <button
                              onClick={() => {
                                onNavigateToRecipes([item.name]);
                                onClose();
                              }}
                              className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#22C55E] bg-green-50 hover:bg-green-100 rounded-full border border-green-200 flex items-center gap-1.5 transition-colors"
                            >
                              <UtensilsCrossed className="w-3.5 h-3.5" />
                              <span>AI Recipe</span>
                            </button>
                            <button
                              onClick={() => onConsumeItem(item.id)}
                              className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#22C55E] hover:bg-emerald-600 rounded-full flex items-center gap-1.5 shadow-xs transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Consumed</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

