import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
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
    const { itemName, category } = req.body || {};
    if (!itemName) {
      return res.status(400).json({ error: "Item name is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        estimatedDays: 7,
        suggestedCategory: category || "Produce",
        storageTip: "Keep in a cool, dry place or refrigerate for maximum freshness."
      });
    }

    const ai = new GoogleGenAI({ apiKey });

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
    return res.status(200).json(JSON.parse(jsonText));
  } catch (error: any) {
    console.error("Vercel suggest-expiry error:", error);
    return res.status(200).json({
      estimatedDays: 7,
      suggestedCategory: req.body?.category || "Pantry",
      storageTip: "Store in a cool, dry location."
    });
  }
}
