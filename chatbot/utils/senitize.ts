// utils/sanitize.ts
export function sanitizeInput(input: string) {
    // Sanitización básica: trim, elimina caracteres de control peligrosos, limita longitud y escapa tags
    const maxLen = 2000;
    let s = input.replace(/[\u0000-\u001F\u007F]/g, ""); // quitar caracteres de control
    s = s.trim();
    if (s.length > maxLen) s = s.slice(0, maxLen);
    // Escapar html para evitar inyección si llegara a inyectarse en HTML
    s = s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    return s;
  }
  