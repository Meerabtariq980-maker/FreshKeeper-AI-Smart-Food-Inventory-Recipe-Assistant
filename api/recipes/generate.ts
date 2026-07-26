import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { ingredients, preferences, cuisine } = req.body || {};
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: "Please select at least one ingredient." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback recipe when GEMINI_API_KEY environment variable is not set on Vercel
      return res.status(200).json({
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

    const ai = new GoogleGenAI({ apiKey });

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
    return res.status(200).json(recipeData);
  } catch (error: any) {
    console.error("Vercel handler recipe error:", error);
    return res.status(200).json({
      recipeName: `Zero-Waste ${req.body?.ingredients?.[0] || "Special"} Skillet`,
      cookingTime: "20 mins",
      difficulty: "Easy",
      ingredientsUsed: req.body?.ingredients || ["Pantry ingredients"],
      instructions: [
        `Wash and prep available ingredients: ${(req.body?.ingredients || []).join(", ")}.`,
        "Heat 1 tbsp oil in a skillet over medium heat.",
        "Sauté ingredients until tender and fragrant.",
        "Season to taste with spices, salt, and pepper, then serve warm!"
      ],
      nutritionTips: "Balanced macro and micronutrients for healthy home cooking.",
      foodWasteTip: "Repurpose leftovers into tomorrow's breakfast omelet or wrap!"
    });
  }
}
