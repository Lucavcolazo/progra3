// lib/openrouter.ts
// Next 15 tiene fetch global disponible

const BASE = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
const API_KEY = process.env.OPENROUTER_API_KEY;
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || "anthropic/claude-3-haiku";

if (!API_KEY) {
  console.warn("OPENROUTER_API_KEY no configurada — config en .env.local");
}

/**
 * Llama al endpoint de OpenRouter en modo streaming y devuelve el ReadableStream
 * Nota: la forma exacta de streaming depende de la compatibilidad OpenAI/OpenRouter.
 * Este ejemplo asume que la API responde con un stream de texto (chunks). Si el proveedor usa SSE o NDJSON, ajustar parseo.
 */
export async function callOpenRouterStream(messages: { role: string; content: string }[], model?: string) {
  const usedModel = model || DEFAULT_MODEL;

  // Verificar que tenemos la API key
  if (!API_KEY) {
    throw new Error("OPENROUTER_API_KEY no está configurada. Por favor, crea un archivo .env.local con tu API key.");
  }

  const payload = {
    model: usedModel,
    messages: messages.map(m => ({
      role: m.role,
      content: m.content
    })),
    stream: true,
    max_tokens: 1000,
    temperature: 0.2,
  };

  console.log("Enviando request a OpenRouter con modelo:", usedModel);
  console.log("API Key configurada:", API_KEY ? "Sí" : "No");

  const url = `${BASE}/chat/completions`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
      "HTTP-Referer": "http://localhost:3000", // Opcional pero recomendado
      "X-Title": "Chatbot App", // Opcional pero recomendado
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok || !res.body) {
    const txt = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${txt}`);
  }

  // Devolvemos directamente el stream del proveedor para que Next lo envíe al cliente
  // Si OpenRouter usa SSE con prefijo "data: ", podrías necesitar parsear y extraer el campo `delta` o `text`.
  return res.body;
}
