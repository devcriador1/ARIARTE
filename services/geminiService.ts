import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { PrintSettings } from "../types";
import { CONTACT_INFO } from "../constants";

// Initialize Gemini Client
// Fixed to follow guidelines: Use process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Analysis Service
export const analyzePrintSettings = async (productName: string, productDesc: string): Promise<PrintSettings & { tips: string[] }> => {
  // Guidelines: Assume API key is pre-configured and valid. 
  // However, keeping the check for safety in this specific service implementation to avoid crashing with mock data fallback.
  if (!process.env.API_KEY) {
    console.warn("API Key missing, returning mock data");
    return {
      nozzleTemp: "200°C",
      bedTemp: "60°C",
      layerHeight: "0.2mm",
      infill: "20%",
      supports: true,
      notes: "API Key ausente. Dados simulados.",
      tips: ["Verifique o nivelamento da mesa", "Use cola bastão se necessário"]
    };
  }

  const modelId = "gemini-2.5-flash";
  
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      nozzleTemp: { type: Type.STRING, description: "Recommended nozzle temperature range" },
      bedTemp: { type: Type.STRING, description: "Recommended bed temperature range" },
      layerHeight: { type: Type.STRING, description: "Recommended layer height" },
      infill: { type: Type.STRING, description: "Recommended infill percentage" },
      supports: { type: Type.BOOLEAN, description: "Whether supports are likely needed" },
      notes: { type: Type.STRING, description: "Brief technical notes about orientation or material" },
      tips: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "3 expert tips for printing this specific object"
      }
    },
    required: ["nozzleTemp", "bedTemp", "layerHeight", "infill", "supports", "notes", "tips"]
  };

  try {
    const prompt = `Aja como um engenheiro especialista em impressão 3D da Ariarte. 
    Analise o seguinte objeto para fornecer configurações de fatiamento otimizadas:
    Nome: ${productName}
    Descrição: ${productDesc}
    
    Forneça estimativas realistas e seguras para uma impressora FDM padrão.`;

    const result = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const text = result.text;
    if (!text) throw new Error("No data returned from Gemini");
    
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Fallback data in case of error
    return {
      nozzleTemp: "205-215°C",
      bedTemp: "60°C",
      layerHeight: "0.2mm",
      infill: "15-20%",
      supports: true,
      notes: "Falha na análise automática. Use configurações padrão.",
      tips: ["Mantenha o filamento seco", "Verifique a calibração do fluxo"]
    };
  }
};

// Chat Service
let chatSession: Chat | null = null;

export const chatWithAri = async (message: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Desculpe, meu sistema neural (API Key) não está conectado no momento.";
  }

  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `Você é 'Ari', a inteligência artificial de suporte e atendimento da 'Ariarte 3D'.
        
        Detalhes da Ariarte:
        - Especialidade: Impressão 3D de alta fidelidade, artefatos futuristas, cosplay e peças técnicas.
        - Estilo: Futurista, Cyberpunk, High-tech.
        - Telefone/Whatsapp para contato: ${CONTACT_INFO.phone}
        - Instagram Oficial: ${CONTACT_INFO.instagram}
        
        Suas funções:
        1. Responder dúvidas sobre materiais (PLA, ABS, Resina, etc).
        2. Ajudar a escolher modelos baseados no catálogo.
        3. Se o cliente quiser um orçamento personalizado, peça para entrar em contato pelo Whatsapp (${CONTACT_INFO.phone}) ou Direct do Instagram.
        4. Seja educado, mas mantenha uma personalidade levemente robótica e futurista.
        5. Respostas concisas e diretas.
        
        Se perguntarem sobre preços específicos, diga que depende do tamanho, preenchimento e material, e sugira contato direto pelo Whatsapp.`
      }
    });
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "Erro no processamento da resposta.";
  } catch (error) {
    console.error("Chat error:", error);
    return "Houve uma interferência no sinal. Por favor, tente novamente ou contate-nos pelo Instagram.";
  }
};