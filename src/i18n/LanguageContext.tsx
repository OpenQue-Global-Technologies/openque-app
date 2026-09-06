import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getStoredLanguage, persistLanguage, syncLanguageToServer } from './languageStore';
import { translations, type Language, type TranslationKey } from './translations';

type LanguageContextValue = {
  language: Language;
  isSyncing: boolean;
  setLanguage: (language: Language) => Promise<void>;
  resetToDefault: () => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    getStoredLanguage().then(setLanguageState);
  }, []);

  const setLanguage = async (next: Language) => {
    setLanguageState(next); // immediate UI update
    await persistLanguage(next); // local persist, per the v6 hybrid decision
    setIsSyncing(true);
    await syncLanguageToServer(next); // mock server sync
    setIsSyncing(false);
  };

  const resetToDefault = () => setLanguageState('en');

  const t = (key: TranslationKey) => translations[language][key];

  const value = useMemo(
    () => ({ language, isSyncing, setLanguage, resetToDefault, t }),
    [language, isSyncing],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
