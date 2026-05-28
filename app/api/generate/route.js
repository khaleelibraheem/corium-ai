import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const { skinType, concerns, products } = await req.json();

    const prompt = `
    ACT AS: A Senior Clinical Dermatologist and Cosmetic Chemist.
    CONTEXT: The user is in India.
    
    TASK: Generate a hyper-personalized skincare protocol based on the user's biometrics and current product inventory.
    
    USER BIOMETRICS:
    - Skin Phenotype: ${skinType}
    - Primary Concerns: ${concerns.join(", ")}
    - Current Ritual/Inventory: ${products ? products : "None/Starting Fresh"}

    CRITICAL "CONFLICT ENGINE" LOGIC:
    1. Analyze the user's "Current Ritual".
    2. If they are using strong actives (Retinol, Tretinoin, high % AHA/BHA, Benzoyl Peroxide), do NOT recommend conflicting actives in the same routine block.
    3. If a user's current product is good, integrate it. If it is harmful/conflicting, replace it.
    4. Prioritize barrier health over aggressive treatment.

    OUTPUT RULES:
    - Return ONLY valid JSON.
    - Product recommendations must be widely available in India (Nykaa, Amazon India, Pharmacy brands).
    - Prices in Indian Rupees (₹).
    - "type" should be scientific functional steps (e.g., "Lipid Cleanse", "Tyrosinase Inhibitor", "Occlusive").

    JSON STRUCTURE:
    {
      "analysis": "A sophisticated, 2-sentence clinical diagnosis of their skin state based on the input.",
      "am_routine": [
        { 
          "name": "Product Name (Brand)", 
          "type": "Functional Step", 
          "note": "Why this specific ingredient fits their biology.",
          "example": "Specific Product Recommendation",
          "price_range": "₹XXX - ₹XXX"
        }
      ],
      "pm_routine": [
        // Same structure
      ],
      "tips": [
        "3 high-level clinical tips (e.g., about pillowcases, diet, or specific ingredient warnings)"
      ]
    }
    `;

    // 1. Call Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: { responseMimeType: "application/json" },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // 2. ERROR FIX: Handle the response structure correctly
    // The new SDK returns the object directly, NOT inside .data
    const candidate = response.candidates?.[0];

    // Check if the model refused to answer (Safety block) or failed
    if (!candidate || !candidate.content || !candidate.content.parts) {
      console.error("Gemini Response Error:", JSON.stringify(response, null, 2));
      throw new Error("Model returned no content. It might have been blocked by safety settings.");
    }

    // 3. Extract Text
    let rawText = candidate.content.parts[0].text;

    // 4. CLEANING & PARSING (The Fix)
    // Remove markdown code fences (```json)
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "");

    // ⭐ NEW: Remove bolding asterisks (**text**) and markdown symbols
    // This ensures your UI is strictly plain text
    rawText = rawText.replace(/\*\*/g, "").replace(/\*/g, "").replace(/#/g, "");
    
    const json = JSON.parse(rawText);

    return Response.json(json);

  } catch (error) {
    console.error("Generation Failed:", error);
    return Response.json(
      { error: "Failed to generate protocol. Please try again." },
      { status: 500 }
    );
  }
}