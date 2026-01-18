import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// In a real production app, ensure API_KEY is set in environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'DUMMY_KEY_FOR_UI_DEMO' });

export const analyzeProposalSafety = async (proposalTitle: string, proposalDescription: string): Promise<string> => {
  try {
    // If no key is provided in this demo environment, we return a mock response to avoid crashing
    if (!process.env.API_KEY) {
      console.warn("No API_KEY found. Returning mock AI analysis.");
      return new Promise((resolve) => {
        setTimeout(() => {
          if (proposalDescription.toLowerCase().includes("must") || proposalDescription.toLowerCase().includes("mandatory")) {
             resolve("⚠️ **RISK DETECTED**: This proposal contains coercive language ('must', 'mandatory'). It may violate the Anti-Coercion invariant. Recommendation: **Flag for Review**.");
          } else {
             resolve("✅ **SAFE**: This proposal appears to respect individual agency. No obvious coercion detected based on Merkabah invariants.");
          }
        }, 1500);
      });
    }

    const systemInstruction = `
      You are the Guardian AI for a Merkabah Governance System. 
      Your role is to analyze governance proposals for violations of the core invariants:
      1. Anti-Coercion: No entity can impose will on another.
      2. Balance: Individual will must balance with collective harmony.
      3. Fail-Closed: If safety is ambiguous, recommend halting.
      
      Analyze the provided proposal title and description. 
      Return a concise Markdown formatted assessment. 
      Start with an emoji (✅ or ⚠️ or 🛑).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Title: ${proposalTitle}\nDescription: ${proposalDescription}`,
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 0 } // Fast response needed
      }
    });

    return response.text || "Analysis complete, but no text returned.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "❌ Error analyzing proposal. System allows manual flagging.";
  }
};