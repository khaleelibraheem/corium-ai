// export async function POST(req) {
//   try {
//     const body = await req.json();

//     const { skinType, concerns, products } = body;

//     // --- Generate dynamic-looking content ---
//     const formattedConcerns = concerns.join(", ");

//     const analysis = `
// Based on your profile, your skin presents characteristics of ${skinType} skin with notable concerns around ${formattedConcerns}.
// Your current routine indicates potential ingredient conflicts and opportunities to strengthen your barrier, rebalance oil production,
// and improve overall clarity and tone. The regimen below is structured to gently correct underlying issues while supporting long-term skin health.
//     `.trim();

//     // --- Morning Routine ---
//     const am_routine = [
//       {
//         type: "Cleanser",
//         name: "pH-Balanced Gel Cleanser",
//         note: "Removes overnight oil buildup while maintaining barrier integrity. Ideal for preparing the skin for actives."
//       },
//       {
//         type: "Treatment",
//         name: "Antioxidant Vitamin C Serum (10-15%)",
//         note: "Targets discoloration, brightens dull tone, and offers environmental protection throughout the day."
//       },
//       {
//         type: "Moisturizer",
//         name: "Lightweight Hydrating Emulsion",
//         note: "Balances moisture levels without heaviness; prevents transepidermal water loss."
//       },
//       {
//         type: "SPF",
//         name: "Broad-Spectrum SPF 50+",
//         note: "Essential daily protection to prevent pigmentation, premature aging, and sensitivity flare-ups."
//       }
//     ];

//     // --- Evening Routine ---
//     const pm_routine = [
//       {
//         type: "Cleanser",
//         name: "Deep-Pore Micellar Cleanser",
//         note: "Effectively dissolves sunscreen, oil, and debris without stripping the skin."
//       },
//       {
//         type: "Treatment",
//         name: "Retinoid (0.2–0.5%)",
//         note: "Supports cell renewal, reduces acne formation, smooths texture, and improves fine lines. Start 2–3x weekly."
//       },
//       {
//         type: "Moisturizer",
//         name: "Barrier Repair Night Cream",
//         note: "Replenishes ceramides and lipids to strengthen the skin barrier, especially important when using retinoids."
//       }
//     ];

//     // --- Expert Tips ---
//     const tips = [
//       "Introduce retinoids slowly to avoid irritation: begin with twice weekly applications.",
//       "Avoid using Vitamin C and retinoids in the same routine to prevent sensitivity.",
//       "Reapply sunscreen every 2–3 hours if outdoors for extended periods.",
//       "Hydrate adequately—internal hydration improves elasticity and texture.",
//       "Patch-test any new product, especially if your skin is reactive or sensitive.",
//       "Avoid over-exfoliation; limit acids to 1–2x weekly depending on tolerance."
//     ];

//     return Response.json({
//       analysis,
//       am_routine,
//       pm_routine,
//       tips
//     });
//   } catch (e) {
//     console.error("API ERROR:", e);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// }

// import OpenAI from "openai";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function POST(req) {
//   try {
//     const { skinType, concerns, products } = await req.json();

//     // Mock response for quick UI testing (Remove if you have a key)
//     if (!process.env.OPENAI_API_KEY) {
//       await new Promise(r => setTimeout(r, 2000));
//       return Response.json({
//         analysis: "Your skin barrier appears to be slightly compromised, indicated by the combination of surface dryness and reactive redness. The focus must be on 'hydration flooding'—using humectants to bind water—followed by biomimetic lipids to seal it in, while avoiding harsh exfoliants.",
//         am_routine: [
//           { name: "Milky Cream Cleanser", type: "Cleanse", note: "Do not use hot water." },
//           { name: "Hypochlorous Spray", type: "Balance", note: "Reduces bacteria and redness." },
//           { name: "Polyglutamic Acid Serum", type: "Hydrate", note: "Holds 4x more moisture than HA." },
//           { name: "Mineral SPF 30+", type: "Protect", note: "Zinc oxide is calming for redness." }
//         ],
//         pm_routine: [
//           { name: "Oat Cleansing Balm", type: "First Cleanse", note: "Melt makeup without stripping." },
//           { name: "Gentle Hydrating Wash", type: "Second Cleanse", note: "Remove residue." },
//           { name: "Azelaic Acid 10%", type: "Treat", note: "Targets redness and texture." },
//           { name: "Lipid-Rich Cream", type: "Repair", note: "Look for Ceramides 1, 3, and 6-II." }
//         ],
//         tips: [
//           "Simplify your routine; avoid fragrance.",
//           "Wash pillowcases with hypoallergenic detergent."
//         ]
//       });
//     }

//     const completion = await openai.chat.completions.create({
//       messages: [
//         { role: "system", content: `You are a celebrity dermatologist. Return JSON. Structure: { "analysis": "string", "am_routine": [{ "name": "string", "type": "string", "note": "string" }], "pm_routine": [{ "name": "string", "type": "string", "note": "string" }], "tips": ["string"] }` },
//         { role: "user", content: `Skin: ${skinType}, Concerns: ${concerns.join(", ")}, Products: ${products}` },
//       ],
//       model: "gpt-4o-mini",
//       response_format: { type: "json_object" },
//     });

//     return Response.json(JSON.parse(completion.choices[0].message.content));

//   } catch (error) {
//     return Response.json({ error: "Failed" }, { status: 500 });
//   }
// }

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

    // 4. Clean & Parse JSON
    // Remove markdown code fences if they exist
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    
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