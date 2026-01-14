
import { GoogleGenAI, Type } from "@google/genai";
import { MathResponse, MathTrick } from "../types";

// Initialize the Google GenAI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askBlackMamba = async (question: string, role: 'student' | 'parent' = 'student'): Promise<MathResponse> => {
  const systemPrompt = role === 'student' 
    ? "Eres 'BlackMamba', un tutor de matemáticas ultra-inteligente para adolescentes. Usa analogías de gaming, skate y música. Explica conceptos de forma visual y práctica."
    : "Eres el consultor educativo de 'Pao'. Ayuda a la madre a entender conceptos avanzados para explicárselos a su hijo de 14 años. Sé clara, profesional y empática.";

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: question,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          answer: { type: Type.STRING },
          explanation: { type: Type.STRING },
          visualData: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, description: 'One of: pie, bar, scale, none, function, vector' },
              value: { type: Type.NUMBER },
              total: { type: Type.NUMBER },
              label: { type: Type.STRING }
            },
            required: ['type', 'value', 'total', 'label']
          }
        },
        required: ['answer', 'explanation', 'visualData']
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}') as MathResponse;
  } catch (e) {
    return {
      answer: "Error al procesar",
      explanation: "No pude generar una respuesta estructurada.",
      visualData: { type: 'none', value: 0, total: 100, label: 'Error' }
    };
  }
};

export const generateCircuitVisual = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `Genera un esquemático técnico y profesional de electrónica y mecatrónica. El diseño debe ser limpio, con estilo industrial cyberpunk, mostrando componentes como Arduino, resistencias, motores o sensores según esta descripción: ${prompt}. El fondo debe ser oscuro.` }
        ]
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating circuit visual:", error);
    return null;
  }
};

export const getMathTricks = async (): Promise<MathTrick[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "Genera 4 trucos o 'hacks' matemáticos útiles para estudiantes de preparatoria.",
    config: {
      systemInstruction: "Eres un experto en mnemotecnia y atajos matemáticos. Proporciona trucos creativos y fáciles de recordar.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            example: { type: Type.STRING },
            visualHint: { type: Type.STRING }
          },
          required: ['title', 'description', 'example', 'visualHint']
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]') as MathTrick[];
  } catch (e) {
    return [];
  }
};

export const getPlanningAdvice = async (focusTopics: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Dame un consejo corto y motivador para planear el estudio de: ${focusTopics}`,
    config: {
      systemInstruction: "Eres Pao, una madre y mentora experta en organización. Da consejos breves, cálidos y estratégicos.",
    }
  });

  return response.text || "Mantén el enfoque y celebra cada pequeño logro.";
};
