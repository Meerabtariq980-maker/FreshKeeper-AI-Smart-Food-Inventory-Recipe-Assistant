import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini API client initialization
  function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // API endpoint: Generate AI Recipe
  app.post("/api/recipes/generate", async (req, res) => {
    try {
      const { ingredients, preferences, cuisine } = req.body;
      if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: "Please select at least one ingredient." });
      }

      const ai = getGeminiClient();
      if (!ai) {
        // Fallback response if GEMINI_API_KEY is not configured
        return res.json({
          recipeName: `Zero-Waste ${ingredients[0]} Delight`,
          cookingTime: "25 mins",
          difficulty: "Easy",
          ingredientsUsed: ingredients,
          instructions: [
            `Prep and chop the selected ingredients: ${ingredients.join(", ")}.`,
            "Heat 1 tbsp oil in a skillet over medium heat.",
            `Sauté ${ingredients[0]} until fragrant and lightly caramelized.`,
            `Add remaining ingredients (${ingredients.slice(1).join(", ") || "seasonings"}) and toss thoroughly.`,
            "Simmer for 10-15 minutes, season with salt and pepper, and serve hot!"
          ],
          nutritionTips: "Rich in essential fiber, micronutrients, and lean energy to power your day.",
          foodWasteTip: "Use leftover vegetable stems and peels to make a rich homemade broth!"
        });
      }

      const prompt = `You are an expert chef specializing in zero-waste cooking.
Generate a delicious recipe using these primary ingredients: ${ingredients.join(", ")}.
Dietary preferences or constraints: ${preferences || "None"}.
Style/Cuisine preference: ${cuisine || "Quick & Easy"}.

Return a JSON object with:
- recipeName (string)
- cookingTime (string, e.g. "20 mins")
- difficulty (string: "Easy", "Medium", or "Hard")
- ingredientsUsed (array of strings)
- instructions (array of step-by-step instruction strings)
- nutritionTips (string)
- foodWasteTip (string explaining how this recipe reduces household food waste)`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recipeName: { type: Type.STRING },
              cookingTime: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              ingredientsUsed: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              instructions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              nutritionTips: { type: Type.STRING },
              foodWasteTip: { type: Type.STRING }
            },
            required: ["recipeName", "cookingTime", "difficulty", "ingredientsUsed", "instructions", "nutritionTips", "foodWasteTip"]
          }
        }
      });

      const jsonText = response.text?.trim();
      if (!jsonText) {
        throw new Error("No response generated from Gemini AI.");
      }

      const recipeData = JSON.parse(jsonText);
      return res.json(recipeData);
    } catch (error: any) {
      console.error("Error generating recipe:", error);
      return res.status(500).json({ error: error.message || "Failed to generate recipe." });
    }
  });

  // API endpoint: AI Smart Item Suggestion / Expiry Estimator
  app.post("/api/items/suggest-expiry", async (req, res) => {
    try {
      const { itemName, category } = req.body;
      if (!itemName) {
        return res.status(400).json({ error: "Item name is required." });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          estimatedDays: 7,
          suggestedCategory: category || "Produce",
          storageTip: "Keep in a cool, dry place or refrigerate for maximum freshness."
        });
      }

      const prompt = `For the food item "${itemName}" (category: ${category || "Unknown"}), estimate standard fresh fridge/pantry shelf life from today.
Return a JSON object with:
- estimatedDays (number, estimated shelf life days from purchase)
- suggestedCategory (string: Vegetables, Fruits, Dairy, Meat, Frozen, Snacks, Drinks, Bakery, or Pantry)
- storageTip (string: short 1-sentence tip on best storage method to prevent spoilage)`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              estimatedDays: { type: Type.NUMBER },
              suggestedCategory: { type: Type.STRING },
              storageTip: { type: Type.STRING }
            },
            required: ["estimatedDays", "suggestedCategory", "storageTip"]
          }
        }
      });

      const jsonText = response.text?.trim();
      if (!jsonText) {
        throw new Error("Failed to estimate item info.");
      }
      return res.json(JSON.parse(jsonText));
    } catch (error: any) {
      console.error("Error suggesting item info:", error);
      return res.json({
        estimatedDays: 7,
        suggestedCategory: req.body.category || "Pantry",
        storageTip: "Store in a cool, dry location."
      });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FreshKeeper AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
