import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TabType, FoodItem, ShoppingItem, ActivityLog, UserProfile } from "./types";
import {
  INITIAL_FOOD_ITEMS,
  INITIAL_SHOPPING_ITEMS,
  INITIAL_ACTIVITIES,
  INITIAL_PROFILE,
  getExpiryStatus,
  getRelativeDate,
} from "./data/initialData";

import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { Splash } from "./components/Splash";
import { NotificationModal } from "./components/NotificationModal";
import { AddFoodModal } from "./components/AddFoodModal";
import { EditFoodModal } from "./components/EditFoodModal";

import { HomeScreen } from "./components/HomeScreen";
import { InventoryScreen } from "./components/InventoryScreen";
import { AiRecipeScreen } from "./components/AiRecipeScreen";
import { ShoppingListScreen } from "./components/ShoppingListScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { AuthScreen } from "./components/AuthScreen";

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem("freshkeeper_is_logged_in");
    return savedAuth !== null ? savedAuth === "true" : true;
  });
  // Splash Screen State
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    return !sessionStorage.getItem("freshkeeper_splash_seen");
  });

  // Active Tab State
  const [activeTab, setActiveTab] = useState<TabType>("home");

  // Local Storage Data Persistent State
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem("freshkeeper_food_items");
    return saved ? JSON.parse(saved) : INITIAL_FOOD_ITEMS;
  });

  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem("freshkeeper_shopping_items");
    return saved ? JSON.parse(saved) : INITIAL_SHOPPING_ITEMS;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem("freshkeeper_activities");
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("freshkeeper_profile");
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [recipesCount, setRecipesCount] = useState<number>(() => {
    const saved = localStorage.getItem("freshkeeper_recipes_count");
    return saved ? parseInt(saved, 10) : 3;
  });

  // Modal Dialog States
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFoodItem, setEditingFoodItem] = useState<FoodItem | null>(null);

  // Preselected ingredients passed to AI Recipe generator
  const [recipePreselected, setRecipePreselected] = useState<string[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("freshkeeper_food_items", JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem("freshkeeper_shopping_items", JSON.stringify(shoppingItems));
  }, [shoppingItems]);

  useEffect(() => {
    localStorage.setItem("freshkeeper_activities", JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem("freshkeeper_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("freshkeeper_recipes_count", recipesCount.toString());
  }, [recipesCount]);

  useEffect(() => {
    localStorage.setItem("freshkeeper_is_logged_in", isLoggedIn ? "true" : "false");
  }, [isLoggedIn]);

  // Auth Handlers
  const handleLoginSuccess = (userData: Partial<UserProfile>) => {
    setUserProfile((prev) => ({
      ...prev,
      ...userData,
    }));
    setIsLoggedIn(true);
    setActiveTab("home");
    logActivity("User Signed In", `Logged in as ${userData.email || userData.name}`, "add");
  };

  const handleRegisterSuccess = (userData: Partial<UserProfile>) => {
    setUserProfile((prev) => ({
      ...prev,
      ...userData,
    }));
    setIsLoggedIn(true);
    setActiveTab("home");
    logActivity("New Account Created", `Welcome to FreshKeeper AI, ${userData.name}!`, "add");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    logActivity("Signed Out", "Session ended successfully", "delete");
  };

  const dismissSplash = () => {
    sessionStorage.setItem("freshkeeper_splash_seen", "true");
    setShowSplash(false);
  };

  // Activity Logger Helper
  const logActivity = (
    title: string,
    description: string,
    type: "add" | "consume" | "recipe" | "delete" | "shopping"
  ) => {
    const newLog: ActivityLog = {
      id: "act-" + Date.now(),
      title,
      description,
      timestamp: "Just now",
      type,
    };
    setActivities((prev) => [newLog, ...prev.slice(0, 9)]);
  };

  // Food Item Handlers
  const handleAddFood = (newItemData: Omit<FoodItem, "id" | "createdAt">) => {
    const newItem: FoodItem = {
      ...newItemData,
      id: "item-" + Date.now(),
      createdAt: Date.now(),
    };
    setFoodItems((prev) => [newItem, ...prev]);
    logActivity("Added Food Item", `Added ${newItem.quantity} ${newItem.name}`, "add");
  };

  const handleUpdateFood = (updatedItem: FoodItem) => {
    setFoodItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleConsumeFood = (id: string) => {
    const target = foodItems.find((i) => i.id === id);
    if (target) {
      logActivity("Consumed Item", `Used ${target.name} (${target.quantity})`, "consume");
      // Update user impact score
      setUserProfile((prev) => ({
        ...prev,
        wastePreventedKg: parseFloat((prev.wastePreventedKg + 0.35).toFixed(1)),
        monthlySavings: prev.monthlySavings + 4,
      }));
    }
    setFoodItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleDeleteFood = (id: string) => {
    const target = foodItems.find((i) => i.id === id);
    if (target) {
      logActivity("Removed Item", `Removed ${target.name} from inventory`, "delete");
    }
    setFoodItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleOpenEdit = (item: FoodItem) => {
    setEditingFoodItem(item);
    setIsEditModalOpen(true);
  };

  const handleNavigateToRecipes = (ingredients: string[]) => {
    setRecipePreselected(ingredients);
    setActiveTab("recipes");
  };

  // Shopping List Handlers
  const handleToggleShopping = (id: string) => {
    setShoppingItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i))
    );
  };

  const handleAddShopping = (newItemData: Omit<ShoppingItem, "id">) => {
    const newItem: ShoppingItem = {
      ...newItemData,
      id: "shop-" + Date.now(),
    };
    setShoppingItems((prev) => [newItem, ...prev]);
  };

  const handleDeleteShopping = (id: string) => {
    setShoppingItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearCompletedShopping = () => {
    setShoppingItems((prev) => prev.filter((i) => !i.completed));
  };

  const handleAddMissingToShoppingList = (ingredients: string[]) => {
    const newItems: ShoppingItem[] = ingredients.map((ing, idx) => ({
      id: "shop-gen-" + Date.now() + "-" + idx,
      name: ing,
      category: "Pantry",
      quantity: "1 pack",
      estimatedPrice: 3.20,
      completed: false,
      isAutoGenerated: true,
    }));
    setShoppingItems((prev) => [...newItems, ...prev]);
    logActivity("Added to Shopping", `Added recipe ingredients to list`, "shopping");
  };

  // Smart Auto-generate shopping list from expired inventory items & staples
  const handleGenerateSmartList = () => {
    const expiredItems = foodItems.filter(
      (i) => getExpiryStatus(i.expiryDate) === "expired"
    );

    const generated: ShoppingItem[] = expiredItems.map((item, idx) => ({
      id: "shop-auto-" + Date.now() + "-" + idx,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      estimatedPrice: 4.00,
      completed: false,
      isAutoGenerated: true,
    }));

    if (generated.length === 0) {
      // Add standard household staples if no expired items
      generated.push(
        {
          id: "shop-auto-" + Date.now() + "-1",
          name: "Organic Eggs",
          category: "Dairy",
          quantity: "1 Dozen",
          estimatedPrice: 4.50,
          completed: false,
          isAutoGenerated: true,
        },
        {
          id: "shop-auto-" + Date.now() + "-2",
          name: "Whole Grain Bread",
          category: "Bakery",
          quantity: "1 Loaf",
          estimatedPrice: 3.50,
          completed: false,
          isAutoGenerated: true,
        }
      );
    }

    setShoppingItems((prev) => [...generated, ...prev]);
    logActivity("Generated Shopping List", `Auto-added restock items`, "shopping");
  };

  // Move checked shopping items into food inventory
  const handleMoveBoughtToInventory = () => {
    const bought = shoppingItems.filter((i) => i.completed);
    if (bought.length === 0) return;

    const newFoodItems: FoodItem[] = bought.map((b, idx) => ({
      id: "item-bought-" + Date.now() + "-" + idx,
      name: b.name,
      category: b.category === "General" ? "Pantry" : (b.category as any),
      quantity: b.quantity,
      purchaseDate: getRelativeDate(0),
      expiryDate: getRelativeDate(7),
      storageLocation: "Fridge",
      createdAt: Date.now(),
    }));

    setFoodItems((prev) => [...newFoodItems, ...prev]);
    setShoppingItems((prev) => prev.filter((i) => !i.completed));
    logActivity("Restocked Pantry", `Moved ${bought.length} bought items to inventory`, "add");
  };

  // Reset demo state
  const handleResetData = () => {
    setFoodItems(INITIAL_FOOD_ITEMS);
    setShoppingItems(INITIAL_SHOPPING_ITEMS);
    setActivities(INITIAL_ACTIVITIES);
    setUserProfile(INITIAL_PROFILE);
    setRecipesCount(3);
    localStorage.clear();
  };

  // Active alert count (expired or expiring in 3 days)
  const alertCount = foodItems.filter((i) => {
    const st = getExpiryStatus(i.expiryDate);
    return st === "expired" || st === "expiring-soon";
  }).length;

  return (
    <div
      className={`min-h-screen bg-gray-50 text-gray-900 font-sans antialiased selection:bg-emerald-500 selection:text-white ${
        userProfile.darkMode ? "dark bg-gray-950 text-gray-100" : ""
      }`}
    >
      {/* SPLASH SCREEN */}
      <AnimatePresence>
        {showSplash && <Splash onDismiss={dismissSplash} />}
      </AnimatePresence>

      {/* TOP HEADER */}
      <Header
        user={userProfile}
        foodItems={foodItems}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setActiveTab("profile")}
        onShowSplash={() => setShowSplash(true)}
      />

      {/* MAIN CONTENT AREA */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 pb-24">
        {!isLoggedIn ? (
          <AuthScreen
            onLoginSuccess={handleLoginSuccess}
            onRegisterSuccess={handleRegisterSuccess}
          />
        ) : (
          <>
            {activeTab === "home" && (
              <HomeScreen
                foodItems={foodItems}
                activities={activities}
                recipesCount={recipesCount}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenAddModal={() => setIsAddModalOpen(true)}
                onConsumeItem={handleConsumeFood}
                onDeleteItem={handleDeleteFood}
                onNavigateToRecipesWithItems={handleNavigateToRecipes}
              />
            )}

            {activeTab === "inventory" && (
              <InventoryScreen
                foodItems={foodItems}
                onOpenAddModal={() => setIsAddModalOpen(true)}
                onOpenEditModal={handleOpenEdit}
                onConsumeItem={handleConsumeFood}
                onDeleteItem={handleDeleteFood}
                onCookRecipe={handleNavigateToRecipes}
              />
            )}

            {activeTab === "recipes" && (
              <AiRecipeScreen
                foodItems={foodItems}
                preselectedIngredients={recipePreselected}
                onAddMissingToShoppingList={handleAddMissingToShoppingList}
                onIncrementRecipeCount={() => setRecipesCount((prev) => prev + 1)}
              />
            )}

            {activeTab === "shopping" && (
              <ShoppingListScreen
                shoppingItems={shoppingItems}
                foodItems={foodItems}
                onToggleItem={handleToggleShopping}
                onAddItem={handleAddShopping}
                onDeleteItem={handleDeleteShopping}
                onClearCompleted={handleClearCompletedShopping}
                onGenerateSmartList={handleGenerateSmartList}
                onMoveBoughtToInventory={handleMoveBoughtToInventory}
              />
            )}

            {activeTab === "profile" && (
              <ProfileScreen
                user={userProfile}
                onUpdateProfile={(updated) => setUserProfile((prev) => ({ ...prev, ...updated }))}
                onResetData={handleResetData}
                onLogout={handleLogout}
              />
            )}
          </>
        )}
      </main>

      {/* BOTTOM NAVIGATION BAR */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        alertCount={alertCount}
      />

      {/* MODAL DIALOGS */}
      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        foodItems={foodItems}
        onConsumeItem={handleConsumeFood}
        onDeleteItem={handleDeleteFood}
        onNavigateToRecipes={handleNavigateToRecipes}
      />

      <AddFoodModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddFood={handleAddFood}
      />

      <EditFoodModal
        isOpen={isEditModalOpen}
        item={editingFoodItem}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingFoodItem(null);
        }}
        onUpdateFood={handleUpdateFood}
      />
    </div>
  );
}
