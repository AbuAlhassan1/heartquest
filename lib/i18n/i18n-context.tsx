"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Language, type TranslationKey, translations } from "./translations"

type I18nContextType = {
  language: Language
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
  changeLanguage: (lang: Language) => void
  dir: "ltr" | "rtl"
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en")

  // Set the document direction based on language
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = language

    // Store the language preference
    localStorage.setItem("language", language)
  }, [language])

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
      setLanguage(savedLanguage)
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split("-")[0]
      if (browserLang === "ar") {
        setLanguage("ar")
      }
    }
  }, [])

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    let text = translations[language][key] || translations.en[key] || key

    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(new RegExp(`{${param}}`, "g"), String(value))
      })
    }

    return text
  }

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
  }

  return (
    <I18nContext.Provider value={{ language, t, changeLanguage, dir: language === "ar" ? "rtl" : "ltr" }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
