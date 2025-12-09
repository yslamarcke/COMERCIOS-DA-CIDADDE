import { GoogleGenAI, Type } from "@google/genai";
import { AIParsedTransaction } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Parses a natural language string into a structured transaction using Gemini.
 */
export const parseTransactionFromText = async (text: string): Promise<AIParsedTransaction | null> => {
  if (!apiKey) {
    console.warn("API Key is missing for Gemini.");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a data entry assistant for a debt spreadsheet. 
      Extract transaction details from this text: "${text}". 
      We need the name of the person, the amount, and a short description of the item.
      Example: "Matias owes 50 for beer" -> Name: Matias, Amount: 50, Desc: Beer.
      Example: "Add 20 to Sandro for uber" -> Name: Sandro, Amount: 20, Desc: Uber.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Name of the person" },
            amount: { type: Type.NUMBER, description: "Monetary value" },
            description: { type: Type.STRING, description: "Brief description of the item" },
          },
          required: ["name", "amount", "description"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIParsedTransaction;
    }
    return null;
  } catch (error) {
    console.error("Error parsing transaction with Gemini:", error);
    return null;
  }
};