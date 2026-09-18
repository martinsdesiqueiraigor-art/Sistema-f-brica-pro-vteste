// Utilitário de armazenamento 100% seguro com fallback em memória
// Previne crashes em navegadores móveis (Android content:// e file:// onde localStorage é restrito por segurança)

const memoria: Record<string, string> = {};

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Ignora erro de segurança do sandbox Android
    }
    return memoria[key] ?? null;
  },

  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Ignora erro de segurança do sandbox Android
    }
    memoria[key] = value;
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Ignora erro de segurança do sandbox Android
    }
    delete memoria[key];
  },
};
