# FreshKeeper AI 🥦🥑

> **Smart Household Food Inventory & AI Recipe Generator**  
> *Reduce food waste, track expiration dates, and cook delicious meals with the ingredients you already have.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-22C55E?style=for-the-badge&logo=vercel)](https://fresh-keeper-ai-smart-food-inventor.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

---

## 🔗 Live Application
🌐 **Explore the Live App:** [https://fresh-keeper-ai-smart-food-inventor.vercel.app/](https://fresh-keeper-ai-smart-food-inventor.vercel.app/)

---

## 💡 The Problem & The Idea

### The Challenge
Many households purchase groceries regularly but frequently forget what ingredients are sitting at the back of their fridge, freezer, or pantry. Fresh produce, dairy, meat, and leftovers often spoil before being cooked. This leads to:
* 📉 **Food Waste**: Billions of tons of wholesome food discarded annually.
* 💸 **Financial Losses**: Unnecessary spending on duplicate items and thrown-away groceries.
* 🌍 **Environmental Impact**: Increased landfill methane emissions and wasted agricultural resources.

### The Solution: FreshKeeper AI
**FreshKeeper AI** is an intelligent, user-friendly household management platform engineered to eliminate avoidable food waste. FreshKeeper AI tracks your food inventory in real time, alerts you when items approach their expiration dates, and uses Google Gemini AI to generate custom step-by-step recipes utilizing **strictly the ingredients available in your kitchen**.

---

## ✨ Key Features

### 📦 1. Smart Food Inventory Tracking
* **Multi-Storage Organization**: Categorize food items across `Fridge`, `Freezer`, and `Pantry`.
* **Shelf-Life Color Badges**: Instant visual identification for items:
  * 🔴 **Expired**: Discard or mark consumed.
  * 🟡 **Expiring Soon**: High priority for cooking.
  * 🟢 **Fresh**: Safe for extended storage.
* **Filter & Search**: Quickly search by item name or filter by storage location and food categories (`Produce`, `Dairy`, `Meat`, `Bakery`, `Beverages`, etc.).
* **AI Shelf-Life Estimation**: Automatically estimate typical expiry dates and storage tips using built-in AI heuristics.

### 🔔 2. Expiry Notifications & Alert System
* **Proactive Alerts**: Modal and badge notifications highlighting items expiring within 3 days or already expired.
* **One-Click Action**:
  * Mark items as **Consumed** (updates savings and impact stats).
  * Direct action to **Cook in AI Recipe** with pre-selected expiring ingredients.
  * Safely **Discard** expired items to keep inventory accurate.

### 🍳 3. Gemini AI Recipe Generator
* **Zero-Waste Cooking**: Select ingredients directly from your pantry to generate bespoke recipes.
* **Meal Customization**: Filter by dietary preferences (`Vegetarian`, `Vegan`, `Gluten-Free`, `Keto`, `Low-Calorie`) and meal type (`Breakfast`, `Lunch`, `Dinner`, `Snack`, `Dessert`).
* **Complete Culinary Cards**:
  * Detailed prep & cook times, calorie estimates, and difficulty ratings.
  * Step-by-step clear cooking instructions.
  * Missing ingredient detection with one-click **Add to Shopping List**.

### 🛒 4. Smart Household Shopping List & Auto-Restock
* **Auto-Generated Provisions**: Automatically generate restock lists based on consumed and missing household items.
* **Cost Estimations**: Track estimated item costs and overall shopping budget.
* **Move to Pantry**: One-click transfer of purchased items directly into your food inventory upon returning from the store.

### 🔐 5. User Authentication & Household Roles
* **Secure Login & Registration**: User sign-in and sign-up with email and password or quick social sign-in.
* **Household Roles**: Tailor your profile as `Household Manager`, `Primary Chef`, `Shared Roommate`, or `Student`.
* **Profile Avatars & Preferences**: Customizable avatar selections, notification toggles, and high-contrast dark theme preferences.

### 📊 6. Impact & Sustainability Metrics
* **Money Saved**: Track estimated monthly savings achieved by consuming food before it spoils.
* **Waste Prevented (kg)**: Quantify food waste reduced and corresponding CO2 emissions prevented.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18, TypeScript |
| **Styling & Design System** | Tailwind CSS v4, Lucide React Icons |
| **Animations** | Motion (`motion/react`) |
| **AI SDK & Server Proxy** | `@google/genai` TypeScript SDK, Express proxy server |
| **Bundler & Build Tool** | Vite, ESBuild, TSX |
| **State Persistence** | Browser Local Storage & Session State Engine |

---

## 🚀 Getting Started locally

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** or **bun** / **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/fresh-keeper-ai.git
cd fresh-keeper-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p center>
Built with ❤️ to eliminate household food waste & save money with AI.
</p>
