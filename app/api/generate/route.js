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

// Initialize Gemini client with explicit API key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Extract first JSON object from any string
function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/); // first {...} block
  if (!match) throw new Error("No JSON found in model output");
  return match[0];
}

export async function POST(req) {
  try {
    const { skinType, concerns, products } = await req.json();

    // Fallback mock data if no API key
    // if (!process.env.GEMINI_API_KEY) {
    //   await new Promise((r) => setTimeout(r, 2000));
    //   return Response.json({
    //     analysis: "Your skin barrier appears to be slightly compromised, indicated by dryness and sensitivity.",
    //     am_routine: [
    //       { name: "Milky Cream Cleanser", type: "Cleanse", note: "Avoid hot water.", example: "La Roche-Posay Toleriane Hydrating Cleanser" },
    //       { name: "Hypochlorous Spray", type: "Balance", note: "Reduces redness.", example: "Tower 28 SOS Daily Rescue Spray" },
    //       { name: "Polyglutamic Acid Serum", type: "Hydrate", note: "Boosts hydration.", example: "The Inkey List Polyglutamic Acid" },
    //       { name: "Mineral SPF 30+", type: "Protect", note: "Zinc calms skin.", example: "EltaMD UV Restore SPF 40" },
    //     ],
    //     pm_routine: [
    //       { name: "Oat Cleansing Balm", type: "First Cleanse", note: "Gentle on the barrier.", example: "The Inkey List Oat Cleansing Balm" },
    //       { name: "Hydrating Wash", type: "Second Cleanse", note: "Non-stripping.", example: "CeraVe Hydrating Cleanser" },
    //       { name: "Azelaic Acid 10%", type: "Treat", note: "Targets redness & texture.", example: "The Ordinary Azelaic Acid Suspension 10%" },
    //       { name: "Lipid Cream", type: "Repair", note: "Ceramides restore barrier.", example: "Skinfix Barrier+ Triple Lipid Peptide Cream" },
    //     ],
    //     tips: ["Avoid fragrance.", "Wash pillowcases regularly."],
    //   });
    // }

    // ⭐ Updated prompt including example field
const prompt = `
You are a celebrity dermatologist.
Return **only valid JSON**, with no markdown, no code fences, no examples outside the JSON, and no commentary.

STRUCTURE:
{
  "analysis": "string",
  "am_routine": [
    { 
      "name": "string", 
      "type": "string", 
      "note": "string",
      "example": "string",
      "price_range": "string"
    }
  ],
  "pm_routine": [
    { 
      "name": "string", 
      "type": "string", 
      "note": "string",
      "example": "string",
      "price_range": "string"
    }
  ],
  "tips": ["string"]
}

PRODUCT RULES:
- "example" must be a **real product widely available in India**.
- Price ranges must be realistic for India (e.g., "₹250–₹450", "₹799–₹1299").
- Avoid rare or prescription-only products.
- Do NOT include links, availability notes, or store names — ONLY the brand product name and price range.

STYLE RULES:
- Keep product names concise.
- Output strictly valid JSON.
- No additional text before or after the JSON.

Skin: ${skinType}
Concerns: ${concerns.join(", ")}
Products user already uses: ${products}
`;


    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      responseMimeType: "application/json",
      contents: prompt,
    });

    // Gemini already returns clean JSON because of responseMimeType
    const json = JSON.parse(response.text);

    return Response.json(json);
  } catch (error) {
    console.error("Gemini parse error:", error);
    return Response.json(
      { error: "Failed to generate valid JSON" },
      { status: 500 }
    );
  }
}
