export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh';

export interface SettingsContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}